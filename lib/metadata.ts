import type { Metadata } from "next";
import { practice } from "@/lib/practice";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const socialTitle = `${title} | ${practice.entity}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      type: "website",
      locale: "en_ZA",
      siteName: practice.entity,
    },
    twitter: { card: "summary_large_image", title: socialTitle, description },
  };
}
