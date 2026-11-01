import { analyzePage, optionalScrollChunks } from "./bundle-metrics.mjs";

const kib = (value) => `${(value / 1024).toFixed(1)} KiB`;
console.table(["index", "services", "about", "research", "patient-info"].map((name) => {
  const report = analyzePage(name);
  return {
    route: name === "index" ? "/" : `/${name}`,
    "modern scripts": report.modern.count,
    "modern raw": kib(report.modern.raw),
    "modern gzip": kib(report.modern.gzip),
    "legacy-only gzip": kib(report.legacy.gzip),
    "all script tags gzip": kib(report.total.gzip),
    "CSS gzip": kib(report.css.gzip),
    "HTML/RSC gzip": kib(report.document.gzip),
  };
}));
console.log("Optional desktop scroll chunk(s):", optionalScrollChunks().map((chunk) => ({
  ...chunk, gzipKiB: kib(chunk.gzip),
})));
console.log("Gzip level 9; excludes HTML/inline RSC data, images, fonts and route prefetches.");
console.log("Modern browsers skip noModule scripts. These are estimates, not live transfer timings.");
