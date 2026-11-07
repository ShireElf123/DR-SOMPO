# Reference comparison — the Framer "doctor template" class

Prompt: *"Look at these Framer doctor sites and compare."*

Sources reviewed: the Dribbble `DOCTOR` / medical-hero search feeds, live previews
of Medicard and Doctr X (BRIX, $129, 27 pages — the most-copied premium medical
template), plus the marketplace copy for MediPro, Healcure and Curely. The point
of the comparison was not to decide which looks nicest — it was to find what this
class of site does that we don't, then separate the transferable craft from the
parts that would make the practice worse.

## Verdict

We are already past this reference class on the things that are hard to buy:
art direction, typography, real content, and a page that answers "who is she,
where does she work, what does she treat, how do I reach her" without a stock
photo of a masked surgeon. The comparison did not show a new design direction;
it exposed four defects of our own that a template's polish makes obvious,
because templates never ship an unfinished grid.

## What the reference class does well

| Pattern | Do the premium templates actually earn it? |
| --- | --- |
| Section rhythm: photographic band → statement → card grid → numbers → form | **Yes.** This is the transferable idea, and the home page already follows it. |
| Large, single-purpose bento of mixed tile weights instead of a uniform column | **Yes.** Same idea our `BentoBand` is built on. |
| One persistent appointment action in the header at every width | **Yes.** We have it (`Book an appointment`), plus the phone-first mobile bar. |
| Photography at the top with a rounded/arched mask, never a square stock card | **Yes.** Done in the hero. |
| Scroll-linked reveals, slow image zooms, hover arrows that rotate | **Yes.** Done, and gated off under reduced motion. |
| Counters: "10K happy clients", "98%+ positive recovery" | **No.** Invented numbers on a medical site are a credibility and advertising-rules problem. We use credentials, affiliations and languages instead. |
| Testimonial walls with patient faces and star ratings | **No.** HPCSA advertising rules restrict testimonials for doctors. Copying this would be the single most damaging thing we could take from the reference. |
| Doctor avatar chips inside body copy ("24 people booked this week") | **No.** Borrowed social-proof chrome with no claim behind it, and at 1.05 em the chips read as a typographic bug. |
| Lorem ipsum, "Founder & CEO", "legal solutions" in a clinic's team grid | **No.** Medicard ships exactly this. Surface polish, content hollow. |
| 27 pages / 4 home variants | **No.** A solo practice needs depth in six pages, not breadth in twenty-seven. |

## Defects the comparison exposed (fixed)

1. **The hero headline lost its lockup at 1280 px.** `Women's Health.` broke into
   two lines, so the three-line statement became a four-line block with a ragged
   break. Cap lowered from `5.6rem` to `4.9rem` and `7vw` to `6.4vw`; the three
   phrases now hold as three lines from 320 px to 1536 px, and the hero still
   fills its panel.
2. **A hole in the service grid.** Seven tiles into a four-column grid: two empty
   cells at the bottom right on desktop, one at the bottom of the two-column
   mobile grid. A template would never ship that. The photograph tile now spans
   the full two columns from the smallest breakpoint, and `The practice` closes
   the desktop grid across three columns as a panoramic banner.
3. **Stock faces inline in the sentences.** `ScrollWords` supported avatar chips
   mid-paragraph — a patient photo a few words before "one standard of care".
   Removed from the component and from all three call sites. It implied a
   testimonial we are not allowed to make, and it broke the text colour.
4. **A research disclaimer orphaned under the appointments band.** The
   "single-centre review" caveat sat below "Speak to the practice", three
   sections from the research it qualifies. Removed from the home page; it still
   appears on `/research`, where it belongs.
5. **Copy that contradicted itself.** One card said *"Consulting rooms — Life
   Roseacres Hospital, Primrose"* and, underneath, *"Operates at Dr Phakisa
   Mokhesi Hospital, Sebokeng"*. Reworded to `Theatre lists at Dr Phakisa
   Mokhesi, Sebokeng` — same fact, no longer readable as a second consulting
   address.

## What we still don't have (and why that's fine)

- **A booking form above the fold.** Enquiries route to `/contact#appointment-request`
  and the phone number; a solo specialist's diary is not a self-service calendar,
  and the site says so explicitly ("an enquiry is not a confirmed appointment").
- **Team, insurance and package pages.** One doctor, one practice. Depth lives in
  the conditions list and patient information instead.
- **Review widgets.** See above.

## Standing rule from this pass

Every section must be tested at 390 px, 768 px, 1024 px, 1280 px and 1536 px.
Grids with a prime number of mixed-span tiles are the likeliest place to leave a
hole, and holes are the fastest signal of a hand-built site.
