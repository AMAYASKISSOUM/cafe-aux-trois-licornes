import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1c140f",
          borderRadius: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5 }}>
          <div style={{ width: 6, height: 20, backgroundColor: "#b4823c", borderRadius: 3 }} />
          <div style={{ width: 6, height: 30, backgroundColor: "#d1ab6f", borderRadius: 3 }} />
          <div style={{ width: 6, height: 24, backgroundColor: "#b4823c", borderRadius: 3 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
