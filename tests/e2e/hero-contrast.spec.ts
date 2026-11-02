import { test, expect, type Page } from "@playwright/test";

/** Axe cannot resolve all layered gradient/photo backgrounds. Compare the
 * actual rendered background beneath glyphs with their declared foreground.
 * Filtering near-solid glyph pixels avoids treating font antialiasing as the
 * declared text colour. This is a targeted lab check, not WCAG certification. */
async function paintedContrast(page: Page) {
  const targets = await page.evaluate(() => {
    const area = document.querySelector("#top .fig-gradient")!.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    return [...document.querySelectorAll<HTMLElement>("#top h1>span,#top .hero-support,#top .hero-label,#top .hero-credentials>span")].map((element, index) => {
      element.dataset.contrastProbe = String(index);
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = getComputedStyle(element).color;
      context.fillRect(0, 0, 1, 1);
      const foreground = [...context.getImageData(0, 0, 1, 1).data];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const rects: { x: number; y: number; width: number; height: number }[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const range = document.createRange();
        range.selectNode(node);
        for (const rect of range.getClientRects()) rects.push({ x: rect.x - area.x, y: rect.y - area.y, width: rect.width, height: rect.height });
      }
      return { text: element.textContent!.trim(), foreground, rects, required: element.closest("h1") ? 3 : 4.5 };
    });
  });
  const visible = await page.locator("#top .fig-gradient").screenshot();
  const style = await page.addStyleTag({ content: "[data-contrast-probe],[data-contrast-probe] *{color:transparent!important}" });
  const background = await page.locator("#top .fig-gradient").screenshot();
  await style.evaluate((element) => element.parentNode?.removeChild(element));
  return page.evaluate(async ({ a, b, targets }) => {
    const pixels = async (base64: string) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      return { data: context.getImageData(0, 0, image.width, image.height).data, width: image.width, height: image.height };
    };
    const [visible, background] = await Promise.all([pixels(a), pixels(b)]);
    const luminance = (rgb: number[]) => rgb.reduce((sum, channel, index) => {
      const value = channel / 255;
      return sum + (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][index];
    }, 0);
    return targets.map((target) => {
      let samples = 0;
      let minimum = Infinity;
      for (const rect of target.rects) {
        for (let y = Math.max(0, Math.floor(rect.y)); y < Math.min(background.height, Math.ceil(rect.y + rect.height)); y++) {
          for (let x = Math.max(0, Math.floor(rect.x)); x < Math.min(background.width, Math.ceil(rect.x + rect.width)); x++) {
            const index = (y * background.width + x) * 4;
            const bg = [...background.data.slice(index, index + 3)];
            const painted = [...visible.data.slice(index, index + 3)];
            const fg = target.foreground.slice(0, 3).map((value, i) => value * target.foreground[3] / 255 + bg[i] * (1 - target.foreground[3] / 255));
            const expected = fg.reduce((sum, value, i) => sum + Math.abs(value - bg[i]), 0);
            const actual = painted.reduce((sum, value, i) => sum + Math.abs(value - bg[i]), 0);
            if (expected > 20 && actual / expected > 0.9 && actual / expected < 1.1) {
              samples++;
              const light = luminance(fg), dark = luminance(bg);
              minimum = Math.min(minimum, (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05));
            }
          }
        }
      }
      return { text: target.text, required: target.required, samples, minimum };
    });
  }, { a: visible.toString("base64"), b: background.toString("base64"), targets });
}

for (const width of [320, 390, 640, 1024, 1440]) {
  test(`painted hero text clears AA over its gradient/photo at ${width}px`, async ({ page }, testInfo) => {
    // Fit the full unchanged hero geometry; this does not change typography.
    await page.setViewportSize({ width, height: 1600 });
    await page.goto("/", { waitUntil: "networkidle" });
    const grain = await page.evaluate(() => getComputedStyle(document.body, "::after").backgroundImage);
    await page.emulateMedia({ reducedMotion: "reduce" });
    // Freeze motion for deterministic paired pixels, but keep the actual grain
    // to exercise the normal-motion surface too. No page content is changed.
    await page.addStyleTag({ content: `body::after{display:block!important;background-image:${grain}!important}` });
    await page.evaluate(() => document.fonts.ready);
    const results = await paintedContrast(page);
    await testInfo.attach("hero-painted-contrast", { body: JSON.stringify({ width, results }, null, 2), contentType: "application/json" });
    for (const result of results) {
      expect(result.samples, `Glyph samples for ${result.text}`).toBeGreaterThan(0);
      expect(result.minimum, result.text).toBeGreaterThanOrEqual(result.required);
    }
    if (width === 390 || width === 1440) await page.locator("#top").screenshot({ path: testInfo.outputPath(`hero-${width}.png`) });
  });
}
