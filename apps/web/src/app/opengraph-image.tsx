import { ImageResponse } from "next/og";
import { site } from "@basecamp/shared";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#1f2e20",
        color: "#faf6ee",
      }}
    >
      <div style={{ fontSize: 28, color: "#c8642a", letterSpacing: 6, textTransform: "uppercase" }}>{site.tagline}</div>
      <div style={{ fontSize: 96, fontWeight: 800, marginTop: 16 }}>{site.name}</div>
      <div style={{ fontSize: 32, color: "#e8dcc2", marginTop: 24, maxWidth: 900 }}>{site.description}</div>
    </div>,
    size,
  );
}
