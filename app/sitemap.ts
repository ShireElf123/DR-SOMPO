import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/structured-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/#services`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/#fertility`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/#about`, lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteUrl}/#research`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/#contact`, lastModified, changeFrequency: "yearly", priority: 0.9 },
  ];
}
