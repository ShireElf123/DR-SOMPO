import type { MetadataRoute } from "next";
import { serviceDetails } from "@/lib/practice";
import { siteUrl } from "@/lib/structured-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const servicePages: MetadataRoute.Sitemap = serviceDetails.map((detail) => ({
    url: `${siteUrl}/services/${detail.serviceId}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/services`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...servicePages,
    { url: `${siteUrl}/about`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/research`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/patient-info`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: "yearly", priority: 0.9 },
  ];
}
