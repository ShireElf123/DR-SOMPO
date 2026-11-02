#!/usr/bin/env node
/**
 * Brand asset generator.
 *
 * Every string in the identity is set in one of the two typefaces the site
 * already ships — Instrument Serif for the name and monogram, Figtree for the
 * supporting lines — and then converted to outlines, so the exported logo files
 * are font-independent: a printer, a sign-writer or a phone can open them
 * without the webfonts.
 *
 *   node scripts/brand/build.mjs
 *
 * `glyphs.json` holds per-glyph outlines and advances (font units, y-up) from
 * fontTools; see docs/brand/README.md to regenerate it after a copy change.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const data = JSON.parse(readFileSync(resolve(import.meta.dirname, "glyphs.json"), "utf8"));

const C = {
  ember: "#EB6300",
  peach: "#FBD4BD",
  cream: "#FDF8F2",
  ink: "#26221F",
};

const capRatio = { name: 0.72, nameShort: 0.72, monogram: 0.72, descriptor: 0.7, creds: 0.7 };
const r = (n) => Math.round(n * 100) / 100;

const widthOf = (id, cap, tracking = 0) => {
  const spec = data[id];
  const size = cap / capRatio[id];
  const s = size / spec.upm;
  const total = spec.glyphs.reduce((n, g) => n + g.adv * s, 0);
  return r(total + tracking * size * (spec.glyphs.length - 1));
};

function line(id, { cap, tracking = 0, x = 0, baseline = 0, fill, opacity }) {
  const spec = data[id];
  const size = cap / capRatio[id];
  const s = size / spec.upm;
  let cursor = 0;
  const uses = [];
  for (const g of spec.glyphs) {
    if (g.g === null) {
      cursor += g.adv * s;
      continue;
    }
    uses.push(`<use href="#brand-${g.g}" x="${r(cursor / s)}"/>`);
    cursor += g.adv * s + tracking * size;
  }
  const body = `<g transform="translate(${r(x)} ${r(baseline)}) scale(${+s.toFixed(6)} ${+(-s).toFixed(6)})"${fill ? ` fill="${fill}"` : ""}${opacity ? ` opacity="${opacity}"` : ""}>${uses.join("")}</g>`;
  return { body, width: r(cursor - tracking * size), size };
}

function doc({ w, h, parts, title, extra = "", bg = "" }) {
  const ids = [...new Set(parts.flatMap((p) => p.ids))];
  const paths = ids
    .map((g) => {
      const d = Object.values(data).map((s) => s.paths[g]).find(Boolean);
      return `<path id="brand-${g}" d="${d}"/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(w)} ${r(h)}" width="${r(w)}" height="${r(h)}" role="img" aria-label="${title}">
<title>${title}</title>
${bg}<defs>${paths}</defs>
${extra}${parts.map((p) => p.body).join("\n")}
</svg>
`;
}

const idsOf = (id) => data[id].glyphs.filter((g) => g.g).map((g) => g.g);

/* --------------------------------------------------------------- monogram */
const MONO_TRACK = -0.03;
const monoCap = 72;
const monoWidth = widthOf("monogram", monoCap, MONO_TRACK);
const monogram = doc({
  w: monoWidth,
  h: monoCap,
  title: "Dr CM Ngwey-Sompo monogram",
  parts: [
    { ...line("monogram", { cap: monoCap, tracking: MONO_TRACK, baseline: monoCap, fill: C.ember }), ids: idsOf("monogram") },
  ],
});

/* ------------------------------------------------------ horizontal lockup */
function horizontal(nameId, title, { descriptor = true } = {}) {
  const markCap = 30;
  const wordCap = 17.5;
  const descCap = 6.1;
  const gap = 12;
  const base = 35;
  const markW = widthOf("monogram", markCap, MONO_TRACK);
  const wordW = widthOf(nameId, wordCap);
  // letter-space the descriptor so it optically spans the wordmark
  const descW0 = widthOf("descriptor", descCap, 0.2);
  // Never condense: only letter-space outward, and only when the name is wide
  // enough to justify it. A shorter lockup keeps the descriptor at its own
  // natural tracking rather than crushing the letters together.
  const descTrack = descW0 < wordW
    ? 0.2 + (wordW - descW0) / (data.descriptor.glyphs.length - 1) / (descCap / capRatio.descriptor)
    : 0.2;
  const descW = widthOf("descriptor", descCap, descTrack);
  const x = markW + gap;
  const parts = [
    { ...line("monogram", { cap: markCap, tracking: MONO_TRACK, baseline: base + 1, fill: C.ember }), ids: idsOf("monogram") },
    { ...line(nameId, { cap: wordCap, x, baseline: base - 2, fill: C.ink }), ids: idsOf(nameId) },
    ...(descriptor
      ? [{ ...line("descriptor", { cap: descCap, tracking: descTrack, x, baseline: base + 12, fill: C.ink, opacity: 0.68 }), ids: idsOf("descriptor") }]
      : []),
  ];
  const w = x + (descriptor ? Math.max(wordW, descW) : wordW);
  return { svg: doc({ w, h: 55, parts, title }), w, h: 55 };
}

const full = horizontal("name", "Dr CM Ngwey-Sompo — Obstetrician &amp; Gynaecologist");
const short = horizontal("nameShort", "Dr Sompo", { descriptor: false });

/* --------------------------------------------------------- stacked lockup */
function stacked({ nameFill, markFill, metaFill, bg = "", title }) {
  const markCap = 74;
  const wordCap = 30;
  const descCap = 7.2;
  const credCap = 6;
  const baselineMark = 92;
  const baselineWord = 150;
  const ruleY = 172;
  const baselineDesc = 198;
  const baselineCreds = 222;
  const wordW = widthOf("name", wordCap);
  const descW0 = widthOf("descriptor", descCap, 0.24);
  const descTrack = descW0 < wordW
    ? 0.24 + (wordW - descW0) / (data.descriptor.glyphs.length - 1) / (descCap / capRatio.descriptor)
    : 0.24;
  const descW = widthOf("descriptor", descCap, descTrack);
  const credsW = widthOf("creds", credCap, 0.1);
  const markW = widthOf("monogram", markCap, MONO_TRACK);
  const w = Math.max(wordW, descW, credsW, markW) + 8;
  const mid = (width) => r((w - width) / 2);
  const parts = [
    { ...line("monogram", { cap: markCap, tracking: MONO_TRACK, x: mid(markW), baseline: baselineMark, fill: markFill }), ids: idsOf("monogram") },
    { ...line("name", { cap: wordCap, x: mid(wordW), baseline: baselineWord, fill: nameFill }), ids: idsOf("name") },
    { ...line("descriptor", { cap: descCap, tracking: descTrack, x: mid(descW), baseline: baselineDesc, fill: metaFill, opacity: 0.78 }), ids: idsOf("descriptor") },
    { ...line("creds", { cap: credCap, tracking: 0.1, x: mid(credsW), baseline: baselineCreds, fill: metaFill, opacity: 0.55 }), ids: idsOf("creds") },
  ];
  const ruleW = 88;
  const extra = `<rect x="${mid(ruleW)}" y="${ruleY}" width="${ruleW}" height="1.4" fill="${markFill}" opacity="0.4"/>\n`;
  return doc({ w, h: 240, parts, title, extra, bg });
}

const stackedInk = stacked({ nameFill: C.ink, markFill: C.ember, metaFill: C.ink, title: "Dr CM Ngwey-Sompo — stacked lockup" });
const stackedInverse = stacked({
  nameFill: C.cream,
  markFill: C.peach,
  metaFill: C.cream,
  bg: `<rect width="100%" height="100%" fill="${C.ember}"/>\n`,
  title: "Dr CM Ngwey-Sompo — inverse lockup",
});

/* --------------------------------------------------------------- app icon */
function appIcon(size, { radius = 0.22 } = {}) {
  const markCap = size * 0.46;
  const markW = widthOf("monogram", markCap, MONO_TRACK);
  const m = line("monogram", {
    cap: markCap,
    tracking: MONO_TRACK,
    x: (size - markW) / 2,
    baseline: size / 2 + markCap / 2,
    fill: C.cream,
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Dr CM Ngwey-Sompo">
<title>Dr CM Ngwey-Sompo</title>
<defs>${Object.entries(data.monogram.paths).map(([g, d]) => `<path id="brand-${g}" d="${d}"/>`).join("")}</defs>
<rect width="${size}" height="${size}"${radius ? ` rx="${r(size * radius)}"` : ""} fill="${C.ember}"/>
${m.body}
</svg>
`;
}

/* ------------------------------------------------- monogram as components */
// The outline lives in a sprite emitted by the root layout (server HTML), so the
// header — a client component — only ships a reference to it. Inlining the path
// in the header would push the client bundle over its budget.
const MONO_UNIT_X = 510; // N advance + tracking, in font units
const sprite = `// Generated by scripts/brand/build.mjs — do not edit by hand.
export function MonogramSprite() {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0 overflow-hidden">
      <symbol id="brand-monogram" viewBox="0 0 917 720">
        <g transform="translate(0 720) scale(1 -1)" fill="currentColor">
          <path d="${data.monogram.paths.N}" />
          <path d="${data.monogram.paths.S}" transform="translate(${MONO_UNIT_X} 0)" />
        </g>
      </symbol>
    </svg>
  );
}
`;
// The share card is an ImageResponse (satori): it can only render the lockup as
// an image, so the SVG travels as a data URI in its own generated module.
const lockupB64 = Buffer.from(
  full.svg.replace(/width="[\d.]+" height="[\d.]+"/, ""),
).toString("base64");
const ogModule = `// Generated by scripts/brand/build.mjs — do not edit by hand.
export const brandLockupDataUri =
  "data:image/svg+xml;base64,${lockupB64}";
`;

const files = {
  "components/brand-monogram-sprite.tsx": sprite,
  "lib/brand-og.ts": ogModule,
  "public/brand/monogram.svg": monogram,
  "public/brand/logo-horizontal.svg": full.svg,
  "public/brand/logo-horizontal-short.svg": short.svg,
  "public/brand/logo-stacked.svg": stackedInk,
  "public/brand/logo-stacked-inverse.svg": stackedInverse,
  "public/brand/app-icon.svg": appIcon(512),
  "public/brand/app-icon-bleed.svg": appIcon(512, { radius: 0 }),
  "app/icon.svg": appIcon(64),
};

for (const [path, content] of Object.entries(files)) {
  const abs = resolve(root, path);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  console.log(`${path.padEnd(40)} ${(content.length / 1024).toFixed(1)} KB`);
}
console.log({ monogram: monoWidth, horizontalFull: [full.w, full.h], horizontalShort: [short.w, short.h] });
