# Three scoped visual upgrades — 1 November 2026

**Complete:** three upgrades, no new dependencies; 39 Node and 131 browser tests pass.

Baseline: `f78774bc6493c581854e2e9311f5d519039445cd`, on
`arena/a5f32632-dr-sompo`. No deployment, push or PR merge is part of this task.

## Before editing

Read the README, project quality/repair/enquiry documentation, `lib/practice.ts`,
photography rules, motion infrastructure and existing regression tests. Checked
that the local site was running. Ran `npm run analyze` **before implementation**.
Exact measurements are in `evidence/bundle-before.json`.

| Home, gzip level 9 | Before |
| --- | ---: |
| Initial modern JavaScript | 204,642 B (199.8 KiB) |
| CSS | 14,920 B (14.6 KiB) |
| HTML / inline RSC | 26,308 B (25.7 KiB) |
| Optional desktop Lenis (not initial) | 5,432 B |

The requested growth ceiling is <4 KiB gzipped JavaScript. Existing 200 KiB
JavaScript / 16 KiB CSS / 30 KiB HTML guards have not been loosened.

A cold browser mobile baseline (390×844, DPR 2, touch, CPU 4× slowdown,
1.6 Mbps down / 750 Kbps up, 150 ms latency) recorded **CLS 0.1349645535**.
The late font swap moved the supporting text, actions and subsequent sections;
see `evidence/mobile-before.json`. These are Chromium lab observations, not
field Core Web Vitals or physical-device certification.

## 1. Hero opening

- CSS arrival: photo 0–350 ms; label/headline 350–900 ms; supporting copy
  650–1,200 ms; credentials 800–1,350 ms; subtle action finish 1,000–1,400 ms.
- Call is fully painted from the start. Booking/secondary actions never fall
  below 0.96 opacity, never translate, and never become inert, disabled or
  pointer-blocked. Focus immediately cancels their cosmetic fade.
- The photo settles with opacity/filter **inside** the stationary frame, not
  frame scale. Desktop scroll parallax retains its existing travel values;
  phones retain the fixed crop and no zoom on re-entry.
- Reduced motion receives final CSS immediately, including without hydration.
- Visibility-gated desktop parallax subscriptions, pill interval and paused
  decorative CSS prevent background hero motion while reading farther down.
- Home owns its opening instead of being obscured by the full-screen route
  curtain. The stable `AnimatePresence initial={false}` content boundary and
  transitions on other routes are preserved.
- `next/font/local` preloads the **existing** Figtree variable font. Optional
  display prevents a late, layout-shifting swap on a slow first visit. No font
  dependency, copy, image source or photo disclosure was added or changed.

### Hero checkpoint

Passed lint, typecheck, production build, all **37 Node checks**, and all
**15 hero browser checks** (8 new + 7 existing re-entry/parallax regressions).
The cold mobile test measured **CLS 0**, a stationary portrait and hit-testable
call/enquiry controls throughout the opening. Both reduced and normal motion
reach the final state; normal arrival ends by 1.5 s of its CSS paint timeline.
A pre-paint rAF can precede the actual CSS start while first paint is blocked,
so the timing probe aligns to the browser's animation start time rather than
misreporting a pre-paint scheduling gap as motion duration.

Real trusted clicks are tested at controlled 0 / 250 / 600 / 1,000 / 1,400 ms
CSS playheads, plus unmodified booking navigation. Full-height desktop tests
fit the **existing** hero layout; a separate cold 390×844 touch test exercises
the phone viewport. Offscreen tests assert no running hero animations and no
continuing parallax updates. `evidence/bundle-hero.json` records this checkpoint.

## 2. Patient journey

- A real ordered list with connected, numbered markers. The desktop line spans
  the three steps; a static vertical line follows the phone layout's gutter.
- Native CSS entry timelines draw the two line segments and stagger the three
  cards, using only transform/opacity. All copy is fully revealed before it
  needs to be read. Completed effects stay finished below the section.
- **No additional client JavaScript, observers, scroll handlers or frame loop.**
  Touch (including wide touch devices), reduced motion and unsupported browsers
  get the finished state. The intro is plain readable copy, not a scroll-lit
  paragraph that would keep working on touch or offscreen.
- Hover lift/photo treatment is limited to a fine-pointer, non-touch desktop.
  Keyboard focus immediately exposes the complete journey and provides a
  high-contrast outline. The requested focusable steps are named, described
  **articles**, not fake buttons; no new destinations/actions were invented.
- The supplied three titles/bodies/meta strings and all image descriptions
  remain unchanged. Existing fill/object-cover slots accept either very tall
  or very wide replacement images without moving the cards.

### Journey checkpoint

Passed lint, typecheck, production build, **37 Node checks**, **10 new journey
browser checks**, and both Home axe scans (390 / 1440 px, no violations).
Desktop/phone screenshots were also inspected. Browser tests cover progression,
keyboard Tab order, hover, four static device/preference profiles, a live
reduced-motion switch, fallback CSS and arbitrary image ratios.

The fallback test removes only the `@supports` enhancement. It checks the
static fallback stylesheet; it is **not** represented as testing an actual
older browser. A JS timeline polyfill was deliberately not added: it would
cost payload/runtime work to animate a decorative, already-complete fallback.

Home JavaScript remains **204,767 B gzip**, exactly the hero checkpoint;
CSS is **15,585 B** and HTML/RSC **26,685 B**. Existing budgets still pass.
See `evidence/bundle-journey.json`.

## 3. Visual finish

- Hero, forest panels and the announcement wash use `in oklab` inside
  `@supports`, with the existing sRGB wash recipes retained as fallbacks.
- One inline SVG `feTurbulence` grain layer at **0.045 opacity**. It cannot
  intercept input and is not painted under reduced motion. The stronger,
  duplicate hero grain was removed.
- Cards, FAQs, timeline edges and structural dividers get **0.5 CSS-pixel
  strokes at ≥2dppx**, with 1px edges at 1×. Chromium rounds native fractional
  borders up, so inset paint is used for the retina stroke. A screenshot-pixel
  test verifies one physical black pixel followed by white at both densities.
  Control borders and 2px keyboard outlines are not thinned. The custom widths
  are registered with the existing class merger, so border colours cannot
  silently discard them. Unit checks cover native-width overrides; browser
  checks retain the filtered-result colours at both 1× and 2×.
- Four shared depth tokens: `soft`, `lift`, `float`, `layer`. No per-component
  arbitrary shadow recipes or shadow transitions remain. Existing intentional
  `shadow-none` variants remain. New motion uses only transform/opacity/filter.
- Visual contrast checks found white hero copy over the lighter wash/photo
  needed stronger legibility overlays. These were calibrated without changing
  the palette, text or images. Paired rendered-pixel checks at **320, 390, 640,
  1024 and 1440 px** pass the 3:1 large-text and 4.5:1 normal-text thresholds.
  The lowest sampled ratios are **3.93:1 large / 4.71:1 normal** across those
  widths; this supplements, rather than replaces, axe.
- A little extra phone bottom clearance prevents the existing floating call
  chip overlapping the Meet action's arrow. Every opening-frame probe now
  checks all three actions at their centres and four inset corners.
- The existing cursor's media guard excludes touch/hybrid devices and widths
  where its presentation is hidden. No new cursor effect was introduced.

## Final verification

All required commands passed on the production build:

| Check | Result |
| --- | --- |
| `npm run lint` | Pass, zero warnings |
| `npm run typecheck` | Pass |
| `npm test` | **39 passed** |
| `npm run build` | Pass |
| `npm run test:e2e` | **131 passed**, zero failures, retries or skips |
| `npm run analyze` | Existing budgets pass, unchanged |

The browser suite includes **26 axe scans**: all 12 content routes plus the
404, at 390 and 1440 px. No violations were reported. The existing mobile,
banner, enquiry, date/timezone, menu, no-JS, schema and re-entry checks remain;
the layout regressions cover **96 route/width combinations**.

An isolated cold mobile run used 390×844, DPR 2, touch, CPU 4× slowdown,
1.6 Mbps download / 750 Kbps upload, 150 ms configured latency and no browser
cache. Across **45 sampled frames**:

- **CLS 0**, versus **0.13496** in the before run.
- First sampled final state **1,433 ms**; desktop **1,417 ms**; reduced motion
  final from the first sample (**0 ms**).
- Call/booking/Meet hit tests passed throughout; action and image geometry
  stayed stationary. No page errors.

The isolated run is the timing reference. The parallel suite's throttled
probe sampled only **12 frames** under shared-worker load, with the first
observed final sample at **1,550 ms**. Both runs and the distinction are
recorded: sparse concurrent sampling is not presented as a precise paint-time
benchmark. These are CSS paint-timeline observations, not field LCP results.

### Measured bundle comparison

Same analyzer, gzip level 9, and the same `NEXT_PUBLIC_SITE_URL` as the baseline.
Early per-upgrade HTML checkpoints used the local fallback origin; the final
build and exact JSON-LD comparison use the original canonical origin.

| Initial modern JS | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Home | 204,642 B | **204,734 B** | **+92 B** |
| Services | 204,336 B | 204,248 B | −88 B |
| About | 202,324 B | 202,237 B | −87 B |
| Research | 202,324 B | 202,237 B | −87 B |
| Patient info | 202,324 B | 202,237 B | −87 B |

Home: **199.85 → 199.94 KiB JS**, **14.57 → 15.52 KiB CSS**
(14,920 → 15,891 B), and **25.69 → 25.88 KiB HTML/RSC**
(26,308 → 26,498 B). Optional Lenis is unchanged at 5,432 B and remains deferred.
The JS increase is far below the requested 4 KiB limit. Existing tighter
200 KiB JS / 16 KiB CSS / 30 KiB HTML guards were **not relaxed**.
These transfer estimates exclude images, fonts and route prefetches. HTML/RSC
includes a build identifier, so repeated builds can differ by a few bytes.

### Content, safety and preview

- All **12 routes** retain identical whitespace-normalized main copy, headings
  and JSON-LD, with one h1 each: `evidence/content-comparison.json`.
- `lib/practice.ts`, photography data/labels, structured-data source, enquiry
  form/API/validation, package manifest and lockfile are unchanged.
- Enquiry collection remains **off** in the preview. Two additional axe scans
  of the inactive Contact state pass; it has zero personal-information fields,
  no page errors, and a valid synthetic submission returns **503**, not a
  receipt. No real enquiry was sent and no delivery was enabled.
- The preview on port 3011 uses the existing **local-only** `ARENA_PREVIEW=true`
  flag at build time so it can be embedded. Embedding was verified in an
  iframe. The standard production verification retained its frame protection;
  preview JS/CSS sizes are identical. The pre-existing dev server was preserved.
- **No push, deployment or PR merge.** These changes are three local commits.

### Deliberate limits

No redesign, extra effects/features, dependencies, invented claims or copy
changes. No JS polyfill for decorative scroll timelines: unsupported browsers
show the finished journey. No image-download gate that could hold up controls.
No activation of unapproved booking delivery or changes to verification markers.

Chromium automation and an emulated phone are not physical-device Safari,
Android or screen-reader certification. Axe and the targeted paint checks are
not a blanket claim of WCAG conformance. Those real-device checks remain an
appropriate pre-release review.

### Evidence and reproducibility

- `evidence/browser-tests.txt`, `browser-summary.json`, `node-tests.txt`,
  `lint.txt`, `typecheck.txt`, `build.txt`.
- `evidence/bundle-{before,after,comparison}.json` and `bundle-after.txt`.
- `evidence/hero-opening.json`, `mobile-before.json`, `mobile-isolated.json`,
  `mobile-isolated-frames.json`, `hero-contrast-after.json`, `journey-entry.json`.
- `evidence/content-comparison.json`, `preview-safety.json`.
- Visual checks: `hero-390.png`, `hero-1440.png`, `journey-390.png`,
  `journey-1440.png`. These show the **existing illustrative imagery**, not
  verified photographs of Dr Sompo or the practice.
- `hero-contrast-before-calibration.json` records the first finish candidate,
  **not** the released baseline.

Run `npm run build` before `npm test` / `npm run test:e2e`. Use the same public
site URL for like-for-like metadata/bundle comparisons. Playwright owns a
separate synthetic `.invalid` delivery configuration; do not point the full
form suite at a real receiver or the collection-disabled preview. The isolated
phone check can be repeated with:

```sh
npm run test:e2e -- --workers=1 --grep 'cold mid-range mobile'
```
