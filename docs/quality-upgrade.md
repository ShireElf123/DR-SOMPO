# Performance and accessibility upgrade — 1 November 2026

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
