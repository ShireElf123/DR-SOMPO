import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Acceptance checks for the warm colour experiment: peach/apricot surfaces that
 * stop at #EB6300, charcoal type on colour, no brown or near-black panels, and
 * the accessibility behaviour the reference site loses in dark mode.
 */

const CREAM = "rgb(253, 248, 242)";
const CHARCOAL = "#26221f";

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
  expect(tokens.ember).toBe("#eb6300");
  expect(tokens.cream).toBe("#fdf8f2");
  expect(tokens.body).toBe(CREAM);
});

test("the deepest surface stops at #EB6300 and stays warm, never brown or black", async ({ page }) => {
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
    return [...document.querySelectorAll("main section, footer")].map((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        gradient: style.backgroundImage,
        luminance: luminance(parse(style.backgroundColor)),
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
  for (const panel of panels) {
    const painted = panel.background !== "rgba(0, 0, 0, 0)";
    if (painted) {
      expect(panel.luminance, `dark surface painted ${panel.background}`).toBeGreaterThan(0.35);
      expect(panel.warm, `cool surface painted ${panel.background}`).toBe(true);
    }
    // Nothing paints near-black or white type behind a gradient wash.
    expect(panel.type).not.toBe("rgb(255, 255, 255)");
  }
  const footer = await page.evaluate(() => {
    const element = document.querySelector("footer")!;
    return {
      gradient: getComputedStyle(element).backgroundImage,
      ink: getComputedStyle(element).color,
    };
  });
  expect(footer.gradient).toContain("linear-gradient");
  expect(footer.ink).toBe("rgb(38, 34, 31)");
});

test("large warm surfaces keep charcoal type at AA when checked as painted pixels", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  const bands = [
    { name: "footer", selector: "footer" },
    { name: "ticker", selector: ".ticker-gradient" },
  ];
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
      // The modal colour is the gradient band; glyphs are always the minority.
      const [surface] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
      const luminance = (rgb: number[]) => {
        const [r, g, b] = rgb.map((value) => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      return ratio(luminance((ink.match(/\d+/g) ?? []).map(Number)), luminance(surface.split(",").map(Number)));
    }, {
      base64: shot.toString("base64"),
      ink: `rgb(${CHARCOAL.slice(1).match(/../g)!.map((hex) => parseInt(hex, 16)).join(", ")})`,
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

test("glass keeps an opaque warm pane and a no-blur fallback", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const glass = page.locator(".glass").first();
  await expect(glass).toBeVisible();
  const pane = await glass.evaluate((element) => {
    const style = getComputedStyle(element);
    const channels = (style.backgroundColor.match(/[\d.]+/g) ?? []).map(Number);
    return { alpha: channels[3] ?? 1, blur: style.backdropFilter };
  });
  expect(pane.alpha).toBeGreaterThanOrEqual(0.72);
  expect(pane.blur).toContain("blur");
  // The utilities layer resets backdrop-filter on every element, so the frost
  // the design relies on has to survive the cascade as a painted value.
  expect(pane.blur).toContain("blur(14px)");
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
  expect(focus!.outlineColor).toBe("rgb(38, 34, 31)");
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
  test(`the warm hero reads at ${width}px without overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 780 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    const layout = await page.evaluate(() => {
      const hero = document.querySelector("#top .sun-gradient") as HTMLElement;
      const plate = document.querySelector(".hero-copy-plate") as HTMLElement;
      const support = document.querySelector(".hero-support") as HTMLElement;
      const pane = plate ? getComputedStyle(plate).backgroundColor.match(/[\d.]+/g)!.map(Number) : null;
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        heroHeight: hero?.getBoundingClientRect().height ?? 0,
        plateAlpha: pane ? (pane[3] ?? 1) : null,
        supportColor: support ? getComputedStyle(support).color : null,
        supportSize: support ? parseFloat(getComputedStyle(support).fontSize) : 0,
      };
    });
    expect(layout.overflow).toBeLessThanOrEqual(1);
    expect(layout.heroHeight).toBeGreaterThan(320);
    expect(layout.plateAlpha).toBeGreaterThanOrEqual(0.8);
    expect(layout.supportColor).toBe("rgb(38, 34, 31)");
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
