# Brand — the mark and the lockups

The practice had a WhatsApp card, not a logo: five type styles, two outline
passes, a drop shadow, a pregnant silhouette, a uterus-in-a-heart and a protea
bouquet, all inside a 719 px JPEG. Printed small it smudges; as a browser tab
icon it does not exist. The brief was to upgrade it, keep her, and put it on the
site where it belongs.

First pass replaced the illustration with an `NS` monogram. That was rejected —
the picture is the practice, not decoration — so the artwork stayed and only the
setting was rebuilt around it.

## What the mark is

A single figure: mother in profile, one king-protea bloom at her base, a heart on
the belly. Two colours — ember `#EB6300` line work, peach `#F6B184` body — on
cream `#FDF8F2`. No gradient, no outline, no shadow, no third colour, no text.

The uterus glyph is gone (it read clinical at any size and is the first thing to
disappear in print), the roses are gone (the protea carries South Africa on its
own), and the credentials moved out of the logo and onto a letterhead line.

### Files

| File | px | Use |
| --- | --- | --- |
| `public/brand/mark-1024.png` | 583 × 1024 | master, transparent — the source for everything else |
| `public/brand/mark-512.png`, `mark-256.png` | 292/146 × 512/256 | mid-size use, embedded artwork |
| `public/brand/mark-132.webp` | 132 × 273 | the header, 3× for a 38 px display |
| `public/brand/logo-stacked.png` | 1947 × 1203 | letterhead, invoices, sign-in sheets (cream ground) |
| `public/brand/logo-stacked-inverse.png` | 1947 × 1203 | signage, stickers, doors (ember ground) |
| `public/brand/logo-horizontal.png` | 1071 × 192 | e-mail signature, header at print size |
| `public/brand/logo-horizontal-short.png` | 597 × 192 | phones, app bars |
| `public/brand/avatar-1024.png` | 1024² | WhatsApp Business, Instagram, LinkedIn |
| `public/brand/app-icon-512.png`, `-192.png` | square | stores, directories, schema.org `logo` |
| `app/icon.png`, `app/apple-icon.png` | 512, 180 | browser tab, iOS home screen |

The lockups are exported at 3× from the site's own two typefaces — Instrument
Serif 400 for the name, Figtree 500/400 for the descriptor and credentials — so
the lettering is genuine type, not a drawn approximation. The mark is raster
because the artwork is; for large-format signage (a 2 m board, a vehicle) the
artwork should be redrawn as vector paths by a sign-writer, which is a job for a
tracer, not a filter.

### Rules

- Clear space: the cap height of the `D` on all four sides.
- Minimum width: stacked 96 px, horizontal 120 px, mark alone 32 px tall.
- Two colourways only, plus a single-ink version if a fax or a stamp needs one.
- Never outline, shadow, gradient or stretch the wordmark — that is exactly what
  the old card did.
- The bloom is part of the mark; don't crop it out except in the square icon,
  where the bust carries better at 32 px.

## Where it lives on the site

1. **Header, every page** — mark, name, descriptor; shortens to `DR SOMPO` under
   `sm`. The descriptor is `aria-hidden`, so the link's accessible name stays the
   doctor's name.
2. **Browser tab** — `app/icon.png`. It was still the **forest-green square** from
   the old theme until this pass.
3. **iOS/Android home screen** — `app/apple-icon.png`, full bleed, cream ground.
4. **Link previews** — `app/opengraph-image.tsx` opens with the horizontal lockup;
   this is the card WhatsApp shows when the site is shared.
5. **Search results** — `logo` in the `Physician` JSON-LD points at the 512 px tile.
6. **Footer** — deliberately not repeated: the footer closes with the oversized
   `DR SOMPO OBGYN` wordmark, which is the site's sign-off.

## Bundles and tests

The header mark is a 10 KB WebP at 3×, so the client bundle did not move: JS
204,593 B gzip, CSS 15,776, HTML 27,464 — all inside their ceilings. `brand.spec.ts`
pins the mark in the header, the accessible name at both widths, the descriptor
contrast (axe caught 7.5 px at 55 % opacity = 3.59:1 in the previous pass), every
exported file, and the fact that `/icon.svg` and `/brand/monogram.svg` are gone.

## Regenerating

The mark was cropped and keyed out of the generated artwork (edge flood-fill on
the cream ground, so enclosed cream — her face — stays opaque), then exported at
each size with a browser canvas. The lockups are HTML using the repo's two
webfonts, screenshotted at 3×. Both passes are one-off, batched scripts rather
than a build step, because the artwork changes only when she commissions new art.

The unmodified artwork is kept at `assets/brand/mark-candidate.png` (1440 × 2912,
cream ground) — it is the provenance for every file above, so crop or re-export
from it rather than from a derived size.
