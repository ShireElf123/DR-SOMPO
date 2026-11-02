# Dr CM Ngwey-Sompo Inc. — Obstetrics & Gynaecology

A premium editorial website for a specialist obstetrician and gynaecologist
practising at Life Roseacres Hospital, Primrose, Germiston.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion (LazyMotion) · Lucide icons · self-hosted variable Figtree.

---

## Running locally

```bash
npm ci
npm run dev     # http://localhost:3000  (binds 0.0.0.0)
npm run build   # production build
npm start       # production server
npm run typecheck
```

Copy `.env.example` to `.env.local` for local configuration. Online collection is off by default. Complete the [delivery and privacy activation checklist](docs/enquiry-operations.md) before enabling it; a receiver URL alone is not approval or proof of delivery.

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

**Typography** — self-hosted variable Figtree, served locally by Fontsource.

**Motion** — `components/ui/motion.tsx` exposes the shared reveal, heading,
parallax and scroll-lit primitives. `MotionProvider` loads `domAnimation` with
strict `m` components; adding layout or drag features requires an explicit
bundle review. Static section markup stays on the server.

The hydration-safe `useReducedMotion()` hook and the global
`prefers-reduced-motion` CSS query handle motion preferences. Lenis is optional:
it loads during idle only for fine-pointer, hover-capable devices without a
reduced-motion preference. Native scrolling is the fallback.

## Quality checks

```bash
npm run build
npm run typecheck
npm run lint
npm test                 # 37 API/calendar/SSR/bundle/contrast checks
npm run analyze          # modern vs legacy scripts, optional scrolling, CSS and HTML/RSC
npx playwright install chromium  # once per machine
npm run test:e2e          # production browser checks; manages a local test server
```

To test an existing local production server, set `PLAYWRIGHT_BASE_URL`. This skips
Playwright's test-only environment setup: use a separate synthetic QA server,
not production. The ordinary preview intentionally has no active form while
delivery is unconfigured.
`CHROMIUM_EXECUTABLE_PATH` optionally selects an installed Chromium binary.
Test screenshots/traces are ignored by Git. Enquiry tests intercept submission
requests; they never send patient details to a delivery provider.

See the [current repair and verification report](docs/audits/2026-11-01-repairs/README.md)
for the banner fix, all 22 audit dispositions, 100 browser scenarios (including
96 responsive combinations and 24 axe scans), evidence and remaining approvals.
The [earlier quality notes](docs/quality-upgrade.md) retain the historical
performance baseline and invisible-text diagnosis.

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
  structured-data.ts    Physician / scoped FAQPage / WebSite JSON-LD
  appointment-dates.ts  SAST date-only calendar and validation
  enquiry.ts            shared service/contact/field validation
  enquiry-config.ts     server-side activation gate
  photography.ts        truthful generated-image descriptions
```

---

## Editorial governance (important)

Practice facts and service data are centralised in `lib/practice.ts`; presentation
copy also lives in the pages/components. Items the brief marked
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
practice-supplied credentials, affiliations, research and clear contact routes.
Source verification flags reflect the supplied brief, not independent medical
or regulatory verification performed by this engineering change. The practice
must approve the final content and replace the generated placeholder
photography with approved, licensed real images. The requested design does not
include visible image-provenance badges or notices; factual alternative text
and internal provenance records remain.

---

## Privacy and delivery

- No personal-data form is rendered unless collection is explicitly enabled and
  an HTTPS receiver is configured. Otherwise the page offers telephone/email.
- A configured form asks for contact details, optional date/time/service
  preferences and an optional **non-clinical** note, with consent and a privacy
  notice link. Users may still enter sensitive information despite the warning.
- Server HTML keeps fields disabled until hydration; the native action is POST,
  never GET. The API validates a bounded request and only acknowledges success
  after the configured receiver accepts it. This is not a confirmed booking.
- The application does not log enquiry bodies or implement a patient-record
  database. That is **not** a guarantee of no storage: delivery providers,
  mailboxes, queues, backups and hosting logs can retain data under their policies.
- Honeypot filtering is not distributed abuse protection. No client timestamp
  is trusted as a rate limiter. Configure platform/receiver controls before
  activation, and do not claim legal compliance without practice review.
- No analytics/session replay was added. Review any future integrations before
  allowing them to access personal-data fields.

See [enquiry operations](docs/enquiry-operations.md) for the approval checklist,
configuration, receiver contract, testing, incident response and rollback.

---

## Accessibility

- Semantic landmarks, one `h1`, ordered headings, skip link.
- FAQs use native `details` / `summary`: keyboard operation, correct collapsed
  semantics and working no-JavaScript disclosures.
- Form labels, `aria-invalid`, described-by error messages, visible focus rings.
- Body copy and small labels were audited against WCAG AA contrast on ivory,
  white, sage, mint and forest backgrounds.
- Reduced-motion/static marquee modes, visible pause controls and a reactive
  cursor lifecycle. Automated checks do not replace physical-device or
  assistive-technology testing.

## SEO

- Per-page metadata, Open Graph and Twitter cards, generated OG image.
- `Physician` + `WebSite` JSON-LD from practice-supplied content, with FAQ schema
  scoped to pages containing its answers. Service pages are not blanket-labelled
  non-invasive procedures; no invented ratings, hours or prices.
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
4. Complete [enquiry operations](docs/enquiry-operations.md): approve the receiver,
   privacy/retention arrangements and distributed abuse controls; verify receipt
   with authorised synthetic data. Configure URL/token securely and set
   `ENQUIRY_ENABLED=true` **last**. Otherwise keep direct-contact mode.
5. Set `NEXT_PUBLIC_SITE_URL` to the live domain — the current default
   (`https://www.drngweysompo.co.za`) is a placeholder and is used for
   canonical URLs, Open Graph, the sitemap and JSON-LD. Then submit
   `sitemap.xml` to Google Search Console.
