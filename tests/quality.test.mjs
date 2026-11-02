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

test("resting light text meets AA on white, cream and blush", () => {
  const foreground = rgb(restingColor("light"));
  for (const background of [[255, 255, 255], token("cream"), token("blush")]) {
    assert.ok(contrast(foreground, background) >= 4.5, `Resting contrast: ${contrast(foreground, background)}`);
  }
});

test("charcoal clears AA on every coloured surface, including the deepest orange", () => {
  for (const surface of ["cream", "blush", "peach", "apricot", "tangerine", "ember"]) {
    const ratio = contrast(token("charcoal"), token(surface));
    assert.ok(ratio >= 4.5, `Charcoal on ${surface}: ${ratio}`);
  }
});

test("the warm ramp never goes darker than #EB6300 and never turns into brown", () => {
  assert.equal(css.match(/--color-ember:\s*(#[0-9a-f]{6})/i)[1].toLowerCase(), "#eb6300");
  const warm = ["cream", "blush", "peach", "apricot", "tangerine", "ember"];
  const floorValue = luminance(token("ember"));
  for (const name of warm) {
    assert.ok(luminance(token(name)) >= floorValue, `${name} is darker than the #EB6300 stop`);
  }
  // Only deliberate text ink sits below the ramp; there is no dark surface token.
  for (const name of ["charcoal", "ink", "ink-soft", "ink-muted"]) {
    assert.ok(luminance(token(name)) < floorValue, `${name} should be a text ink`);
  }
  assert.doesNotMatch(css, /--color-(forest|sage|mint|ivory|lime|fern|clay|sand|mist)\b/);
});

test("footer and feature panels are warm surfaces with charcoal type, never dark blocks", () => {
  const footer = readFileSync("components/footer.tsx", "utf8");
  assert.match(footer, /ember-gradient/);
  assert.doesNotMatch(footer, /bg-(charcoal|black|ember|forest)\b/);
  assert.doesNotMatch(footer, /text-white/);
  // Large ember/tangerine feature tiles hand their type to charcoal, not white.
  const bento = readFileSync("components/sections/bento.tsx", "utf8");
  for (const block of bento.match(/className="[^"]*bg-(?:ember|tangerine)[^"]*"/g) ?? []) {
    assert.doesNotMatch(block, /text-white/);
  }
});

test("warm glass keeps charcoal readable over the deepest surface and over photography", () => {
  const hex = css.match(/\.glass\s*{[^}]*background:\s*#fdf8f2([0-9a-f]{2})/i)[1];
  const fill = parseInt(hex, 16) / 255;
  assert.ok(fill >= 0.72, `Glass fill is too transparent: ${fill}`);
  for (const behind of [token("ember"), [0, 0, 0], [255, 255, 255]]) {
    const pane = composite(token("cream"), fill, behind);
    const ratio = contrast(token("charcoal"), pane);
    assert.ok(ratio >= 4.5, `Charcoal on glass over ${behind}: ${ratio}`);
  }
  // The frost is restated outside the cascade layers, and forced colours strip it.
  assert.match(css, /\.hero-copy-plate[\s\S]{0,120}?\{[^}]*backdrop-filter: var\(--glass-blur\)/);
  assert.match(css, /--glass-blur: none/);
});

test("the depth system is layered and warm, never a black drop shadow", () => {
  for (const name of ["soft", "layer", "lift", "float"]) {
    const block = css.match(new RegExp(`--shadow-${name}:([^;]+);`))[1];
    assert.ok((block.match(/rgba\(/g) || []).length >= 2, `${name} should be layered`);
    assert.doesNotMatch(block, /rgba\(0,\s*0,\s*0/);
  }
});

test("dark mode is opted out instead of half-inverted", () => {
  assert.match(css, /color-scheme:\s*only light/);
  assert.match(css, /input:-webkit-autofill/);
  assert.match(css, /@media \(forced-colors: active\)/);
  const layout = readFileSync("app/layout.tsx", "utf8");
  assert.match(layout, /colorScheme:\s*"only light"/);
  assert.match(layout, /\(prefers-color-scheme: dark\)[^\n]*#FDF8F2/);
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
