# Dr CM Ngwey-Sompo Inc. — Obstetrics & Gynaecology

A premium editorial website for a specialist obstetrician and gynaecologist
practising at Life Roseacres Hospital, Primrose, Germiston.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion · Lucide icons · self-hosted Inter Tight + Instrument Serif.

---

## Running locally

```bash
npm install
npm run dev     # http://localhost:3000  (binds 0.0.0.0)
npm run build   # production build
npm start       # production server
npm run typecheck
```

Copy `.env.example` to `.env.local` before wiring up enquiry delivery.

---

## Design system

The visual language is a deliberate clone of the reference layout supplied by
the client — large rounded "page sheet", generous white surfaces, floating
information cards, editorial photography, restrained motion — re-skinned in the
practice's palette.

| Token | Hex | Used for |
| --- | --- | --- |
| `forest` | `#174D3C` | Primary brand colour, feature panels, buttons |
| `forest-deep` | `#0F3A2D` | Footer, gradient depth |
| `forest-ink` | `#0A2A20` | Deep gradient stops, image overlays |
| `sage` | `#DCEBE1` | Section tints, chips, image placeholders |
| `mint` | `#EAF4EE` | Soft callouts, form surfaces |
| `ivory` | `#F8F7F2` | Page background, light text on forest |
| `charcoal` | `#222722` | Body copy |
| `gold` | `#D6C6A2` | Small accents and "needs confirmation" markers |

All tokens live in `app/globals.css` under `@theme`, so `bg-forest`,
`text-sage/70`, `border-forest/10` etc. work out of the box.

**Typography** — Inter Tight (variable) for everything structural, Instrument
Serif italic for the single accent phrase in each headline. The pairing is what
lifts the layout from "medical template" to "editorial healthcare brand".

**Motion** — `components/ui/motion.tsx` exposes `Reveal`, `RevealGroup`,
`RevealItem` and `WordsIn` (word-by-word masked headline rise). Every animation
is gated behind `useReducedMotion()` **and** the global
`prefers-reduced-motion` media query in `globals.css`.

---

## Structure

```
app/
  layout.tsx            fonts, skip link, JSON-LD, page sheet, nav/footer
  page.tsx              homepage composition
  globals.css           design tokens, components, reduced-motion
  api/enquiry/route.ts  validated, fail-closed enquiry endpoint
  opengraph-image.tsx   generated social card
  sitemap.ts robots.ts  SEO plumbing
  icon.svg not-found.tsx

components/
  navbar.tsx            sticky nav, scroll-spy pill, mobile sheet
  ticker.tsx            announcement marquee
  logo.tsx footer.tsx sticky-actions.tsx enquiry-form.tsx
  ui/motion.tsx         shared animation primitives
  sections/             hero, services, approach, journey, fertility,
                        about, care, research, faqs, contact, final-cta

lib/
  practice.ts           single source of truth for all published facts
  structured-data.ts    Physician / FAQPage / WebSite JSON-LD
```

---

## Editorial governance (important)

`lib/practice.ts` is the only place content is written. Items the brief marked
"to confirm" carry `state: "pending"` and are rendered with a visible gold
marker instead of being presented as fact:

- **WhatsApp number** — `practice.whatsappNumber` is `null`. Set it to an
  E.164-style string (e.g. `"27821234567"`) and every WhatsApp CTA across the
  site activates automatically; until then the contact card explains that the
  channel is pending.
- **Dr Phakisa Mokhesi affiliation** — pending confirmation of the institutional
  name and the nature of the affiliation.
- **IJGO abstract** — presented as "publication record to be verified".
- **Consulting hours, practice number, medical aid arrangements** — deliberately
  not published; the site directs patients to confirm directly.

The research section describes the MMed study but publishes **no statistics,
numerical findings or clinical interpretations**. The original abstract and
thesis must be reviewed with the author before any results appear.

Every clinical section closes with a note that services are subject to
confirmation against the doctor's actual practice and hospital privileges.

**No patient testimonials or star ratings.** The reference site carries a
"Real People. Real Results." review grid; that block was intentionally not
reproduced. Publishing patient testimonials for a medical practitioner risks
breaching HPCSA guidelines on professional advertising, and any review shown
would have had to be invented. The trust-building work is done instead with
verified credentials, affiliations, research and clear contact routes.

---

## Privacy (POPIA)

- The enquiry form asks for the minimum: name, one contact method, an optional
  preferred time of day, and an optional **non-clinical** note.
- Nothing is persisted server-side. `app/api/enquiry/route.ts` validates,
  strips control characters, rejects honeypot and too-fast submissions, and
  forwards the enquiry to `ENQUIRY_WEBHOOK_URL`.
- If that endpoint is unset or unreachable the request returns an error that
  instructs the patient to call or email — it never silently drops a message.
- No analytics or third-party scripts are loaded.
- The form states clearly that submitting does not constitute a confirmed
  appointment and is not a channel for urgent or clinical questions.

---

## Accessibility

- Semantic landmarks, one `h1`, ordered headings, skip link.
- FAQ accordion uses `aria-expanded` / `aria-controls` with a `role="region"`
  panel.
- Form labels, `aria-invalid`, described-by error messages, visible focus rings.
- Body copy and small labels were audited against WCAG AA contrast on ivory,
  white, sage, mint and forest backgrounds.
- Full reduced-motion support, including the announcement marquee.

## SEO

- Per-page metadata, Open Graph and Twitter cards, generated OG image.
- `Physician` + `FAQPage` + `WebSite` JSON-LD built from verified content only —
  no `aggregateRating`, no invented hours or prices.
- `sitemap.xml` and `robots.txt` generated from `NEXT_PUBLIC_SITE_URL`.
- Security headers (HSTS, nosniff, referrer policy, frame options,
  permissions policy) set in `next.config.ts`.

---

## Before launch

1. Replace the AI-generated placeholder photography in `public/images/` with
   the practice's own photographs of Dr Sompo, the consulting rooms and Life
   Roseacres Hospital.
2. Confirm the WhatsApp number, exact address formatting, consulting hours,
   practice number and medical aid arrangements.
3. Verify the IJGO abstract citation and obtain the thesis before publishing any
   numerical findings.
4. Configure `ENQUIRY_WEBHOOK_URL` (and token) so the enquiry form can deliver.
5. Set `NEXT_PUBLIC_SITE_URL` to the live domain — the current default
   (`https://www.drngweysompo.co.za`) is a placeholder and is used for
   canonical URLs, Open Graph, the sitemap and JSON-LD. Then submit
   `sitemap.xml` to Google Search Console.

---

## Deployment

The Vercel project has `gitProviderOptions.createDeployments` set to
`disabled`, and the repository carries a `vercel.json` with
`git.deploymentEnabled: { "main": true, "**": false }`. Both are deliberate.

**Why:** the project's production branch is `main`. This repository is developed
on feature branches that sit in an open pull request, so a push to one of them
is not a release. Without those two settings every push produced a *pair* of
deployments — a preview for the branch and, when the Vercel integration felt
like it, a production build that claimed the live alias mid-review. That is how a
half-finished branch reached production more than once.

**How to release:** merge the pull request into `main`. That is the only push
that produces a production deployment, and `main` is the only branch that does.

**How to look at work in progress:** trigger a preview deployment by hand, or
use the branch alias. Previews are behind Vercel Authentication
(`ssoProtection: all_except_custom_domains`), so open them while signed in to
Vercel — a plain `curl` will get a login page, which is expected and not a bug.

**How to verify a release landed:** the deployment must report
`readySubstate: PROMOTED` and carry `dr-cm-ngwey-sompo-website.vercel.app` in its
`alias` list. A deployment that is `READY` but `STAGED`, with `target: null`, is a
preview and is not live. Check that, not just the READY state.
