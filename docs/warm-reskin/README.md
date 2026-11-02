# Warm colour experiment — peach, apricot and one orange stop

**Preview only.** This branch is a colour and depth study of the live release
`e5b28e8cdf8a2a1acefdce93ba7270b5709bfb8e`. It does not merge PR #1, does not
deploy, and does not change the appointment planner, the booking links, the
verified practice copy or the enquiry-delivery switch (still off).

Branch: `arena/d874d7cc-dr-sompo`.

The release it starts from is the current production build, not the stub
`d7617cf` on `main`; the whole experiment is rebased onto the green release and
never onto `main`.

## The colour system

`app/globals.css` is the single source of truth. The old forest/sage greens are
gone rather than layered over, so nothing can fall back to a cold surface or a
near-black panel.

| Token | Value | Role | Charcoal `#26221F` contrast |
| --- | --- | --- | ---: |
| `--color-cream` | `#FDF8F2` | page, cards | 14.94:1 |
| `--color-blush` | `#FDEADE` | callouts, FAQ band | 13.52:1 |
| `--color-peach` | `#FBD5B8` | image beds, chips | 11.50:1 |
| `--color-apricot` | `#F6B184` | feature surfaces | 8.67:1 |
| `--color-tangerine` | `#F3812B` | hover + mid gradient stop | 6.00:1 |
| `--color-ember` | `#EB6300` | **deepest step** | 4.75:1 |

The ramp stops at `#EB6300`. Nothing in the theme is darker or more saturated
than that orange, and no surface is brown or near-black: the footer, the
privacy panel, the final call-to-action and the ticker are all warm gradients
carrying charcoal type.

Type is charcoal at three audited weights — `ink` (15.8:1 on white),
`ink-soft` (`#5B5049`, allowed on white/cream/blush/peach) and `ink-muted`
(`#655A52`, retuned from `#6B6058` so it clears AA on peach). White text is
never placed on a warm surface, and `#EB6300` is never used for small text —
it is a surface and accent only.

## Depth, glass, grain and motion

- **Shadows** are four warm stacks (`soft`, `layer`, `lift`, `float`), each
  built from a tight contact layer plus wider ember-tinted ambient layers.
  There is no `rgba(0,0,0,…)` in the depth system, so shadows read as late
  afternoon light instead of soot. Primary actions add the single `--glow-warm`.
- **Glass is an accent with a budget of two.** Only the hero copy plate (phone)
  and the sticky bar frost. Every other pane — photo captions, chips, the
  credential note — is an opaque 87% cream surface with a white hairline and an
  inner highlight, so charcoal type over photography never depends on a blur to
  stay legible. Tailwind's utilities layer resets `backdrop-filter` on every
  element, so the two surviving frosts are restated outside the cascade layers
  and stripped again under `forced-colors`.
- **Photography** gets a warm grade (`saturate(.95) sepia(.045)`), an inner
  hairline, a soft-light wash and a light floor shadow inside `.photo-depth`,
  so the mixed green-and-cool source imagery sits inside the peach field
  without being repainted into sepia. No photo labels were added. Measured in
  OKLab: the grade rotates the images' colour mass 5–18° warmer while skin
  chroma moves by ≤0.004 (a just-noticeable difference is ≈0.02), and the
  floor shadow no longer drags the bottom eighth more than 12–22° off the
  photograph's own hue. The earlier `sepia(.08)` + 40%-ember floor wash was
  pushed to −49°, which read as an orange filter over the garments.
- **Motion** is the existing vocabulary, kept and extended rather than stripped:
  the same springs on `Reveal`/`RevealItem`/`WordsIn` and the same CSS
  transitions on buttons, journey cards and glass lifts. Reduced motion removes
  the springs instead of slowing them.
- **Grain** remains one inline, non-interactive layer that disappears under
  reduced motion.

## Accessibility work (the reference's dark-mode failures, fixed)

- `color-scheme: only light` plus a `<meta name="color-scheme">`-equivalent
  viewport declaration: a user in dark mode gets the audited warm scheme
  instead of a half-inverted one. Both `themeColor` entries are `#FDF8F2`.
- Autofill is painted back to cream, so Chrome's blue autofill cannot punch a
  cold hole in the form.
- Every coloured surface is audited at AA with charcoal, and the deepest
  gradient stop still clears 4.5:1 for 10.5 px footer copy.
- The mobile hero copy sits on `.hero-copy-plate` (84% cream + 16 px frost)
  with a soft edge, so the portrait can stay full-frame without text falling
  onto the photograph.
- Focus stays a 2 px charcoal outline with 3 px offset, visible on cream,
  blush, peach and orange.
- `forced-colors` strips glass, grain, photo depth and the glow.

## Bugs found and fixed on the way

| Symptom | Cause | Fix |
| --- | --- | --- |
| Glass panes had no blur at all | Tailwind's utilities layer resets `backdrop-filter` on `*`; the component-layer declaration loses the cascade | `--glass-blur` per pane, restated outside the layers |
| Footer wordmark never wiped in | A self-clipped `whileInView` target intersects 0 %, so the observer never fires and the clip stays at `inset(0 100% 0 0)` | Observe the wrapper (`m.div`), animate the child through variants; regression test added |
| Split-hero tag stretched into a full-width bar | `span.tag` was a flex child of a column | `self-start` |
| `ink-muted` failed AA on peach (4.45:1) | token too light | `#655A52` (4.88:1) |
| Retina stroke colours lost their alpha formatting | `color-mix()` values were replaced with hex + alpha | Test updated to the computed `rgba(38, 34, 31, 0.08)`/`0.2` |

## Budgets — untouched ceilings, no new dependencies

| Home, gzip level 9 | Baseline `e5b28e8` | This branch | Ceiling |
| --- | ---: | ---: | ---: |
| Initial modern JavaScript | 204,789 B | **204,773 B** | 204,800 B |
| CSS | 15,982 B | **16,304 B** | 16,384 B |
| HTML / inline RSC | 26,249 B | **26,171 B** | 30,720 B |

Third-party JavaScript is byte-identical to the release; the warm system costs
no client weight. `package.json` gains nothing. The room was found by trimming
duplicated gradient stops, the sampled spring, dead selectors and the mobile
duplicate wash — not by relaxing a limit. Raw numbers live in
`evidence/bundle-before.json` and `evidence/bundle-after.json`.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`, `npm run analyze`: clean.
- `npm test`: 45 Node checks pass (13 quality + 32 unit), including the new
  palette/ramp, dark-mode opt-out, glass contrast and warm-shadow assertions.
- Playwright: 160 of 161 browser checks pass. The single failure is the
  pre-existing timing-sensitive `hero-opening` stability probe under parallel
  CPU contention; it passes standalone twice in a row and is unrelated to
  colour. Axe: 26 route × width scans clean, including a dedicated dark-scheme
  scan of `/`.
- New `tests/e2e/warm-theme.spec.ts` covers: old tokens gone, ramp floor,
  no dark panels, painted charcoal contrast on footer/ticker bands, dark
  preference, glass fill, keyboard focus, reduced motion, 320/390 hero
  legibility, and the footer wordmark reveal.

## Look at it

```bash
npm run build && npx next start -H 0.0.0.0 -p 3001
```

Screenshots (Chromium 1440 / 390 / 320) are in `evidence/`: home hero, about,
services, research, contact, patient info, footer, reduced motion and the
dark-preference pass.

## Second pass — closing the craft gap

The first pass scored 7.0/10 against a good Framer site. This pass closes the
five gaps that scorecard named, without adding a runtime dependency and without
moving any budget ceiling.

1. **A second type voice.** Instrument Serif 400 + 400 italic (SIL OFL) is
   vendored as woff2 in `app/fonts/` and wired through `next/font/local` as
   `--font-display`. The rule is structural, not decorative: measured, factual
   clauses stay in Figtree; the *human* clause — the emotional half of a
   headline, a pull-quote, a numeral — takes the serif. It appears in the hero
   headline's second line, `SectionHead`'s muted phrase, the About pull-quote,
   the stage heading, stage numerals (`01/02/03`), the journey intro and step
   numbers, and the footer tagline.
2. **Layout rhythm broken.** The home page no longer reads as rounded panels
   stacked on cream. Two full-bleed `.ember-gradient` bands (the research
   teaser and the patient-info privacy note) run edge to edge, and one new
   quiet section — `.stages-band`, *Care across a lifetime* — sits between the
   journey and the About teaser: a sticky editorial statement on the left, an
   indexed list on the right, no card in sight.
3. **One signature scroll moment.** `.stages-list` draws its ember rail with a
   pure-CSS `animation-timeline: view()` range and a `@keyframes rail-draw`
   fallback-free enhancement — scroll position drives the line, the numerals
   light in sequence, and reduced motion gets the finished rail immediately.
   No JavaScript was added for it.
4. **Pill-free hierarchy.** Every section eyebrow is now a 1px rule plus
   11px/0.17em micro-caps (`.tag`), so all sections open with the same
   typographic gesture instead of a peach lozenge.
5. **Photography carries itself.** The About portrait lost three glass
   credential chips and a floating "consulting" card; the credentials and the
   hospital now read as a single micro-caps caption under the frame. The image
   is uncropped by UI, and the glass count drops by four on that section alone.

### Gates after this pass

- Budgets (gzip 9): JS 204,426 / CSS 15,809 / HTML 27,235 of 204,800 / 16,384 /
  30,720.
- `npm test`: 45/45 (13 quality + 32 visual-finish unit assertions).
- Playwright: 161/161, including the 26 axe route × width scans and the painted
  contrast probes at 320 / 390 / 768 / 1024 / 1440.
- The glass contract changed on purpose, so its test changed with it:
  `warm-theme.spec.ts` now asserts the caption pane is ≥ 85% opaque *with no
  blur*, and that no more than two elements on the page carry any
  `backdrop-filter` at 390px and 1440px. That is stricter than the old
  "expect blur(14px)" assertion, not looser.
