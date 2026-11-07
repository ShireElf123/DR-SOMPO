# Information accuracy: the warm release against the green release

The question was whether the reskin changed any fact. It did not, with one
exception that this pass fixed. Below is how that was measured, everything that
differs, and — separately — how the published facts compare with the practice's
own public listings.

## Method

The green release is commit `e5b28e8` (the production build the warm branch was
rebased onto). It was checked out into a worktree, installed, built, and served
next to the current build. Every route was fetched from both servers, stripped of
markup, split into lines, and diffed line for line:

`/`, `/services`, `/services/{antenatal,delivery,general,fertility,surgery,cervical}`,
`/about`, `/research`, `/patient-info`, `/contact`.

This compares what a patient actually reads, not the source, so it catches copy
that moved between a data file and a component as well as copy that changed.

## What the diff says

**`lib/practice.ts` is byte-identical between the two releases.** Every published
fact — name, entity, hospital, address, phone, email, languages, booking states,
verified/pending markers — is unchanged. `lib/structured-data.ts` gained two
lines (`logo`, `image`) and nothing else. JSON-LD still carries no `openingHours`
and no `priceRange`, because neither has been confirmed.

Across the twelve routes, every page matched line for line except the home page
and one addition in the header lockup:

| route | difference | verdict |
| --- | --- | --- |
| all twelve | warm adds the lockup line *Obstetrician & Gynaecologist* under the wordmark | correct, and it states the specialty on every page |
| `/` | green hero *"An first, then a specialist."* → warm *"Women's Health. Every Stage. Every Journey."* | editorial, client-directed |
| `/` | green *"Operates at Dr Phakisa Mokhesi Hospital, Sebokeng"* → warm *"Theatre lists at Dr Phakisa Mokhesi, Sebokeng"* | **regression — "Hospital" was dropped. Fixed in this pass.** |
| `/` | green carried the research paragraph (*"That work was presented at SASOG 2025 … published as an abstract in the International Journal of Gynecology & Obstetrics."*) and the abstract caveat | **not a correction but a thinning:** both still appear verbatim on `/research`; the home page no longer states the venues at all |
| `/` | warm adds the *Care across a lifetime* stage section, the pull-quote about her own pregnancies, and the credential line *FCOG (SA) · MMed (O&G) · Wits* | additions, all traceable to `lib/practice.ts` |

No fact was invented, softened into vagueness, or moved into a footnote. One word
was lost in the move, and it was the hospital's name.

### The one fix

`components/sections/bento.tsx` said *"Theatre lists at Dr Phakisa Mokhesi,
Sebokeng"* — contradicting `practice.ts`, which names *Dr Phakisa Mokhesi
Hospital, Sebokeng* in two places. The full name is restored, and measured at
1440, 768 and 640 it still sets on one line with no clipping.

## Against the practice's own public listings

Two independent listings exist and disagree with each other in one place, which
is worth knowing before anyone "corrects" the site:

- **Life Healthcare** (her hospital's own doctor directory): tel +27 11 842 7651;
  *"Life Roseacres Hospital, Sessional rooms, Ground floor, East wing, cnr Caster
  and St Joseph Street, Primrose"*; practising hospital: Life Roseacres.
- **MedPages** (two listings, `1980739` and `1972280`): tel +27 11 842 7651;
  *"Sessional Room 5 Ground Floor Life Roseacres Hospital, Cnr Saint Josephs
  Street & Castor Rd, Primrose, 1401"*; interests incl. urogynaecology; a
  separate Sebokeng listing for the second hospital.

| fact | site says | listing says | status |
| --- | --- | --- | --- |
| Telephone | 011 842 7651 | +27 11 842 7651 (both) | **matches** |
| Hospital one | Life Roseacres Hospital, Primrose | same (both) | **matches** |
| Hospital two | Dr Phakisa Mokhesi Hospital, Sebokeng | Sebokeng listing (MedPages) | **matches** |
| Street | Corner of St Joseph and Castor Road | "Caster and St Joseph" (Life) / "Castor Rd" (MedPages) | **matches MedPages**; Life Healthcare's "Caster" is a typo |
| Postal code | 1401 (JSON-LD only) | 1401 | **matches** |
| Qualifications | MBChB · FCOG (SA) · MMed (O&G) Wits | same, plus BBiomedSci | **matches**; we omit the Bachelor of Biomedical Sciences |
| Interests | adolescence, cervical screening and HPV, contraception, general gynae, menopause, minimally invasive surgery, obstetrics, fertility | same, plus **urogynaecology (diagnosis and referral)** | **gap** — one listed interest is missing |
| Consulting room | "consulting rooms", hospital name only | **Sessional Room 5, Ground Floor, East Wing** | **gap** — the part a patient needs on arrival |
| Email | chrisscrcross2013@gmail.com | not published anywhere | **unconfirmed**; do not treat as verified |
| WhatsApp | dormant, marked pending | nothing published | **correctly withheld** |
| Hours | not published; omitted from JSON-LD | nothing published | **correctly withheld** |

## What still needs the practice

Three things, in order of what a patient would notice:

1. **The room number.** "Sessional Room 5, Ground Floor, East Wing" is published
   by both listings in slightly different wording. Confirming the exact phrasing
   would let the contact page and the JSON-LD carry it.
2. **Urogynaecology.** Her own listing includes diagnosis and referral; the site
   does not mention it. Adding it means adding it to the conditions index and the
   service mapping, so it is a content decision, not a string edit.
3. **The email address**, which is live on the site and appears in no public
   listing. It is the one item here that should not be touched without her word.

The green release carried the same "Presented at" label over the journal entry —
a journal publication listed among presentations — so that defect is inherited,
not introduced, and it is already on the copy-audit list.
