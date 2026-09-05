import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/utils/appUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/portal", "/set-password", "/forgot-password"],
      },
    ],
    sitemap: appUrl("/sitemap.xml"),
  };
}
