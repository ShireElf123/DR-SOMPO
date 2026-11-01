# Three scoped visual upgrades — 1 November 2026

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

Journey, finish, final whole-site checks and final bundle comparison follow in
their respective commits.
