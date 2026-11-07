import { readFileSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";

const gzipBytes = (buffer) => gzipSync(buffer, { level: 9 }).length;
const total = (assets, field) => assets.reduce((sum, asset) => sum + asset[field], 0);

/** Sizes of unique scripts/styles referenced by the production HTML, not prefetches. */
export function analyzePage(name = "index") {
  const html = readFileSync(`.next/server/app/${name}.html`, "utf8");
  const scripts = new Map();
  const styles = new Map();
  for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js)"[^>]*>/g)) {
    const buffer = readFileSync(`.next${match[1].replace(/^\/_next/, "")}`);
    scripts.set(match[1], {
      src: match[1],
      legacy: /\bnomodule\b/i.test(match[0]),
      raw: buffer.length,
      gzip: gzipBytes(buffer),
    });
  }
  for (const match of html.matchAll(/<link\b[^>]*\bhref="([^"]+\.css)"[^>]*>/g)) {
    const buffer = readFileSync(`.next${match[1].replace(/^\/_next/, "")}`);
    styles.set(match[1], { src: match[1], raw: buffer.length, gzip: gzipBytes(buffer) });
  }
  const chunks = [...scripts.values()];
  const modern = chunks.filter((chunk) => !chunk.legacy);
  const legacy = chunks.filter((chunk) => chunk.legacy);
  return {
    html,
    chunks,
    document: { raw: Buffer.byteLength(html), gzip: gzipBytes(Buffer.from(html)) },
    modern: { count: modern.length, raw: total(modern, "raw"), gzip: total(modern, "gzip") },
    legacy: { count: legacy.length, raw: total(legacy, "raw"), gzip: total(legacy, "gzip") },
    total: { count: chunks.length, raw: total(chunks, "raw"), gzip: total(chunks, "gzip") },
    css: { raw: total([...styles.values()], "raw"), gzip: total([...styles.values()], "gzip") },
  };
}

/** Lenis is a separately requested desktop enhancement, never a mobile prerequisite. */
export function optionalScrollChunks() {
  return readdirSync(".next/static/chunks")
    .filter((name) => name.endsWith(".js"))
    .flatMap((name) => {
      const buffer = readFileSync(`.next/static/chunks/${name}`);
      return buffer.includes("window.lenisVersion")
        ? [{ src: `/_next/static/chunks/${name}`, raw: buffer.length, gzip: gzipBytes(buffer) }]
        : [];
    });
}
