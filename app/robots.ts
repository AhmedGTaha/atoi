import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/portal", "/set-password", "/forgot-password"],
      },
    ],
    sitemap: "https://atoi.online/sitemap.xml",
  };
}
