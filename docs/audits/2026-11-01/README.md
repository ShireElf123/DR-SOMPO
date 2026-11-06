# Independent full-site audit

> Historical audit of baseline `e1d66e9`. See the [repair and verification report](../2026-11-01-repairs/README.md) for the subsequent fixes and the remaining approvals.

**Dr CM Ngwey-Sompo Inc. · 1 November 2026 · Africa/Johannesburg**

## Executive verdict

**Not ready for final patient-facing production sign-off.** The previous Home-navigation and appointment-width repairs still pass their regressions, but the broader audit found functional, privacy, accessibility and content-trust problems that those tests did not cover. These are mostly shared-component and form-contract repairs; they do not require a redesign.

There are **22 grouped findings: 4 P1, 15 P2 and 3 P3**. A finding can contain several related reproductions; this is not a count of failed test cases. Delivery configuration and publication approval are distinguished from bugs observed in the browser.

- **P1:** resolve before relying on the site for patient enquiries or presenting it as a finished practice website.
- **P2:** important correctness, usability, accessibility or content defects.
- **P3:** metadata, performance and maintenance defects.

**Audit-only changes:** application code, dependencies, environment settings and deployments were left unchanged. Only this report and selected evidence were added. No enquiry was delivered to the practice. No commit, push or merge was performed.

| Baseline | Value |
| --- | --- |
| Application revision | `e1d66e914888660fd381f07101cb16f767d97519` |
| Working branch | `arena/a5f32632-dr-sompo` |
| PR | [#1](https://github.com/ShireElf123/DR-SOMPO/pull/1), open; not merged |
| Public site | <https://dr-cm-ngwey-sompo-website.vercel.app> |
| Production deployment inspected | `dpl_4ng5NRapCohPoCgMuSHbfqmkCZPa`, READY / PROMOTED, matching the revision above |
| Browser test target | Local production build, `http://127.0.0.1:3010` |

## What was actually tested

- **12 content routes × 8 widths = 96 layout cases:** `/`, `/services`, `/about`, `/research`, `/patient-info`, `/contact`, and all six service details (`antenatal`, `delivery`, `general`, `oncology`, `fertility-assessment`, `laparoscopy`). Widths: **320, 360, 390, 430, 640, 768, 1024 and 1440 CSS pixels**.
- **15 interaction probes:** service selection, FAQ behaviour, draft preservation, validation, server-error mapping, no-JavaScript submission, an international timezone, accessibility-tree state, live reduced-motion changes, Back, anchors, landscape menu behaviour and 404 handling. Further probes checked radio focus, pending WhatsApp, the skip link and responsive image downloads.
- **24 axe-core 4.14.0 scans:** every content route at 390 and 1440 px. Automated results were reviewed rather than treating every warning as a confirmed WCAG failure.
- **9 isolated API cases:** actual route source, stubbed environment and outbound fetch, and a fixed clock. A direct local `POST` of JSON `null` separately confirmed the unhandled 500 response.
- **3 Lighthouse 13.6.0 mobile performance runs:** Home, Contact and Laparoscopy, one run each.
- Local HTTP/metadata checks for the main routes, a nonexistent route, robots, sitemap, icon, Open Graph image and the API. Read-only production deployment and project-level environment inspection.
- **Fresh checks:** TypeScript passed; **8/8 Node tests and 42/42 existing browser tests passed**. `npm run lint` failed. `npm audit --omit=dev` reported zero production dependency vulnerabilities.

The existing production build was used; it was not rebuilt during this audit. Its build and CI had passed before the preceding deployment. Browser automation used Chromium, including phone emulation—not physical iPhones or Safari. No real delivery, medical credential verification, legal compliance certification, full penetration test or field Core Web Vitals measurement is claimed.

## Priority index

| ID | Priority | Finding | Evidence type |
| --- | --- | --- | --- |
| F01 | P1 | Online enquiry delivery has no verified configured destination | Project configuration + isolated API |
| F02 | P1 | Native form submission puts personal details in the URL | Browser, JavaScript disabled |
| F03 | P1 | Mobile sticky Book reloads Contact and destroys an unfinished draft | Browser + network |
| F04 | P1 | Documented AI placeholders are described as the real doctor/practice | Source/content inspection |
| F05 | P2 | Hero headings are clipped on eight routes at small-phone widths | Geometry + screenshots |
| F06 | P2 | Home FAQ plus signs suggest expansion but do nothing | Browser + source |
| F07 | P2 | Services overview preselection disagrees with what is submitted | Browser + intercepted payload |
| F08 | P2 | Calendar uses inconsistent timezones; Sundays appear and hydration fails | Browser timezone emulation |
| F09 | P2 | Validation errors can be offscreen; server date/slot errors are not mapped | Browser + mocked server error |
| F10 | P2 | WhatsApp is selectable despite being pending | Browser + configuration |
| F11 | P2 | Unconfirmed hours and a response-time promise are stated as facts | Source/content inspection |
| F12 | P2 | “Nothing stored, nothing shared” is an unsupported privacy promise | Content + data-flow inspection |
| F13 | P2 | Collapsed FAQ answers remain in the accessibility tree | Browser accessibility snapshot |
| F14 | P2 | Meaningful footer/date text fails AA contrast | axe + computed colours |
| F15 | P2 | Contact-method radios have no visible keyboard focus indicator | Keyboard + computed styles + screenshot |
| F16 | P2 | Invalid lists and missing heading-label targets damage semantics | axe + DOM inspection |
| F17 | P2 | Cursor animation ignores reduced motion enabled after page load | Live preference-change probe |
| F18 | P2 | API accepts impossible dates/digitless phones and throws on JSON null | Isolated API + local HTTP |
| F19 | P2 | Medical/FAQ structured data does not match page content | Source + rendered metadata |
| F20 | P3 | Five interior pages inherit Home social metadata | Rendered metadata |
| F21 | P3 | Hidden responsive hero images are also preloaded/downloaded | Browser resource timing |
| F22 | P3 | Lint command is broken and not exercised by CI | Executed command + workflow |

## P1 — enquiry safety and publication blockers

### F01 — Delivery is not ready to be treated as operational

**Observed:** the Vercel project-level environment listing returned only `NEXT_PUBLIC_SITE_URL`, with no project-level `ENQUIRY_WEBHOOK_URL`. The route requires that setting. The isolated missing-setting case returned **503**, with the explicit message that online enquiries are not connected yet. The form still invites a patient to complete the full request before discovering this condition.

**Scope:** this is a configuration finding, not a claim that a real production submission was attempted. The project listing was inspected; no inbox receipt, external webhook call or separate shared-environment review was performed. Do not equate the mocked success test with working delivery.

**Reproduce safely:** run the actual route with no webhook setting and a valid synthetic payload, stubbing outbound fetch. See `api.json`, case `unconfigured-delivery`.

**Source:** `app/api/enquiry/route.ts:147–161`; `components/enquiry-form.tsx:249–264`; `README.md:183`.

**Fix / acceptance:** configure an approved receiver and verify delivery through an explicitly authorised controlled test, or visibly gate the form before data entry and offer telephone/email. Preserve the existing fail-closed behaviour: never show success when delivery is unavailable.

Evidence: [configuration observation](evidence/deployment-observation.json), [API cases](evidence/api.json).

### F02 — No-JavaScript submission leaks entered details into the address

**Reproduce:** disable JavaScript, open `/contact`, enter a synthetic name, telephone and message, check consent, and submit.

**Actual:** the browser makes a **GET** request to `/contact?name=…&contact=…&message=…&consent=on`. The form has no `method` or `action`; its safety depends entirely on the JavaScript `preventDefault()` handler. It also specifies `noValidate`.

**Impact:** personal details enter the URL and can consequently enter browser history, copied links and request logs. The observed test used only synthetic non-clinical text. It did not demonstrate transmission of real patient data to a third party.

**Source:** `components/enquiry-form.tsx:108–109,249–253`.

**Fix / acceptance:** implement a safe native POST/server-action fallback, or prevent native data submission and provide a clear no-JavaScript contact alternative. Adding `method="post"` alone is insufficient if the destination still only accepts JSON. A regression must assert that names, contact details and messages never become query parameters when scripts are absent or fail.

Evidence: [interaction `no-js-native-submit-uses-get`](evidence/interactions.json).

### F03 — Mobile Book erases a form in progress

**Reproduce:** at 390 px, open `/contact`, enter a name and message, then tap the floating bottom **Book** control.

**Actual:** a new document request is made to `/contact`; scroll changes from **1283 to 0**, and both entered fields become empty. This is not the earlier horizontal-overflow bug.

**Cause:** the sticky action is a plain `<a href="/contact">` even when already on Contact.

**Source:** `components/sticky-actions.tsx:46`; form draft state in `components/enquiry-form.tsx:86–102`.

**Fix / acceptance:** on Contact, scroll/focus the existing form instead of navigating, or suppress the redundant action. Preserve all entered values and prevent a document reload. Persisting sensitive drafts in browser storage is not necessary to solve this and should not be added casually.

Evidence: [interaction `sticky-book-reloads-and-clears-form`](evidence/interactions.json).

### F04 — Placeholder imagery is presented as verified identity/location

**Observed:** `README.md:176–178` explicitly identifies the photography in `public/images/` as **AI-generated placeholders to replace before launch**. Yet the rendered content describes those assets as “Portrait of Dr CM Ngwey-Sompo”, “Dr Sompo in consultation with a patient”, and the actual hospital/practice waiting area. No verified replacement or patient consent was established by this audit.

**Impact:** a visitor can mistake illustrative imagery for the doctor’s likeness or the real premises. The problem is the representation and provenance mismatch—not an assessment of the attractiveness of the photographs.

**Source examples:** `app/about/page.tsx:59–60,145–147,196–197,264–266`; `components/sections/teasers.tsx:19–20,162–164`; `components/sections/hero.tsx`; `README.md:176–178`.

**Fix / acceptance:** replace identity/location photographs with authorised, verified assets. Until then, label illustrative imagery visibly and truthfully, and correct alternative text. An internal README disclaimer or an alt-text-only disclaimer is not sufficient for sighted visitors. Do not describe a generated person as the real doctor.

## P2 — layout and patient journeys

### F05 — Fixed hero frames clip page titles

**Reproduce:** open `/services/laparoscopy` at 320 px, or `/research` and `/services/general` at 360 px, without scrolling.

**Actual:** headline text extends above its overflow-hidden hero frame. **11 route/width cases across eight routes** contain clipped H1 text. The page itself has no horizontal overflow, so a width-only regression passes while the title is missing.

| Route | Clipped from H1 at 320 px | At 360 px |
| --- | ---: | ---: |
| `/services` | 5.8 px | — |
| `/patient-info` | 5.8 px | — |
| `/research` | 38.4 px | 13.4 px |
| `/services/delivery` | 28.5 px | — |
| `/services/general` | 61.1 px | 33.6 px |
| `/services/oncology` | 61.1 px | — |
| `/services/fertility-assessment` | 61.1 px | — |
| `/services/laparoscopy` | **93.8 px** | 13.3 px |

“—” means no H1 clipping detected at that tested width, not an untested case.

**Cause / source:** `components/page-hero.tsx:23,47–48,94–96`: fixed aspect ratio, `overflow-hidden`, and bottom-positioned absolute copy. Service details supply another fixed aspect ratio.

**Fix / acceptance:** allow the small-screen copy to determine the required height, or provide enough content-aware minimum height. Keep image clipping separate from text containment. Test the full heading, introduction and breadcrumb—not just `scrollWidth`—at all eight widths and with enlarged text.

Evidence: [layout matrix](evidence/layout-matrix.json); [Laparoscopy 320](evidence/screens/services-laparoscopy-320.png), [General 360](evidence/screens/services-general-360.png), [Research 360](evidence/screens/research-360.png).

### F06 — Home FAQ “+” is a false interaction affordance

**Reproduce:** on Home, scroll to “Before you visit” and click a plus sign or its question.

**Actual:** nothing expands, the URL and text do not change, and answers remain truncated at 150 characters. These plus signs are decorative spans, not working accordion controls. The separate **All questions** link does work.

**Source:** `components/sections/teasers.tsx:187–204`.

**Fix / acceptance:** implement an accessible accordion with real buttons and complete answers, or remove the expansion affordance and use explicit links to the answers. Test mouse, touch and keyboard activation.

Evidence: [interaction `home-faq-plus-is-inert`](evidence/interactions.json), [screenshot](evidence/screens/home-faq-inert.png).

### F07 — Service preselection displays one choice and sends another

**Reproduce:** use the Obstetrics enquiry link from `/services`, arriving at `/contact?service=antenatal`; inspect the service selection and submit through an intercepted request.

**Actual:** the select shows **“General consultation — not sure yet”**, while React state submits **`"antenatal"`**. The Services overview supplies IDs; the select options use service titles. The equivalent link from the Antenatal detail page correctly selects “Antenatal care”.

**Source:** `app/services/page.tsx:212`; `app/services/[slug]/page.tsx:158`; `components/enquiry-form.tsx:86,96` and its service select.

**Fix / acceptance:** use one canonical service identifier and resolve it consistently for URL, displayed choice and API payload. Cover every overview/detail enquiry link plus invalid query values. The visible choice and submitted service must agree.

Evidence: [interactions `services-overview-prefill` and `detail-page-prefill`](evidence/interactions.json).

### F08 — Timezone conversion creates Sunday “weekdays” and hydration errors

**Reproduce:** load Contact with the browser timezone set to `Pacific/Auckland`. During the audit, the browser date was Monday 2 November 2026, while the server/date source differed.

**Actual:** the ten-weekday rail included **SUN 1** and **SUN 8**, omitted the corresponding Fridays, and produced **React hydration error #418**. The helper filters weekdays using local dates, then converts local noon to UTC with `toISOString()`. In UTC+13, that is the preceding calendar date. Server/client clocks and timezones also differ during rendering.

**Source:** `components/enquiry-form.tsx:35–43,106` and date-button formatting.

**Fix / acceptance:** define date-only calculations in the practice timezone, use a consistent server/client reference date, and avoid converting local calendar dates through an unintended UTC day. Test Johannesburg, UTC, Auckland and an American timezone at date boundaries with a fixed clock.

Evidence: [interaction `international-timezone-calendar`](evidence/interactions.json).

### F09 — Validation feedback is incomplete and easy to miss

**Reproduction A:** on a 390 px Contact page, leave the required fields invalid and press the submit control near the bottom. The first error was at **y = −355.8 px**, offscreen; focus stayed on Submit and no error alert/summary was exposed. Field-level text exists, but users are not brought to it.

**Reproduction B:** intercept a server response containing `errors.preferredDate`. The form displays a generic failure message but **no date-specific error**. The API uses `preferredDate` / `preferredSlot`, whereas the UI reads `date` / `slot`.

**Source:** `components/enquiry-form.tsx:121–123,159–160,363,405`; `app/api/enquiry/route.ts:122–135`.

**Fix / acceptance:** agree on the error contract, associate date/slot messages with their controls, and provide a focused error summary or focus the first invalid field with an appropriate announcement. Verify both client validation and server rejection on a small viewport. Do not rely on colour alone.

Evidence: [interactions `validation-error-offscreen` and `server-date-error-not-rendered`](evidence/interactions.json).

### F10 — A pending contact channel can still be selected

**Reproduce:** on Contact, select **WhatsApp — pending** under “How should we confirm?”.

**Actual:** it becomes checked and is not disabled. The API also accepts WhatsApp, although `practice.whatsappNumber` is `null` and the contact panel says the channel awaits confirmation. This radio requests a callback preference; it does not launch a WhatsApp conversation.

**Source:** `components/enquiry-form.tsx:430–455`; `lib/practice.ts:45–54`; `app/api/enquiry/route.ts:38`.

**Fix / acceptance:** derive available methods from the verified configuration on both client and server. Until confirmed, show WhatsApp as unavailable rather than accepting it as a usable response channel.

Evidence: keyboard screenshot also shows the option; the supplementary probe recorded `checked: true`, `disabled: false` (see [additional checks](evidence/additional-checks.json)).

### F11 — Unverified hours and response deadlines are asserted as facts

**Observed:** the form computes “The practice is open now” using hardcoded **Monday–Friday, 08:00–17:00 SAST**, and promises a request “will be answered the next working morning”. Meanwhile Contact says consulting hours are confirmed directly by the practice; the launch checklist still requires confirmation. The status calculation also has no holiday/closure schedule.

**Source:** `components/enquiry-form.tsx:49–78,292–300`; `app/contact/page.tsx:140–141`; `README.md:179–180`.

**Fix / acceptance:** obtain approved hours and response wording, put them in one content/configuration source, and avoid an unconditional live-open or response-time claim until verified. A clock comparison is not evidence that staff are available.

### F12 — The privacy badge makes a claim the implementation cannot support

**Observed:** Home says **“Nothing stored, nothing shared”**. The intended API sends the supplied contact information/message to a configured receiver, and the privacy journey requires the practice to use those details. The no-JavaScript path additionally places them in a URL. The audit did not establish hosting-log or downstream retention settings.

**Source:** `components/sections/bento.tsx:204–207`; `app/api/enquiry/route.ts:164–185`; see F02.

**Fix / acceptance:** replace absolute marketing promises with an accurate, practice-approved explanation of collection, recipients, use and retention. Review the actual provider data flow before claiming POPIA compliance. This is a content/data-flow contradiction, not a legal finding that the practice has breached POPIA.

## P2 — accessibility

### F13 — Visually collapsed FAQ panels are still announced

**Reproduce:** load `/patient-info` with the first FAQ collapsed and inspect the browser accessibility tree.

**Actual:** the button has `aria-expanded="false"`; its panel has height **0** and opacity **0**, but the complete answer remains in the accessibility snapshot. Expanding the accordion visually works. Visual state and assistive-technology state disagree.

**Source:** `components/sections/faqs.tsx:76–89` uses a zero-row grid and opacity without semantically hiding the closed answer.

**Fix / acceptance:** remove closed content from the accessibility tree using an appropriate hidden/unmounted state while preserving a predictable animation/focus lifecycle. Test a closed panel, an opened panel and repeated keyboard toggles.

Evidence: [interaction](evidence/interactions.json), [accessibility-tree snapshot](evidence/faq-accessibility.txt).

### F14 — Footer and calendar labels have insufficient contrast

**Observed across all 24 axe checks:** footer “Pages” and “Contact” labels are **3.71:1**, at **11 px**, below the normal-text AA requirement of 4.5:1. On Contact, date day/month labels are **3.37:1**, at **8.5–9 px**. There were 15 contrast nodes in the phone Contact scan and 23 in the desktop scan, including footer text.

**Source:** `components/footer.tsx:39,70` (`opacity-50`); `components/enquiry-form.tsx:350,356` (`opacity-70`). Existing palette-token tests do not cover these effective opacity/background combinations.

**Fix / acceptance:** correct the rendered foreground/background combinations, not merely the base palette. Keep normal text at least 4.5:1 in default and interactive states, and rerun route-level contrast checks.

**Manual-review distinction:** axe also flags About’s decorative ordinal numbers at 1.53:1. Decide whether those numbers convey information before classifying them as a conformance failure. Pure decoration and meaningful labels are not equivalent.

Evidence: [axe results, including selectors and computed colours](evidence/accessibility.json).

### F15 — Keyboard focus disappears on contact-method radios

**Reproduce:** focus the service select on Contact, then press Tab into the contact-method radio group.

**Actual:** the Telephone radio matches `:focus-visible`, but it is a **1 × 1 px** `sr-only` input with **`clip-path: inset(50%)`** and hidden overflow. Its outline is clipped. The visible label has no outline or box-shadow. The selected green pill is unchanged and does not indicate where keyboard focus is.

**Source:** `components/enquiry-form.tsx:430–451`; `app/globals.css:86–89`.

**Fix / acceptance:** style the visible radio label/container from the input’s keyboard focus state, while keeping selected and focused states distinguishable. Verify Tab, arrow-key selection and Shift+Tab.

Evidence: [final computed-style verification](evidence/verification.json), [focused screenshot](evidence/screens/contact-radio-keyboard-focus-390.png).

### F16 — Animation wrappers break lists; section labels reference absent IDs

**Confirmed structure problems:**

- Home FAQ teaser: `<ul>` contains `Reveal` divs containing `<li>` elements. Axe reports one invalid list and four list items per scan.
- All six service-detail FAQ lists: `<dl><div><div><dt>…` nesting breaks valid term/definition grouping. Axe reports one definition-list and six `dlitem` nodes per page.
- Home references missing `services-heading` and `about-teaser-heading`; Services references missing `conditions-heading`. These are `aria-labelledby` targets, not duplicate-ID problems.

**Source:** `components/sections/teasers.tsx:12,187–204`; `components/sections/services.tsx:109`; `components/sections/conditions.tsx:76`; `components/page-hero.tsx` (`SectionHead`); `app/services/[slug]/page.tsx:249–260`.

**Fix / acceptance:** preserve native list parent/child relationships when adding animation wrappers, and give rendered headings the IDs referenced by their sections. Add DOM/axe assertions for these specific rules.

**Not conflated with this finding:** axe’s separate `region` observations are landmark best-practice warnings. A closed, unmounted mobile menu’s `aria-controls` target is not being reported as a confirmed failure solely because the dialog is absent while closed.

Evidence: [axe](evidence/accessibility.json), [layout/ARIA matrix](evidence/layout-matrix.json).

### F17 — Live reduced-motion changes leave the cursor follower running

**Reproduce:** on desktop, load with normal motion, move the pointer, enable `prefers-reduced-motion: reduce` without reloading, and move again.

**Actual:** the decorative cursor remains visible and follows the pointer; its transform changes to the new pointer position. Other motion handling does respond, so this is a specific remaining cursor issue, not a claim that all reduced-motion support is broken.

**Source:** `components/ui/cursor.tsx:28–30,82–91` reads media preferences only when the effect mounts.

**Fix / acceptance:** subscribe to media-query changes or the existing reactive preference hook and tear down the animation/listeners immediately when reduction is requested. Test both initial and live preference states.

Evidence: [interaction `live-reduced-motion-cursor`](evidence/interactions.json).

## P2 — API and structured content

### F18 — API validation accepts unusable inputs and crashes on null

The isolated harness executed the actual route with no external deliveries:

| Input | Observed result | Expected behaviour |
| --- | --- | --- |
| JSON `null` | Uncaught `body.company` access; direct local request returns **500** | Controlled 400/422 response |
| `preferredDate: "2026-11-31"` | Accepted and forwarded to the stub receiver with **200** | Reject a nonexistent calendar date |
| Telephone `"---------"` | Accepted and forwarded with **200** | Reject a telephone value with no digits |
| Consent false | **422**, no forwarding | Correct; preserve this behaviour |

The date tests used **2026-11-01T12:00:00Z** as a fixed clock. JavaScript normalises 31 November into December; the code checks range but not an exact date round-trip. The phone regex counts permitted punctuation toward its minimum length.

**Source:** `app/api/enquiry/route.ts:50–64,66–85,114–123`.

**Fix / acceptance:** validate a non-null plain-object body, validate actual calendar dates, count/validate meaningful telephone digits and keep client/server constraints consistent. Cover these cases with route tests that stub delivery.

Evidence: [isolated cases](evidence/api.json), [direct local null request](evidence/local-null-request.json).

### F19 — Structured data contains inaccurate classifications and unrelated FAQs

**Observed:** every service detail is assigned `procedureType: "https://schema.org/NoninvasiveProcedure"`, including **laparoscopic/open surgery and caesarean delivery**. `bodyLocation` is populated from an editorial eyebrow rather than a body location. Separately, the root layout emits the same complete `FAQPage` data on every page, including pages without those visible questions and answers.

**Source:** `app/services/[slug]/page.tsx:62–70`; `app/layout.tsx:82–85`; `lib/structured-data.ts:121–132`.

**Fix / acceptance:** choose accurate, clinician-approved types/properties per service, or omit unsupported classifications. Scope FAQ markup to visible matching content. Validate rendered structured data after changes; no search-engine rich-result eligibility is promised by this audit.

Evidence: [rendered SEO/structured-content sample](evidence/content-observations.json).

## P3 — metadata, performance and maintenance

### F20 — Main interior pages inherit Home sharing metadata

**Observed:** `/services`, `/about`, `/research`, `/patient-info` and `/contact` have correct page-specific canonicals, but their Open Graph URL and title still identify Home. The six detail pages set their own Open Graph metadata correctly. Root Twitter copy is also generic.

**Source:** `app/layout.tsx:39–52` and the five pages’ metadata exports.

**Fix / acceptance:** set page-specific Open Graph/Twitter title, description and URL consistently, preferably through a shared metadata helper. Assert rendered values for every route. This finding does not mean the canonical URLs are wrong.

Evidence: [layout metadata matrix](evidence/layout-matrix.json).

### F21 — Hidden responsive heroes consume initial image bandwidth

**Observed at 390 px:** mobile and desktop hero variants are both preloaded without media restrictions. Resource timing and final DOM geometry show that images with **0 × 0 rendered dimensions** are nevertheless fully downloaded.

| Page | Visible mobile hero encoded bytes | Hidden desktop hero encoded bytes |
| --- | ---: | ---: |
| Home | 47,233 | 18,486 |
| Research | 52,908 | 23,253 |
| Contact | 22,869 | 65,744 |

Some source images are used again elsewhere on a page, so these figures are **not** a claim that every hidden-hero byte is wasted across the entire visit. The confirmed defect is unconditional competing initial requests/priority for alternate hero presentations. Home downloads two resolutions of the same hero source.

**Source:** priority images in `components/sections/hero.tsx`; `components/page-hero.tsx:60–75`.

**Fix / acceptance:** use a responsive picture/source strategy or media-qualified preloads so only the appropriate hero receives initial priority. Check both DOM rendering and network requests at phone/desktop widths; CSS hiding alone does not prevent download.

Evidence: [final image/resource verification](evidence/verification.json).

**Local Lighthouse results — single simulated-mobile runs:**

| Route | Performance | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 90 | 1.1 s | 3.4 s | 140 ms | 0.006 |
| Contact | 95 | 0.9 s | 3.0 s | 60 ms | 0.005 |
| Laparoscopy | 95 | 0.9 s | 2.9 s | 80 ms | 0.006 |

These scores are local lab observations, not averages, real mobile-network measurements, Vercel edge performance or a field Core Web Vitals pass. LCP remains worth improving despite the favourable aggregate scores. See [performance settings and metrics](evidence/performance.json).

### F22 — The lint command does not run a linter

**Reproduce:** `npm run lint`.

**Actual:** the package script invokes `next lint`, which is unsupported by the installed Next 16 CLI. It exits with `Invalid project directory provided, no such directory: /home/user/DR-SOMPO/lint`. CI currently builds, typechecks and tests but never invokes this command, so its green result does not detect the broken lint step.

**Source:** `package.json:10`; `.github/workflows/quality.yml`.

**Fix / acceptance:** configure a supported ESLint command/configuration, make the script succeed, and add it to CI. Keep this separate from the already passing TypeScript and regression checks.

Evidence: [lint output](evidence/lint.txt).

## Verified positives and rejected hypotheses

- **All 96 content-route loads returned 200**, with no recorded runtime page errors in the default-timezone layout sweep and no root horizontal overflow. The separate Auckland probe is the documented runtime-error exception.
- No failed local asset responses, broken loaded images or duplicate IDs were recorded in the layout sweep. The prior appointment-width and Home-navigation regressions passed again.
- Back did **not** reset pages to the top in the tested journey: desktop restored **4412 → 4412**; phone returned to the same Services region (**7369 → 7297**, a 72 px difference). This is not reported as a confirmed broken-Back bug.
- Anchor targets were below the header in the tested journeys. Landscape menu navigation closed the dialog and restored vertical scrolling. The skip link worked. Existing menu/focus regressions passed.
- The detail-page service prefill works; the mismatch is the overview path. The Patient Info accordion expands visually; its closed accessibility state is the problem.
- The 404 returned **404**, had a suitable title/H1 and included **`noindex`**. It also inherited `index, follow`, which should be cleaned up, but this is **not evidence that the 404 is indexable**.
- Robots, sitemap, icon and the Open Graph image responded. Page canonicals point to the configured live origin, rather than the old placeholder domain.
- The API rejects missing consent and fails honestly when no receiver is configured. Those protections should be preserved.
- Pending service-specific notes are rendered visibly under **“To confirm”**. They were checked and are not being incorrectly reported as hidden. Clinical approval of those pending arrangements remains outstanding.

## Hardening recommendations and unverified launch gates

These are deliberately separate from the confirmed bug list:

1. **Anti-abuse:** omitting the client-supplied `startedAt` allows repeated immediate requests; the isolated harness accepted three. The honeypot/time check is not a real server-enforced rate limit. Add appropriate server-side limits, request-size controls and privacy-conscious monitoring before enabling a receiver. This was not a load test and does not prove an exploitable production outage.
2. **Privacy operations:** approve the actual destination, access controls, logging, retention, deletion/contact process and privacy notice. The current consent/badge does not establish legal compliance. No patient records were inspected.
3. **Clinical/editorial sign-off:** confirm hours, response commitments, contact channels, theatre/delivery/on-call arrangements and scope of oncology services; substantiate published credentials and research references through the practice. Source labels marked “verified” were not independently checked against professional registers or publication records in this audit.
4. **Device/assistive-technology checks:** physical iOS Safari and Android keyboard/viewport behaviour, VoiceOver/NVDA, genuine browser/text zoom and representative slower devices remain unverified. Width emulation is not a substitute for them.
5. **Deployment/receiver acceptance:** conduct an authorised end-to-end receipt/failure/retry test only after the practice agrees on a safe synthetic submission. No external telephone/email/WhatsApp delivery was attempted here. External receiver availability and search/social indexing were not verified.
6. **Minor semantics/metadata:** review axe landmark best-practice warnings and remove contradictory inherited 404 robots metadata. Inspect actual production response/security headers rather than inferring them from local HTTP, where hosting-level headers may differ.

## Recommended repair order

1. **Protect patient data and trust:** F02/F03; delivery gating or approved connection (F01); truthful photography/privacy/hours (F04/F11/F12); API robustness (F18).
2. **Repair the journeys:** content-aware hero sizing (F05); functional Home FAQs (F06); service/date/error contracts and channel availability (F07–F10).
3. **Close accessibility gaps:** FAQ hiding, computed contrast, visible focus, list/heading semantics and live motion preferences (F13–F17).
4. **Complete quality work:** accurate structured data and sharing metadata, responsive image loading and functioning lint/CI (F19–F22).
5. Add targeted regression tests for each reproduction, repeat the complete matrix, then perform the separately authorised delivery and real-device checks. **Do not infer production readiness from the existing 50 checks alone.**

Application fixes and another deployment were not authorised as part of this audit and have not been performed. PR #1 remains unmerged.

## Evidence and reproduction notes

The retained evidence is approximately 3 MB, rather than the entire temporary browser/output directory. It contains synthetic test data and public site content, not real enquiries or secret environment values.

- [Scope and revision](evidence/scope.json)
- [96-case compact layout/metadata matrix](evidence/layout-matrix.json)
- [15 interaction results](evidence/interactions.json)
- [Supplementary checks](evidence/additional-checks.json)
- [24 axe scans: violations and manual-review items](evidence/accessibility.json)
- [API cases](evidence/api.json) and [direct local null response](evidence/local-null-request.json)
- [Final radio-focus and responsive-image verification](evidence/verification.json)
- [Content/schema observations](evidence/content-observations.json)
- [Local endpoint/header observations](evidence/headers.json)
- [Production configuration observation](evidence/deployment-observation.json)
- [Lighthouse metrics/settings](evidence/performance.json)
- [TypeScript](evidence/typecheck.txt), [8 Node tests](evidence/quality.txt), [42 browser tests](evidence/regression.txt), [lint failure](evidence/lint.txt), [production dependency audit](evidence/dependencies.txt)
- [Probe source snapshots and environment notes](evidence/probes/README.md)
- Selected screenshots are in `evidence/screens/` and linked from the relevant findings.

Existing browser regressions were rerun with:

```sh
LD_LIBRARY_PATH=/tmp/al2023/lib \
CHROMIUM_EXECUTABLE_PATH=/tmp/chromium \
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3010 \
npm run test:e2e
```

Those runtime paths are specific to the audit sandbox. These regressions passing does not imply the newly documented behaviours were already covered. Their absence from the earlier checks is precisely the coverage gap this independent audit exposed.
