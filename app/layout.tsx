import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { MotionProvider } from "@/components/motion-provider";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";
import { Ticker } from "@/components/ticker";
import { Footer } from "@/components/footer";
import { StickyActions } from "@/components/sticky-actions";
import { Cursor } from "@/components/ui/cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { practice } from "@/lib/practice";
import { practiceJsonLd, siteUrl, websiteJsonLd } from "@/lib/structured-data";

// Preload the existing, self-hosted typeface. Optional display avoids a late
// font swap moving hero copy/controls on a cold, throttled mobile connection.
const figtree = localFont({
  src: "../node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2",
  variable: "--font-figtree",
  weight: "300 900",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Dr CM Ngwey-Sompo | Specialist Obstetrician & Gynaecologist, Germiston",
    template: "%s | Dr CM Ngwey-Sompo Inc.",
  },
  description:
    "Specialist obstetric and gynaecological care with Dr CM Ngwey-Sompo at Life Roseacres Hospital, Primrose, Germiston. Obstetrics, gynaecology, fertility and minimally invasive surgery. Consultations in English and French.",
  keywords: [
    "obstetrician Germiston",
    "gynaecologist Germiston",
    "OBGYN Johannesburg",
    "Dr Ngwey-Sompo",
    "Life Roseacres Hospital obstetrician",
    "fertility specialist Germiston",
    "antenatal care Primrose",
    "laparoscopic hysterectomy South Africa",
  ],
  authors: [{ name: practice.entity }],
  creator: practice.entity,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: `${practice.entity}`,
    title: "Dr CM Ngwey-Sompo | Specialist Obstetrician & Gynaecologist",
    description:
      "Women's health. Every stage. Every journey. Compassionate, personalised and evidence-informed obstetric and gynaecological care in Primrose, Germiston.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr CM Ngwey-Sompo | Specialist Obstetrician & Gynaecologist",
    description:
      "Compassionate, personalised and evidence-informed obstetric and gynaecological care in Primrose, Germiston.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "health",
  applicationName: `${practice.entity}`,
};

export const viewport: Viewport = {
  // Both preferences report the warm cream chrome. The document is
  // `color-scheme: only light` (see globals.css): a user in dark mode gets this
  // audited scheme rather than a half-inverted one, which is the contrast
  // failure the reference site exhibits in dark mode.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF8F2" },
    { media: "(prefers-color-scheme: dark)", color: "#FDF8F2" },
  ],
  colorScheme: "only light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={figtree.variable}>
      <body className="bg-cream antialiased">
        {/* JSON-LD is generated from typed, verified content — never user input. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(practiceJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ember focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
        >
          Skip to content
        </a>

        <MotionProvider>
          <SmoothScroll />
          <Cursor />
          <ScrollProgress />
          {/* The announcement bar scrolls away; only the nav docks. On a phone
              that hands roughly 40px of viewport back the moment you scroll. */}
          <Ticker />
          <div className="sticky top-0 z-[70]">
            <Navbar />
          </div>
          <main id="main">
            <PageTransition>{children}</PageTransition>
          </main>
          <StickyActions />
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
