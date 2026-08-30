import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BUSINESS.name,
    short_name: "Trois Licornes",
    description: BUSINESS.description.fr,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f0e4",
    theme_color: "#1c140f",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
