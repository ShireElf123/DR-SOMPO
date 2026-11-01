import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { analyzePage, optionalScrollChunks } from "../scripts/bundle-metrics.mjs";

const home = analyzePage();

function luminance(channels) {
  return channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}
function contrast(a, b) {
  const [bright, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (bright + 0.05) / (dark + 0.05);
}
function rgb(hex) {
  return hex.match(/[0-9a-f]{2}/gi).map((channel) => parseInt(channel, 16));
}
function composite(foreground, alpha, background) {
  return background.map((channel, index) => foreground[index] * alpha + channel * (1 - alpha));
}
function restingColor(tint) {
  const paragraph = home.html.match(new RegExp(`<p[^>]*data-scroll-words="${tint}"[^>]*>([\\s\\S]*?)<\\/p>`));
  assert.ok(paragraph, `Missing ${tint} reading layer`);
  return paragraph[1].match(/style="color:([^";]+)"/)[1];
}

const css = readFileSync("app/globals.css", "utf8");
function token(name) {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, "i"));
  assert.ok(match, `Missing colour token ${name}`);
  return rgb(match[1]);
}

test("initial modern home scripts stay below 200 KiB gzip", () => {
  assert.ok(home.modern.gzip <= 200 * 1024, `Home scripts: ${home.modern.gzip} B; budget: 204800 B`);
  assert.equal(home.total.gzip, home.modern.gzip + home.legacy.gzip);
  assert.ok(home.legacy.count > 0, "Report the legacy-only polyfill separately");
});

test("optional scrolling is absent from initial script tags", () => {
  const optional = optionalScrollChunks();
  assert.equal(optional.length, 1, "Expected one separately loadable Lenis chunk");
  assert.ok(optional[0].gzip < 8 * 1024);
  assert.ok(!home.chunks.some((chunk) => chunk.src === optional[0].src));
});

test("HTML/RSC stays bounded too, not just the script download", () => {
  assert.ok(home.document.gzip <= 30 * 1024, `HTML/RSC: ${home.document.gzip} B gzipped`);
  assert.ok(home.modern.gzip + home.document.gzip <= 235 * 1024);
});

test("CSS stays within the existing small budget", () => {
  assert.ok(home.css.gzip <= 16 * 1024, `CSS: ${home.css.gzip} B gzipped`);
});

test("resting light text meets AA on white and ivory", () => {
  const foreground = rgb(restingColor("light"));
  for (const background of [[255, 255, 255], token("ivory")]) {
    assert.ok(contrast(foreground, background) >= 4.5, `Resting contrast: ${contrast(foreground, background)}`);
  }
});

test("resting forest text meets AA including the lightest gradient wash", () => {
  const rgba = restingColor("forest").match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/).slice(1).map(Number);
  const wash = css.match(/radial-gradient\(100% 120% at 92% 0%, rgba\(([^)]+)\)/)[1].split(",").map(Number);
  const brightest = composite(wash.slice(0, 3), wash[3], token("forest"));
  for (const background of [token("forest"), token("forest-deep"), token("forest-ink"), brightest]) {
    const ratio = contrast(composite(rgba.slice(0, 3), rgba[3], background), background);
    assert.ok(ratio >= 4.5, `Resting forest contrast: ${ratio}`);
  }
});

test("SSR copy needs neither hydration nor decorative duplicates", () => {
  for (const name of ["index", "services", "about", "research", "patient-info"]) {
    const { html } = analyzePage(name);
    assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, `${name}: one h1`);
    assert.ok(!html.includes("translateY(115%)"), `${name}: clipped server heading`);
    for (const paragraph of html.matchAll(/<p[^>]*data-scroll-words="[^"]+"[^>]*>([\s\S]*?)<\/p>/g)) {
      assert.ok(!paragraph[1].includes("opacity:0"), `${name}: hidden reading layer`);
      assert.ok(!paragraph[1].includes('class="absolute inset-0"'), `${name}: decorative copy shipped unnecessarily`);
    }
  }
});

test("components cannot reintroduce full Motion or layout/drag features", () => {
  for (const name of readdirSync("components", { recursive: true }).filter((name) => name.endsWith(".tsx"))) {
    const source = readFileSync(`components/${name}`, "utf8");
    for (const match of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']framer-motion["']/g)) {
      assert.ok(!/\b(motion|domMax|useReducedMotion)\b/.test(match[1]), `${name}: full runtime or non-hydration-safe hook`);
    }
    assert.ok(!/\b(layout|layoutId|drag)\s*=/.test(source), `${name}: feature unavailable in domAnimation`);
  }
});
