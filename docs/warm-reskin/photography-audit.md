# The photographs, audited against the palette

The reskin moved every surface to cream, blush, peach and ember. The photographs
were generated before that decision and were never re-graded, so a set of cool-green
rooms sat inside a warm page — including the two frames a visitor sees first.

This is the measurement, the decisions it forced, and the guard that keeps it true.

## How it was measured

Every `/images` frame sampled at 240 px wide, in sRGB, pixel by pixel:

- **green** — hue 65–170°, saturation > 0.14, value > 0.12
- **olive** — hue 45–65°, saturation > 0.20 (sunlit yellow-green)
- **warm** — hue 330–45°, saturation > 0.14, value > 0.25

Saturation and value floors matter: without them an off-white wall reads as "green"
because its hue noise wanders past 90°. What the numbers actually catch is a *mass* of
coloured pixels — a painted wall, a theatre drape, a wall of planting — which is exactly
what fights the palette.

## Before

| frame | green | olive | warm | used |
|---|---|---|---|---|
| portrait-somp-card | **45.7 %** | 0.4 % | 5.9 % | bento, teasers, journey |
| surgery | **34.5 %** | 2.1 % | 15.9 % | services, conditions, practice |
| patient-quiet | **17.1 %** | 6.2 % | 47.2 % | journey |
| waiting-room | **15.0 %** | 12.6 % | 21.8 % | FAQs, services, teasers |
| hospital-exterior | **13.9 %** | 23.6 % | 31.6 % | bento, services, teasers |
| antenatal | **12.4 %** | 10.8 % | 34.5 % | conditions, services, practice |
| hero-doctor | **10.9 %** | 1.1 % | 21.5 % | the hero |
| screening-room | 10.1 % | 9.3 % | 33.0 % | services |
| cervical-research | 8.1 % | 11.2 % | 24.6 % | conditions, research |
| consultation | 6.1 % | 3.6 % | 40.0 % | hero, journey, about |
| fertility | 2.9 % | 1.5 % | 40.6 % | conditions, services |
| corridor | 2.7 % | 14.4 % | 42.2 % | final CTA |
| research-desk | 1.6 % | 1.0 % | 61.7 % | research |
| gynae | 1.4 % | 5.1 % | 39.5 % | conditions, services |

**Set mean: 12.9 % green.** Three of the top five are the largest plates on the page.

## The verdict

**Re-graded (9).** Each was edited from its own frame — same room, same people, same
pose, same light, same crop — changing only the colour of the painted surfaces and
the soft goods:

| frame | what changed | green after |
|---|---|---|
| portrait-somp-card | bottle-green plaster wall → warm clay putty; teal knit → oatmeal; the stranger's name badge blanked | 45.7 → **1.4 %** |
| surgery | emerald drapes → oatmeal and clay linen; dark green feature wall → putty with a clay panel; green monitor image → neutral | 34.5 → **1.2 %** |
| patient-quiet | sage shirt → clay linen; olive tree → bronze; the garden → golden late afternoon | 17.1 → **0.0 %** |
| waiting-room | pale sage wall → blush putty | 15.0 → **0.4 %** |
| hospital-exterior | saturated agave → copper and bronze succulents in gravel; background trees pushed to sunlit gold | 13.9 → **0.1 %** |
| antenatal | sage wall → warm terracotta putty | 12.4 → **1.6 %** |
| hero-doctor | sage scrub top → clay sienna; monstera → bronze-olive | 10.9 → **0.5 %** |
| screening-room | olive walls → warm putty | 10.1 → **2.5 %** |
| corridor | institutional mint dado → terracotta and putty | 2.7 → **0.7 %** |

**Kept as they are (5).** These carry green, but not as a field: a green mug and a sage
notebook on a warm desk (cervical-research), sage upholstery in a cream consulting room
(consultation), leaves on cream linen (fertility), a green soap dish (gynae), highlighter
and mug on oak (research-desk). A green object in a warm room is not a clash — it is a
complement, and cloning these would cost their best qualities for nothing measurable.
`cervical-research` at 8.1 % is the honest ceiling of "acceptable".

Two of the frames also carried a fix worth having on its own: the portrait's name badge
read **"Dr Kaledi Mngadi"** — a stranger's name on a card about this practice — and the
hero's greens were the only cool pixels in the first screenful.

## After

**Set mean: 2.1 % green.** Worst frame 8.1 %. Every re-graded frame is now 2.5 % or less,
and the warm share rose everywhere (patient-quiet 47 → 86 %, hero-doctor 22 → 71 %,
hospital-exterior 32 → 80 %).

File weights are unchanged to within a few kilobytes per frame, and the aspect ratios and
pixel dimensions are the originals, so no layout or `next/image` geometry moved.

## The guard

`tests/e2e/photography-palette.spec.ts` decodes all fourteen frames in the browser,
samples them on a canvas and fails, naming the file and the number, when:

- any single frame is more than **12 %** cool green (headroom over the worst keeper, 8.1 %),
- any single frame is less than **20 %** warm,
- the whole set averages more than **4 %** green.

Run against the previous images it fails on `antenatal.jpg green 12.6 %`. That is the
point: when the practice supplies real, licensed photography, the test says which frames
clash instead of leaving it to the eye.
