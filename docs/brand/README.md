# Brand — the monogram and the lockups

The practice had a WhatsApp business card, not a logo: five type styles, two
outline passes, a drop shadow, a pregnant silhouette, a uterus-in-a-heart and a
protea bouquet, all inside a raster image about 700 px wide. Printed small it
turns into a smudge, and as a browser tab icon it does not exist at all. The
brief was to upgrade it and to put it on the site where it belongs.

## What changed

| | Before (the card) | Now |
| --- | --- | --- |
| Mark | pregnant silhouette + heart + uterus + protea bouquet + roses | `NS` monogram in Instrument Serif |
| Wordmark | serif with orange fill, dark outline, drop shadow | same serif, one colour, one weight |
| Descriptor | `OBSTETRICIAN-GYNAECOLOGIST` in a third font | Figtree, letter-spaced caps, one line |
| Colour | pink figure, salmon bouquet, gold type, maroon caps | ember `#EB6300` + ink `#26221F` on cream |
| Formats | 719 × 1568 JPEG | SVG outlines, PNG at 512 / 192 / 180 |
| Smallest legible size | ~120 px wide | 16 px (the app icon) |

Her equity is kept where it is legible and dropped where it is not: the initials
`NS`, the Instrument Serif she already had, and the peach/ember warmth. The
illustration is not gone from the practice — it stays usable on a letterhead or a
wall — but it no longer has to carry the identity, because at 16 px it cannot.

## The system

- **Monogram** — `NS`, Instrument Serif 400, tracking −0.03 em, ember. Used in the
  header, the app icons and the share card.
- **Wordmark** — `DR CM NGWEY-SOMPO`, Instrument Serif 400, all caps, +0.005 em.
- **Descriptor** — `OBSTETRICIAN & GYNAECOLOGIST`, Figtree 500, caps, letter-spaced
  until it optically spans the wordmark (never condensed below its own tracking).
- **Credentials** — Figtree 400: `MBCHB · FCOG (SA) · MMED (O&G) WITS · PR 1261290`.
  Kept out of the header; it belongs on letterhead, not on a nav bar.

Both typefaces are the ones the site already ships, so the logo needs no new
font licence and no new dependency.

## Files

| File | Use |
| --- | --- |
| `public/brand/logo-stacked.svg` | primary, ink + ember, transparent — letterhead, invoices |
| `public/brand/logo-stacked-inverse.svg` | cream + peach on full-bleed ember — signage, stickers, social avatar |
| `public/brand/logo-horizontal.svg` | header / e-mail signature, name + descriptor |
| `public/brand/logo-horizontal-short.svg` | short lockup: `DR SOMPO`, phones and app bars |
| `public/brand/monogram.svg` | the mark alone, ember |
| `public/brand/app-icon.svg` | 512 px ember tile with the cream monogram |
| `public/brand/app-icon-bleed.svg` | square, no radius — iOS/Android mask it themselves |
| `public/brand/app-icon-512.png`, `app-icon-192.png` | stores, directories, schema.org `logo` |
| `public/brand/logo-stacked-1200.png` | cream card, for WhatsApp/social or a quick print |
| `app/icon.svg` | browser tab (Next.js route `/icon.svg`) |
| `app/apple-icon.png` | iOS home screen, 180 px, full bleed |
| `docs/brand/brand-sheet.jpg` | the one-page presentation |

Every string is converted to outlines, so the SVGs open correctly on a machine
that has neither font installed — which is what a printer or a sign-writer will
have.

### Rules

- Clear space: the cap height of the `N` on all four sides.
- Minimum width: stacked 96 px, horizontal 120 px, mark alone 16 px.
- Two colourways only (ember on cream, cream on ember) plus single-ink for faxes.
- Never outline, shadow, gradient or stretch the wordmark — that is what the old
  card did.

## Where it lives on the site

1. **Header, every page** — monogram + name + descriptor. On phones the lockup
   shortens to `DR SOMPO`; the descriptor is hidden below `sm`.
2. **Browser tab** — `app/icon.svg`, the ember tile.
3. **iOS/Android home screen** — `app/apple-icon.png`.
4. **Link previews** — `app/opengraph-image.tsx` now starts with the real
   horizontal lockup instead of the abstract ring placeholder. This is the card
   WhatsApp shows when the site is shared, so it is the highest-reach surface of
   the three.
5. **Search results** — `logo` in the `Physician` JSON-LD points at the 512 px
   tile.
6. **Footer** — deliberately *not* repeated. The footer already closes with the
   oversized `DR SOMPO OBGYN` wordmark, which is the site's sign-off; a second
   logo there would compete with it.

## Bundles

The header is a client component, so inlining the monogram outline pushed the
client bundle to 205,375 B — over the 204,800 B ceiling. The outline now lives in
a sprite rendered once by the root layout (`components/brand-monogram-sprite.tsx`)
and the header references it with `<use href="#brand-monogram">`. That keeps the
one request, the instant paint and `currentColor`, and returns the bundle to
204,595 B. HTML grows by ~840 B gzip (28,999 / 30,720).

## Regenerating

`scripts/brand/glyphs.json` holds per-glyph outlines and advances in font units.
It is produced with fontTools from the two webfonts in the repo (dev-only tool,
not a runtime dependency):

```sh
python3 -m venv /tmp/ftenv && /tmp/ftenv/bin/pip install fonttools brotli
/tmp/ftenv/bin/python /tmp/ftenv/glyphs2.py /tmp/ftenv/spec3.json > scripts/brand/glyphs.json
node scripts/brand/build.mjs          # SVG lockups, app icons, sprite, OG data URI
```

`spec3.json` is the string list (`name`, `nameShort`, `descriptor`, `creds`,
`monogram`); change a string there and in `scripts/brand/build.mjs` together. The
PNG exports are rasterised from `app-icon-bleed.svg` and `app-icon.svg` (any
browser at the target size, 1× is enough).
