import { ImageResponse } from "next/og";

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
          background: "linear-gradient(140deg, #174D3C 0%, #0F3A2D 55%, #0A2A20 100%)",
          padding: "72px",
          color: "#F8F7F2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              border: "1px solid rgba(220,235,225,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#D6C6A2" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 24, letterSpacing: -0.5 }}>Dr Ngwey-Sompo</span>
            <span
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(220,235,225,0.6)",
                marginTop: 4,
              }}
            >
              Obstetrics &amp; Gynaecology
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 64, lineHeight: 1.05, letterSpacing: -2.4, maxWidth: 900 }}>
            Women&apos;s Health.
          </span>
          <span
            style={{
              fontSize: 64,
              lineHeight: 1.05,
              letterSpacing: -2.4,
              color: "#DCEBE1",
              marginTop: 8,
            }}
          >
            Every Stage. Every Journey.
          </span>
          <span
            style={{
              fontSize: 22,
              color: "rgba(220,235,225,0.65)",
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
            color: "rgba(220,235,225,0.55)",
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
