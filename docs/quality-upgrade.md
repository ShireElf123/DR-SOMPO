# Performance and accessibility upgrade — 1 November 2026

> Historical upgrade record. The [subsequent full-site repair report](audits/2026-11-01-repairs/README.md) records the current 137 checks, banner repair, all-audit finding dispositions, performance figures and remaining launch requirements. The measurements below belong to their stated earlier checkpoints.

## Measured result

Production build, gzip level 9. KiB means 1,024 bytes. The baseline is the
previously deployed `b7d6b61`, not a generic template benchmark.

| Home-page scripts | Before | After |
| --- | ---: | ---: |
| Initial modern-browser JavaScript | 226.7 KiB gzip | 199.1 KiB gzip |
| Legacy-only `noModule` polyfill | 38.6 KiB gzip | 38.6 KiB gzip |
| All script tags, including that polyfill | 265.3 KiB gzip | 237.7 KiB gzip |
| All script tags, uncompressed | 852.0 KiB | 747.0 KiB |
| Initial script tags | 13 | 12 (11 modern + 1 legacy) |

CSS remains approximately 14 KiB gzip. Fine-pointer desktops can additionally
load the **5.3 KiB gzip** Lenis chunk during idle; coarse-pointer and
reduced-motion sessions do not request it. This is not a claim that all desktop
JavaScript, including later downloads, is below 200 KiB.

Moving static sections to the server has a trade-off: HTML including the inline
React Server Component payload increased from **19.7 to 25.8 KiB gzip**, measured
against the saved `0747690` checkpoint before the bundle work. The combined
initial HTML + modern scripts still decreased. The analysis command reports
HTML separately and the tests budget it too, rather than hiding it in a JS-only
score.

These measurements exclude images, fonts and Next.js route prefetches. They are
local build estimates, not measured Vercel transfer sizes or Core Web Vitals.
No Lighthouse score or rendering-time improvement is claimed.

## What changed

- All full `motion` components use `m` beneath synchronous, strict
  `LazyMotion` with `domAnimation`. Page transitions, viewport reveals, parallax
  and the portalled mobile sheet remain. The nav's travelling layout highlight
  becomes a colour transition; filtered cards retain their entrance animation
  but no longer run layout-reflow springs. No async animation feature download
  can strand content or the menu.
- Static home sections, the ticker and photographic panels no longer require
  their own client-component code. Only the animated signal bars retain a
  separate client boundary inside the plate primitives.
- Pure service/condition indexes are marked as side-effect-free so importing
  the telephone number does not retain unrelated catalogue data.
- Optional scrolling has cancellation/cleanup, native-scroll fallback, live
  preference updates and scroll locking that works before its chunk arrives.
- The page curtain runs on navigation, not over the initial server-rendered
  page. The rotating hero label is also visible on its first render.
- The mobile menu traps keyboard focus, restores focus on dismissal, and closes
  when switching to desktop navigation. Full navigation now starts at 1024 px;
  the previous 768 px breakpoint overflowed a tablet viewport.

## Correcting the invisible-text diagnosis

The original 55 `opacity:0` nodes were **54 paint-only duplicates plus the hero
label**, not 55 invisible reading elements. The reading layer was already in
server HTML, and masked headings were already untransformed there. A blanket
`noscript` override would not have fixed the actual problem.

The actual defect was low contrast in resting scroll-lit text. The final light
tint is `#6a736e`: **4.89:1 on white and 4.56:1 on ivory**. The forest resting tint
is white at 96% opacity so it also clears 4.5:1 over the brightest possible wash
in the actual forest gradient, not just over the solid forest token.

Reading text stays permanently mounted. Decorative per-word MotionValues now
exist only near the viewport; they are unmounted elsewhere. Removing only the
motion element while leaving `useTransform` mounted would not release those
subscriptions. Explicit heading `will-change` hints are also visibility-gated;
this is not a measurement of actual GPU layer count. Five redundant backdrop
blur utilities were removed from hero/photographic captions in the first patch.

Browser testing also found a reduced-motion hydration mismatch (React error
418). The shared hook now uses `useSyncExternalStore` with an identical server
and hydration snapshot, then responds to the user's preference and live changes.

## Regression checks

- `npm run build` and `npm run typecheck`.
- `npm test`: 8 checks covering initial-JS and HTML/CSS budgets, contrast using
  the actual colour tokens/gradient, server-rendered copy, deferred Lenis and
  protection against accidentally importing the full motion feature set.
- `npm run test:e2e`: 22 Chromium checks, including seven routes, phone/tablet
  widths, filtering/reset, incomplete form validation, disabled/blocked JS,
  reduced-motion hydration, scroll-library failure, preference changes,
  overlay lifecycle and menu keyboard/navigation behaviour.
- The enquiry test intercepts requests and never sends data to a delivery service.
- CI runs the same build, typecheck and regression checks. Generated screenshots,
  traces, browsers and build outputs are not committed.

Real-device Safari/Firefox checks and field performance measurements are still
separate follow-up work. These changes do not verify the placeholder photography,
clinical/publication details, domain ownership or enquiry delivery configuration.

## Follow-up: mobile portrait zoom on return to Home

The settled-page checks missed a transition bug: the keyed, exit-wait page
wrapper mounted Home once inside the departing route and again about 0.7 seconds
later. The hero's 96.5%-to-100% entrance scale restarted at each mount. On a
390 px viewport this grew the full-bleed portrait from roughly 353 to 366 px.

The content wrapper now retains a stable identity, with only the decorative
curtain handling route transitions. The portrait frame itself is stationary;
desktop image parallax remains on its separate layer. The initial presence
boundary is retained so SSR/no-JavaScript readability is not lost.

Seven additional browser tests observe 2.6 seconds of actual transition frames,
covering return from all five main interior pages, browser Back, four phone
widths, menu/logo navigation and retained desktop parallax. The new regression
failed on the previous build (two mounts) and passes on the fix (one mount,
constant mobile image dimensions). Total checks: 8 quality + 29 browser tests.

## Follow-up: mobile appointment form containment

The contact form's date rail and default fieldset minimum width forced its
implicit mobile grid column to roughly 590 px. A 390 px device ended up with
610 px of document content. Hiding horizontal overflow did not fix the layout;
comparing document width against `innerWidth` also missed it because that value
expanded along with the overflow in mobile Chromium.

The contact grid now explicitly uses a shrinkable single mobile column. Its
children and fieldsets can shrink, so only the date rail scrolls sideways.
Phone/tablet inputs use 16 px text and at least 48 px height; mobile contact
choices and consent labels have at least 44 px touch areas. The existing desktop
two-column arrangement and compact control typography are retained.

Thirteen new checks cover six phone widths (320–430 px), arrival from Home,
portrait/landscape changes, focus, date scrolling/selection, validation,
sending/error/retry/success/reset states, tablet/desktop columns and no-JavaScript
rendering. The 390 px regression failed on the previous build at 610 px, then
passed with a 390 px document and a 350 px form. Existing viewport assertions
now use the document's client width, not the overflow-inflated inner width.

Total: 8 quality checks and 42 Chromium browser checks. Delivery responses in
the enquiry flow are mocked; no test sends patient information to the practice.
These are emulated-phone checks, not physical iPhone/Safari keyboard validation.
