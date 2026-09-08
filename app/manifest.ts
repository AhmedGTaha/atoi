import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ATOI",
    short_name: "ATOI",
    description: "Bahrain-based software studio",
    start_url: "/",
    display: "browser",
    background_color: "#0b0d10",
    theme_color: "#0b0d10",
    icons: [
      {
        src: "/branding/atoi-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/branding/atoi-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
