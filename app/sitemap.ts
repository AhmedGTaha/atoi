import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/utils/appUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: appUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: appUrl("/privacy"),
      lastModified: new Date(),
    },
    {
      url: appUrl("/terms"),
      lastModified: new Date(),
    },
  ];
}
