import type { MetadataRoute } from "next";
import { getCompanySettings } from "@/lib/services/settingsService";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getCompanySettings();
  const customIconUrl = settings.activeAppIcon?.publicUrl;

  return {
    name: settings.companyName,
    short_name: settings.companyName,
    description: "Bahrain-based software studio",
    start_url: "/",
    display: "browser",
    background_color: "#0b0d10",
    theme_color: "#0b0d10",
    icons: customIconUrl
      ? [{ src: customIconUrl, sizes: "any", type: settings.activeAppIcon?.mimeType ?? undefined }]
      : [
          { src: "/branding/atoi-icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/branding/atoi-icon-512.png", sizes: "512x512", type: "image/png" },
        ],
  };
}
