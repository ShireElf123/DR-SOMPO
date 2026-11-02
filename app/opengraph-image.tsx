import { ImageResponse } from "next/og";

import { brandLockupDataUri } from "@/lib/brand-og";

export const alt = "Dr CM Ngwey-Sompo — Specialist Obstetrician & Gynaecologist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(140deg, #FDEFE3 0%, #F6B184 46%, #EB6300 100%)",
          padding: "72px",
          color: "#26221F",
          fontFamily: "sans-serif",
        }}
      >
        <img
          alt="Dr CM Ngwey-Sompo — Obstetrician & Gynaecologist"
          width={357}
          height={64}
          src={brandLockupDataUri}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 64, lineHeight: 1.05, letterSpacing: -2.4, maxWidth: 900 }}>
            Women&apos;s Health.
          </span>
          <span
            style={{
              fontSize: 64,
              lineHeight: 1.05,
              letterSpacing: -2.4,
              color: "rgba(38,34,31,0.72)",
              marginTop: 8,
            }}
          >
            Every Stage. Every Journey.
          </span>
          <span
            style={{
              fontSize: 22,
              color: "rgba(38,34,31,0.8)",
              marginTop: 28,
              maxWidth: 780,
              lineHeight: 1.4,
            }}
          >
            Specialist obstetrician &amp; gynaecologist · Life Roseacres Hospital,
            Primrose, Germiston
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 32,
            fontSize: 16,
            color: "rgba(38,34,31,0.75)",
          }}
        >
          <span>011 842 7651</span>
          <span>·</span>
          <span>English &amp; French</span>
          <span>·</span>
          <span>Fertility &amp; cervical health</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
