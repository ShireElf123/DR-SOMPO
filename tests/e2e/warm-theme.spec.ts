import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Acceptance checks for the rosewater palette: blush/rose surfaces with peach
 * charcoal type on the light bands, cream type on the two deep ones, no cool
 * hue anywhere, and the accessibility behaviour the reference site loses in
 * dark mode.
 *
 * Tonal depth is deliberate: the announcement strip and the footer are warm
 * near-black (espresso) and the bento statement panel matches them, so the page
 * has a value range instead of sitting entirely above L 40. The rules below keep
 * that depth bounded — one deep section-level surface, always warm, always cream
 * type, always AA.
 */

const CREAM = "rgb(255, 251, 252)";

test("the warm palette replaces the old forest tokens end to end", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const read = (name: string) => style.getPropertyValue(name).trim().toLowerCase();
    return {
      forest: read("--color-forest"),
      ember: read("--color-ember"),
      cream: read("--color-cream"),
      body: getComputedStyle(document.body).backgroundColor,
    };
  });
  expect(tokens.forest).toBe("");
  expect(tokens.ember).toBe("#e8678c");
  expect(tokens.cream).toBe("#fffbfc");
  expect(tokens.body).toBe(CREAM);
});

test("depth is warm, bounded and always carries cream type", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const panels = await page.evaluate(() => {
    const luminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const parse = (colour: string) => (colour.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
    const firstStop = (image: string) => {
      const match = image.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
    };
    return [...document.querySelectorAll("main section, footer")].map((element) => {
      const style = getComputedStyle(element);
      const painted = style.backgroundColor !== "rgba(0, 0, 0, 0)";
      const stop = painted ? parse(style.backgroundColor) : firstStop(style.backgroundImage);
      return {
        background: painted ? style.backgroundColor : style.backgroundImage.slice(0, 24),
        gradient: style.backgroundImage,
        painted: Boolean(stop),
        luminance: stop ? luminance(stop) : 1,
        warm: style.backgroundColor.match(/rgba?\((\d+), (\d+), (\d+)/)
          ? (() => {
              const [r, , b] = parse(style.backgroundColor);
              return r >= b;
            })()
          : true,
        type: getComputedStyle(element).color,
      };
    });
  });
  const deep = panels.filter((panel) => panel.painted && panel.luminance < 0.35);
  for (const panel of panels) {
    if (panel.painted) expect(panel.warm, `cool surface painted ${panel.background}`).toBe(true);
    // Nothing paints white type behind a gradient wash.
    expect(panel.type).not.toBe("rgb(255, 255, 255)");
  }
  // Exactly one section-level surface is allowed to go deep on a page; everything
  // else stays light so the depth reads as an ending, not as a theme.
  expect(deep.length, `deep sections: ${deep.map((panel) => panel.background).join(", ")}`).toBe(1);

  const footer = await page.evaluate(() => {
    const element = document.querySelector("footer")!;
    const ink = getComputedStyle(element).color;
    const surface = getComputedStyle(element).backgroundImage;
    const rgb = (ink.match(/\d+/g) ?? []).map(Number);
    const luminance = (values: number[]) =>
      values
        .slice(0, 3)
        .map((value) => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        })
        .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
    return { surface, ink, inkLuminance: luminance(rgb) };
  });
  expect(footer.surface).toContain("linear-gradient");
  // Cream, not charcoal, and light enough to clear AA on espresso (#2a1813).
  expect(footer.inkLuminance).toBeGreaterThan(0.8);
});

test("the deep bands keep their type at AA when checked as painted pixels", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  // Measure the text-dense bands, not the whole footer: the oversized wordmark
  // is a cream gradient across the full width and would dominate the modal
  // pixel, reporting a contrast the reader never sees.
  const bands = [
    { name: "footer", selector: "footer .shell", ink: "footer .shell" },
    { name: "ticker", selector: ".ticker-gradient", ink: ".ticker-gradient .marquee-track" },
  ];
  const inkOf = async (selector: string) =>
    page.locator(selector).first().evaluate((element) => getComputedStyle(element).color);
  for (const band of bands) {
    const element = page.locator(band.selector).first();
    if ((await element.count()) === 0) continue;
    const shot = await element.screenshot();
    const contrast = await page.evaluate(async (data) => {
      const { base64, ink } = data as { base64: string; ink: string };
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const counts = new Map<string, number>();
      for (let index = 0; index < pixels.length; index += 4) {
        const key = `${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      const luminance = (rgb: number[]) => {
        const [r, g, b] = rgb.map((value) => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      // Glyphs are the minority, so the mode is the band. Light fills inside the
      // band (the cream booking pill, the wordmark) are surfaces in their own
      // right and carry their own dark ink, so they are excluded from the band
      // surface — otherwise the cream pill matches the cream type and reports 1:1.
      const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
      const dark = ranked.filter(([key]) => luminance(key.split(",").map(Number)) < 0.5);
      if (dark.length === 0) {
        return 1; // nothing deep left: the band is no longer a deep band
      }
      const surface = dark[0][0];
      const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      return ratio(luminance((ink.match(/\d+/g) ?? []).map(Number)), luminance(surface.split(",").map(Number)));
    }, {
      base64: shot.toString("base64"),
      ink: await inkOf(band.ink),
    });
    expect(contrast, band.name).toBeGreaterThanOrEqual(4.5);
  }
});

test("a dark-mode preference keeps the audited light scheme and passes WCAG", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.route("**/api/enquiry", (request) => request.abort());
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme))
    .toBe("light only");
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(CREAM);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test("photograph panes stay opaque and only two surfaces are frosted", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const glass = page.locator(".glass").first();
  await expect(glass).toBeVisible();
  const pane = await glass.evaluate((element) => {
    const style = getComputedStyle(element);
    const channels = (style.backgroundColor.match(/[\d.]+/g) ?? []).map(Number);
    return { alpha: channels[3] ?? 1, blur: style.backdropFilter };
  });
  // Caption panes sit on photography, so they carry their own opacity instead
  // of relying on a blur to keep charcoal legible.
  expect(pane.alpha).toBeGreaterThanOrEqual(0.85);
  expect(pane.blur).toBe("none");

  // Blur is a deliberate accent, never the default: at most the phone hero
  // plate and the sticky bar may frost, and nothing else may carry a blur.
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const frosted = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("body *")]
        .filter((element) => {
          const style = getComputedStyle(element);
          return style.backdropFilter !== "none" && style.backdropFilter !== "";
        })
        .map((element) => element.className.toString()),
    );
    expect(frosted.length).toBeLessThanOrEqual(2);
    expect(frosted.join(" ")).toContain("frost-bar");
    for (const name of frosted) {
      expect(name).toMatch(/hero-copy-plate|frost-bar/);
    }
  }
});

test("keyboard focus is visible on warm surfaces", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null;
    if (!element) return null;
    const style = getComputedStyle(element);
    return {
      tag: element.tagName,
      text: element.textContent?.trim().slice(0, 40),
      outlineWidth: style.outlineWidth,
      outlineStyle: style.outlineStyle,
      outlineColor: style.outlineColor,
      offset: style.outlineOffset,
    };
  });
  expect(focus).not.toBeNull();
  expect(focus!.text?.length).toBeGreaterThan(0);
  expect(focus!.outlineStyle).not.toBe("none");
  expect(parseFloat(focus!.outlineWidth)).toBeGreaterThanOrEqual(2);
  expect(focus!.outlineColor).toBe("rgb(43, 31, 36)");
});

test("reduced motion removes the springs instead of slowing them", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const motion = await page.evaluate(() => {
    const button = document.querySelector(".btn") as HTMLElement;
    const card = document.querySelector(".journey-card") as HTMLElement;
    const style = getComputedStyle(button);
    return {
      duration: style.transitionDuration,
      delay: style.transitionDelay,
      cardDuration: card ? getComputedStyle(card).transitionDuration : null,
      grain: getComputedStyle(document.body, "::after").display,
    };
  });
  const inMilliseconds = (value: string) =>
    value.endsWith("ms") ? parseFloat(value) : parseFloat(value) * 1000;
  expect(inMilliseconds(motion.duration)).toBeLessThanOrEqual(0.01);
  expect(motion.delay.split(",").every((value) => value.trim() === "0s")).toBe(true);
  if (motion.cardDuration) expect(inMilliseconds(motion.cardDuration)).toBeLessThanOrEqual(0.01);
  expect(motion.grain).toBe("none");
});

for (const width of [320, 390]) {
  test(`the warm hero reads at ${width}px and keeps the portrait visible`, async ({ page }) => {
    await page.setViewportSize({ width, height: 780 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    const layout = await page.evaluate(() => {
      const hero = document.querySelector("#top .sun-gradient") as HTMLElement;
      const plate = document.querySelector(".hero-copy-plate") as HTMLElement;
      const photo = document.querySelector<HTMLImageElement>('#top img[src*="hero-doctor"]')!;
      const support = document.querySelector(".hero-support") as HTMLElement;
      const p = plate.getBoundingClientRect();
      const i = photo.getBoundingClientRect();
      const overlap =
        Math.max(0, Math.min(p.right, i.right) - Math.max(p.left, i.left)) *
        Math.max(0, Math.min(p.bottom, i.bottom) - Math.max(p.top, i.top));
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        heroHeight: hero?.getBoundingClientRect().height ?? 0,
        photoHeight: i.height,
        photoCoveredByCopy: overlap / (i.width * i.height),
        copyWash: getComputedStyle(plate).backgroundImage,
        copyBlur: getComputedStyle(plate).backdropFilter,
        supportColor: support ? getComputedStyle(support).color : null,
        supportSize: support ? parseFloat(getComputedStyle(support).fontSize) : 0,
      };
    });
    expect(layout.overflow).toBeLessThanOrEqual(1);
    expect(layout.heroHeight).toBeGreaterThan(320);
    // The phone photographs are the point of the hero: the copy must never sit
    // on top of the portrait (it used to cover ~90% of it behind an 84% plate).
    expect(layout.photoHeight).toBeGreaterThan(160);
    expect(layout.photoCoveredByCopy).toBeLessThan(0.02);
    // The copy runs on a cream wash in normal flow, with no second frosted pane.
    expect(layout.copyWash).toContain("linear-gradient");
    expect(layout.copyWash).toContain("rgb(255, 251, 252)");
    expect(layout.copyBlur).toBe("none");
    expect(layout.supportColor).toBe("rgb(43, 31, 36)");
    expect(layout.supportSize).toBeGreaterThanOrEqual(14);
  });
}

test("the oversized footer wordmark still wipes in on scroll", async ({ page }) => {
  // Regression guard: a self-clipped whileInView target never intersects, so
  // the wipe used to stall at its initial state and leave the footer empty.
  await page.goto("/", { waitUntil: "networkidle" });
  const wordmark = page.locator("footer > div:last-child p");
  await wordmark.scrollIntoViewIfNeeded();
  await expect
    .poll(async () => wordmark.evaluate((element) => getComputedStyle(element).clipPath))
    .not.toContain("100%");
});
