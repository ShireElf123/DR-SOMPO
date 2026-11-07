import { practice, credentials, faqs } from "@/lib/practice";

/**
 * The canonical origin for every absolute URL the site emits — canonical tags,
 * Open Graph, the sitemap, robots.txt and JSON-LD.
 *
 * `NEXT_PUBLIC_SITE_URL` is set per Vercel environment. The fallback exists so a
 * local `next build` does not crash, but it is only ever the placeholder in
 * development: a *production* build with no value would silently publish
 * `drngweysompo.co.za` as the canonical host and hand Google a domain nobody has
 * bought. Rather than let that ship quietly, fail the build.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

  if (configured) return configured;

  if (process.env.VERCEL_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set for the production environment. Refusing to " +
        "publish canonical URLs, Open Graph tags and JSON-LD pointing at the " +
        "placeholder domain. Set it in the Vercel project settings and redeploy.",
    );
  }

  return "https://www.drngweysompo.co.za";
}

export const siteUrl = resolveSiteUrl();

/**
 * Local medical-practice structured data.
 *
 * Deliberately conservative: no aggregateRating (we have no verified reviews),
 * no priceRange, no openingHours (unconfirmed), no medicalSpecialty claims
 * beyond the specialist title. All of this keeps the markup truthful and
 * compliant with Google's guidance on health-related structured data.
 */
export function practiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${siteUrl}/#practice`,
    name: practice.entity,
    alternateName: "Dr CM Ngwey-Sompo — Obstetrics & Gynaecology",
    url: siteUrl,
    logo: `${siteUrl}/brand/app-icon-512.png`,
    image: `${siteUrl}/opengraph-image`,
    telephone: practice.phone,
    email: practice.email,
    medicalSpecialty: ["Obstetric", "Gynecologic"],
    availableLanguage: practice.languages.map((language) => ({
      "@type": "Language",
      name: language,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${practice.room}, ${practice.hospital}, ${practice.addressLines[1]}`,
      addressLocality: practice.suburb,
      addressRegion: "Gauteng",
      postalCode: "1401",
      addressCountry: "ZA",
    },
    areaServed: [
      { "@type": "City", name: "Germiston" },
      { "@type": "City", name: "Johannesburg" },
      { "@type": "AdministrativeArea", name: "Ekurhuleni" },
    ],
    location: {
      "@type": "Hospital",
      name: practice.hospital,
      address: {
        "@type": "PostalAddress",
        streetAddress: practice.addressLines[1],
        addressLocality: practice.suburb,
        addressRegion: "Gauteng",
        addressCountry: "ZA",
      },
    },
    employee: {
      "@type": "Physician",
      name: practice.doctorName,
      honorificPrefix: "Dr",
      jobTitle: practice.title,
      hasCredential: credentials.map((credential) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: `${credential.code} — ${credential.title}`,
        recognizedBy: { "@type": "Organization", name: credential.institution },
      })),
      knowsLanguage: practice.languages,
    },
    makesOffer: [
      "Antenatal care and pregnancy monitoring",
      "Vaginal and caesarean delivery",
      "General gynaecological consultations",
      "Contraception and reproductive health assessments",
      "Urogynaecological diagnosis and referral",
      "Fertility assessment and consultation",
      "Laparoscopic and open gynaecological surgery",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "MedicalProcedure", name },
    })),
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/contact`,
        inLanguage: "en-ZA",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: { "@type": "Reservation", name: "Appointment enquiry" },
    },
  };
}

export function faqJsonLd(items = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: `${practice.entity} — ${practice.title}`,
    inLanguage: "en-ZA",
    publisher: { "@id": `${siteUrl}/#practice` },
  };
}

