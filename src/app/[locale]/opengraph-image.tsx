import { ImageResponse } from "next/og";
import { BUSINESS } from "@/lib/business";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline = locale === "en" ? BUSINESS.tagline.en : BUSINESS.tagline.fr;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1c140f",
          color: "#efe6d4",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, textTransform: "uppercase", color: "#d1ab6f" }}>
          Café
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, marginTop: 6 }}>Aux Trois Licornes</div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 28, color: "#c9b9a3" }}>{tagline}</div>
      </div>
    ),
    { ...size }
  );
}
