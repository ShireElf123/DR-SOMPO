# Site repairs and verification — 1 November 2026

## Delivery status

Implemented on `arena/a5f32632-dr-sompo`, following the [22-finding audit](../2026-11-01/README.md) of baseline `e1d66e914888660fd381f07101cb16f767d97519` and the subsequently reported footer-banner glitch. The visual direction, previous Home re-entry fix and mobile appointment containment were preserved.

**Initial repair handoff:** the working tree and local production-build preview were verified before publishing; no production deployment was made during that repair phase. PR #1 remained **OPEN and unmerged**, and a read-only GitHub check confirmed `main` was still `d7617cff2fc14aeae91a0b3c15a07e4525c57643`.

**Publishing authorised:** the user subsequently approved pushing and publishing these repairs on 1 November 2026, without merging PR #1. The deployment must use this same working branch and keep online collection disabled. The exact deployed commit, rollout outcome and remote CI results are recorded in [PR #1](https://github.com/ShireElf123/DR-SOMPO/pull/1) after verification; this report's local test results are not a claim that deployment has already succeeded.

**137 automated checks pass: 100 browser scenarios and 37 Node/API/calendar/budget tests.** The banner suite was then strengthened to compare corresponding text positions across the loop boundary and its eight tests passed again. A separate unconfigured-preview scan/probe also passed. These are specific regression checks, not a claim of complete accessibility, medical, legal or delivery certification.

Online collection remains **off** in the ordinary preview. Real delivery, provider/privacy/abuse-control approval and approved photography are still external launch requirements. They have safe, visible fallbacks rather than invented configuration or assurances. See [enquiry operations](../../enquiry-operations.md).

## The reported moving-banner glitch

### Root cause, not a cosmetic cover-up

The old footer had two copies of an approximately **826.86 px** text sequence. The animation translated the entire track by half its width. A pair of copies is only sufficient if **each cycle is at least as wide as the visible banner**. On wide displays, the second copy ran out before the loop reset, revealing an empty tail and then a jump back to the start.

Measured at 99.9% of the old cycle:

| Viewport | Old blank tail | Repaired blank tail |
| ---: | ---: | ---: |
| 390 px | 0 px | 0 px |
| 768 px | 0 px | 0 px |
| 1440 px | 612.31 px | 0 px |
| 1920 px | 1092.31 px | 0 px |
| 2560 px | 1732.31 px | 0 px |

The new shared marquee owns **two identical cycle wrappers**, each at least its container's width, with a `100vw` fallback for browsers without container units. Its travel distance remains exactly one cycle. The browser handles resize and font/layout changes without a resize timer or per-frame React updates.

The component also provides:

- An accessible Pause/Resume control and keyboard/hover pause behaviour. Hover pause is restricted to hover-capable devices, avoiding a stuck touch-hover state.
- Only one accessible copy; the visual duplicate is `aria-hidden` and inert.
- A readable non-animated, manually scrollable no-JavaScript state.
- Wrapped static content for reduced motion, without a clipped final item or a redundant pause control.

### Evidence

- [Before geometry](evidence/banner-before.json), [before screenshot](evidence/banner-before-1440.png).
- [Intentionally failing regression on the old build](evidence/banner-red.txt): at 1440 px the old track ended at 1240.29 px in a sampled phase, short of the required 1439 px boundary.
- [After geometry](evidence/banner-after.json): **zero blank coverage in all 48 samples**, covering six widths (320, 390, 768, 1440, 1920, 2560) at eight phases, including immediately before/after a reset.
- [After screenshot](evidence/banner-after-1440.png), frozen near the end of the second cycle.
- [Strengthened seam/resize/pause/reduced-motion results](evidence/banner-final.txt). Corresponding text positions, not only the outer track rectangle, are compared across the seam. A wrong translation distance would fail even if the track still covered the viewport.
- Durable regression: [`tests/e2e/banner.spec.ts`](../../../tests/e2e/banner.spec.ts).

## Audit finding disposition

“Corrected” refers to the implemented defect and tested behaviour. “Gated” or “mitigated” deliberately distinguishes code changes from approvals/services that are not available.

| Finding | Repair / current disposition |
| --- | --- |
| **F01 — non-working delivery appeared usable** | **Gated.** Collection requires an explicit enable flag and valid HTTPS receiver configuration. Otherwise the page has telephone/email alternatives and no form fields. Real receiver setup/receipt verification is still required. |
| **F02 — native GET could expose personal details** | **Corrected.** Explicit POST action; fields disabled in SSR until hydration; unsupported native submission receives 415 without echoing entered data. Browser fallback test confirms details do not enter the URL. |
| **F03 — mobile Book destroyed the draft** | **Corrected.** Same-Contact Book scrolls/focuses the existing request instead of navigating/reloading. Entered details and the service query survive. |
| **F04 — generated imagery implied verified identity/premises** | **Mitigated.** Generated photos have truthful alternatives, page-level notices and explicit illustrative portrait labels. Art-directed images use a neutral description valid for both sources. These remain placeholders, not approved photographs of the doctor, patients or premises. |
| **F05 — clipped page headings/copy** | **Corrected.** The aspect-ratio spacer and complete copy share an in-flow grid cell; the row grows to the larger content requirement. Verified all 12 routes at eight widths, plus enlarged text/spacing. |
| **F06 — Home FAQ controls did nothing** | **Corrected.** Shared native details/summary controls toggle the complete answers with mouse/keyboard and without JavaScript. |
| **F07 — displayed/submitted service mismatch** | **Corrected.** Canonical service IDs throughout; legacy titles resolve consistently. API forwards both canonical ID and readable title. Overview/detail journeys are tested. |
| **F08 — timezone/hydration/date errors** | **Corrected.** One server-generated SAST date rail; strict calendar/date-range checks and explicit date-only formatting. Tested Johannesburg, Auckland and Los Angeles. |
| **F09 — errors off-screen or under wrong keys** | **Corrected.** Focused, visible summary with field links; shared date/slot keys; delivery failures focus their alert; retry retains input. |
| **F10 — pending WhatsApp accepted as available** | **Corrected.** Pending channel visibly disabled in the form and rejected by the API until its availability is actually confirmed. |
| **F11 — unverified opening-hours/response promises** | **Corrected copy.** Open-now/next-day promises removed; users must confirm hours and availability. Actual practice hours and response policy still require approval. |
| **F12 — inaccurate privacy assurances** | **Corrected copy, approval outstanding.** Removed categorical “nothing stored”/compliance assurances. The notice explains conditional delivery and possible provider/hosting retention. Linked beside consent. No retention policy or legal certification was invented. |
| **F13 — collapsed FAQ content exposed incorrectly** | **Corrected.** Native disclosure semantics hide closed answers from the accessibility tree while retaining progressive enhancement. |
| **F14 — text contrast failures** | **Corrected measured cases.** Footer/date/about ordinal/top-ticker colours adjusted. Automated WCAG-tagged scans pass; image-backed/other incomplete contrast results still require manual judgement, not a blanket conformity claim. |
| **F15 — radio keyboard focus missing** | **Corrected.** Visible focus outline on the actual radio label; native arrow-key behaviour retained. Dark/inverse surfaces receive a contrasting outline. |
| **F16 — heading/list semantics** | **Corrected.** Missing heading targets restored; service definition lists now have valid term/description relationships. Broken `aria-labelledby` references are regression-tested. |
| **F17 — cursor ignored live reduced-motion changes** | **Corrected.** The decorative follower unmounts on preference change, cleaning up RAF/listeners, and can remount. Its implementation is lazy-loaded for fine pointers rather than included in the initial/mobile path. |
| **F18 — weak/unsafe API handling** | **Hardened, activation prerequisite remains.** Strict body/root/field-type/calendar/contact/consent/enum checks; bounded 8 KiB stream; no false honeypot receipt; no body logging; timeout/no redirects/no-store; success only after receiver acceptance. Distributed abuse controls are **not** implemented by a honeypot or claimed to exist; operator must configure/test them before enabling collection. |
| **F19 — misleading procedure/FAQ schema** | **Corrected.** Removed blanket NoninvasiveProcedure classification; uses appropriate WebPage/Thing descriptions. FAQ structured data appears only where its answers are present. |
| **F20 — generic/wrong sharing metadata** | **Corrected.** Per-page canonical/Open Graph/Twitter metadata. 404s are noindex. Unknown/reserved service names return proper 404s, not inherited-object-property failures. |
| **F21 — redundant hero-image downloads** | **Corrected.** One Home portrait; a single responsive picture selects a mobile or desktop source, not two CSS-hidden prioritised images. Cold 390 px contexts select one 420 px hero resource for Home, Research and Contact. Other legitimate page images can still load. |
| **F22 — lint command was broken** | **Corrected.** Working flat ESLint configuration, compatible pinned tooling, successful lint command and a CI lint step. See tooling caveat below. |

The original clinical “To confirm” notes remain visible. Credentials, research claims, clinical content, photography licensing/consent, real delivery and legal compliance were **not independently approved** during this engineering work.

## Verification actually run

| Check | Result |
| --- | --- |
| Reproducible `npm ci` | Pass; 394 installed packages. ESLint deprecation warning documented below. |
| Production `npm run build` | Pass; 19 generated pages plus dynamic Contact/API handling. |
| `npm run typecheck` | Pass. |
| `npm run lint` | Pass, zero allowed warnings. |
| `npm test` | **37 pass:** original 8 quality/bundle checks plus 29 TypeScript API/calendar/SSR tests. |
| Full `npm run test:e2e` | **100 pass**, including all existing 42 browser regressions. |
| Banner seam enhancement rerun | **8 pass**, after strengthening corresponding-text continuity assertions. Not added again to the 137 total. |
| Responsive coverage | 12 routes × 320/360/390/430/640/768/1024/1440 px = **96 layout combinations**, including full hero copy containment, not merely document width. |
| Accessibility | **24** WCAG-tagged axe scans (12 routes × 390/1440 px), zero reported violations, plus missing-label target checks. |
| Safe unconfigured preview | No form/input/select/textarea collection; direct contact present; valid synthetic POST returns 503; extra axe scan has zero violations; no page errors. |
| Production dependency audit | `npm audit --omit=dev`: **0 reported vulnerabilities** at test time. This is not a claim about every dev dependency or future advisories. |
| `git diff --check` | Pass. |

The layout tests caught an inadequate first attempt at the hero repair: setting `min-height: min-content` on a ratio-constrained wrapper still clipped copy. The final overlapping-grid spacer was then verified at the small widths and with enlarged text, followed by the full suite. The initial repair also narrowly exceeded the existing JS budget; that budget was **not raised** to make it pass.

### Regression categories

- Footer geometry, corresponding-text continuity, resizing, pause/resume and reduced motion.
- Home return through logo/menu/Back, single portrait mount, retained desktop parallax.
- Mobile form dimensions, 16 px inputs, contained date rail, portrait/landscape, validation/sending/failure/retry/receipt states.
- All-route hero containment, text enlargement/spacing, native FAQ semantics, contact draft preservation, service prefill, error focus, native POST privacy, radio focus and timezone hydration.
- Reactive reduced-motion cursor, scoped metadata/schema, one selected hero image, no-JS usability, unknown/reserved service 404s.
- API malformed payloads/types, body caps (including absent/forged length), impossible dates, contact validation, pending channel rejection, consent, configuration gate, mocked receiver success/failure, forwarding allowlist and SSR gate.

### Evidence files

- [Full browser results](evidence/browser-final.txt)
- [Node/API/calendar/budget results](evidence/all-node.txt)
- [Build output](evidence/build.txt) and [install output](evidence/install.txt)
- [Unconfigured-preview results](evidence/unconfigured-preview.json)
- [Cold-context mobile image requests](evidence/mobile-images.json)
- [Bundle table](evidence/bundle.txt) and [machine-readable metrics](evidence/bundle.json)
- [Production dependency audit](evidence/npm-audit-production.json)
- [320 px long surgical heading](evidence/laparoscopy-320.png)
- [390 px safe direct-contact fallback](evidence/contact-safe-fallback-390.png)

The ordinary preview is explicitly unconfigured. The full active-form suite used a separate Playwright-owned server with the reserved `.invalid` receiver and intercepted submissions. Unit tests mock the actual route's outbound `fetch`. **No test message was sent to the practice.**

## Performance and tooling notes

The repaired production build stays within the existing budgets:

- Home initial modern scripts: **199.8 KiB gzip** (budget 200 KiB).
- Home HTML/inline RSC: **25.7 KiB gzip** (budget 30 KiB).
- Shared CSS: **14.6 KiB gzip** (budget 16 KiB).
- Legacy-only polyfill: 38.6 KiB gzip, reported separately; modern browsers skip it.
- Optional Lenis remains a separate approximately 5.3 KiB gzip download. Cursor implementation is also deferred; desktop later downloads are not included in the initial-script figure.

These are local gzip-level-9 build estimates, not field Core Web Vitals. No repaired-build Lighthouse improvement is claimed. Image evidence records selected resources separately rather than treating a lower image element count as proof of lower total page transfer.

ESLint **9.39.5** is pinned because the installed Next 16.4.3 plugin set declares compatibility through ESLint 9. ESLint 10 was not forced through incompatible peers. ESLint 9 emits an upstream deprecation warning; track a coordinated Next/plugin/ESLint upgrade. TypeScript **~6.0.3** is inside the parser-supported range; the earlier TypeScript 7 resolution was not retained. This is a compatibility choice, not a claim to use the newest supported linter.

## Remaining release decisions

1. Publish the authorised changes from the same branch, verify the exact deployed commit and record the outcome in PR #1. Keep that pull request unmerged; authorisation is not itself proof of a successful rollout.
2. Keep online collection off until the [receiver/privacy/abuse-control checklist](../../enquiry-operations.md) and an authorised receipt check are complete. Telephone/email remain available.
3. Supply and approve real, licensed doctor/premises photography and the final clinical/credential/hours copy. Keep current illustrative/pending labels until then.
4. Perform physical iOS/Safari/Android and assistive-technology checks, especially touch pause/resume, native keyboard/viewport behaviour and text-on-image contrast. Local Chromium plus axe is not that certification.
5. After any rollout, verify the actual production pages, cache behaviour, disabled/enabled delivery state and status/metadata headers. A local pass does not prove a deployment happened or that a receiver works.
