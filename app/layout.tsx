import type { Metadata, Viewport } from "next";
import "@fontsource-variable/figtree";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#174D3C" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
      <body className="bg-white antialiased">
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
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
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
