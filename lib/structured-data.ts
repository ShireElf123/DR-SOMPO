import { practice, credentials, faqs } from "@/lib/practice";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.drngweysompo.co.za";

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
    telephone: practice.phone,
    email: practice.email,
    medicalSpecialty: ["Obstetric", "Gynecologic"],
    availableLanguage: practice.languages.map((language) => ({
      "@type": "Language",
      name: language,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: practice.addressLines[0],
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
        streetAddress: practice.addressLines[0],
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

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
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

export { siteUrl };
