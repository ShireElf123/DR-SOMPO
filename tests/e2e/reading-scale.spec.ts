import { expect, test } from "@playwright/test";

/**
 * The components were drawn on a 1440 canvas with 10-12px labels — and then used
 * those same classes for whole paragraphs, service lists and the safety
 * disclaimers. Measured over seven routes, 59% of the site's characters rendered
 * at 10-12px. These checks keep the reading scale honest on a desktop.
 */

const routes = ["/", "/services", "/services/antenatal", "/about", "/research", "/patient-info", "/contact"];

type Run = { size: number; chars: number; text: string };

const measure = async (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const runs: Run[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set<Element>();
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent?.trim() ?? "";
      if (text.length < 3) continue;
      const element = node.parentElement;
      if (!element || seen.has(element)) continue;
      seen.add(element);
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const box = element.getBoundingClientRect();
      if (box.width < 8 || box.height < 4) continue;
      runs.push({ size: Number.parseFloat(style.fontSize), chars: text.length, text: text.slice(0, 48) });
    }
    const totalChars = runs.reduce((sum, run) => sum + run.chars, 0);
    const weighted = runs.reduce((sum, run) => sum + run.size * run.chars, 0) / Math.max(1, totalChars);
    return {
      runs,
      weightedMean: weighted,
      longRunsBelow13: runs.filter((run) => run.chars >= 60 && run.size < 13),
      bodyShares: runs.filter((run) => run.chars >= 60 && run.size >= 20).length,
      shell: document.querySelector(".shell")?.getBoundingClientRect().width ?? 0,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

for (const width of [1280, 1440, 1920]) {
  test(`desktop reading scale holds at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(route, { waitUntil: "networkidle" });
      const result = await measure(page);

      // Nothing that reads as a sentence is set smaller than 13px.
      expect(
        result.longRunsBelow13.map((run) => `${run.size}px "${run.text}"`),
        `${route} at ${width}px`,
      ).toEqual([]);

      // Character-weighted mean lands on the reading scale, not on captions.
      expect(result.weightedMean, `${route} at ${width}px mean size`).toBeGreaterThanOrEqual(13.8);

      expect(result.overflow, `${route} at ${width}px overflow`).toBeLessThanOrEqual(1);
    }
  });
}

test("large monitors get a wider column instead of a floating island", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/", { waitUntil: "networkidle" });
  const wide = await measure(page);
  expect(wide.shell).toBeGreaterThanOrEqual(1300);

  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  const standard = await measure(page);
  expect(standard.shell).toBeLessThanOrEqual(1210);
});

test("the hero copy sits on its own wash, not straight on the photograph", async ({ page }) => {
  // 640-1023 used to put the copy column on her coat: the darkest tenth of the
  // reading column measured 2.0-4.5:1. The wash has to keep it above AA.
  for (const width of [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const lines = await page.evaluate(() => {
      const paragraph = [...document.querySelectorAll("p")].find((element) =>
        element.textContent?.includes("Your health deserves"),
      );
      if (!paragraph) return [];
      const range = document.createRange();
      range.selectNodeContents(paragraph);
      return [...range.getClientRects()].map((rect) => ({ x: rect.x, y: rect.y, width: rect.width }));
    });
    expect(lines.length).toBeGreaterThan(2);

    for (const line of lines) {
      const shot = await page.screenshot({
        clip: { x: Math.round(line.x), y: Math.round(line.y - 3), width: Math.round(line.width), height: 2 },
      });
      const contrast = await page.evaluate(async (base64) => {
        const image = new Image();
        image.src = `data:image/png;base64,${base64}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d")!;
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const lin = (value: number) => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        };
        const luminance = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
        const ink = luminance(38, 34, 31);
        const ratios: number[] = [];
        for (let index = 0; index < pixels.length; index += 4) {
          const surface = luminance(pixels[index], pixels[index + 1], pixels[index + 2]);
          ratios.push((Math.max(ink, surface) + 0.05) / (Math.min(ink, surface) + 0.05));
        }
        ratios.sort((a, b) => a - b);
        return ratios[Math.floor(ratios.length * 0.1)];
      }, shot.toString("base64"));
      expect(contrast, `hero copy background at ${width}px`).toBeGreaterThanOrEqual(4.5);
    }
  }
});
