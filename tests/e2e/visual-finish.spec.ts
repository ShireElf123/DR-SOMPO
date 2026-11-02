import { test, expect } from "@playwright/test";

const gradients = [".fig-gradient", ".forest-gradient", ".ticker-gradient"];

test("large colour washes opt into OKLab and retain working sRGB fallbacks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  for (const selector of gradients) {
    await expect(page.locator(selector).first()).toHaveCSS("background-image", /in oklab/);
  }
  // Simulate only this @supports condition being unsupported. Other gradient
  // utilities and photo scrims are deliberately not removed or rewritten.
  await page.evaluate(() => {
    const removeEnhancement = (sheet: CSSStyleSheet | CSSGroupingRule) => {
      for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
        const rule = sheet.cssRules[i];
        if (rule instanceof CSSSupportsRule && rule.conditionText.includes("linear-gradient") && rule.conditionText.includes("in oklab")) sheet.deleteRule(i);
        else if (rule instanceof CSSGroupingRule) removeEnhancement(rule);
      }
    };
    for (const sheet of document.styleSheets) removeEnhancement(sheet);
  });
  for (const selector of gradients) {
    const background = await page.locator(selector).first().evaluate((node) => getComputedStyle(node).backgroundImage);
    expect(background).toContain("linear-gradient(");
    expect(background).not.toContain("in oklab");
    expect(background).not.toBe("none");
  }
});

test("one subtle inline grain layer cannot intercept controls and disappears under reduced motion", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const grain = () => page.locator("body").evaluate((node) => {
    const style = getComputedStyle(node, "::after");
    return { opacity: Number(style.opacity), pointerEvents: style.pointerEvents, image: style.backgroundImage, display: style.display, position: style.position };
  });
  const normal = await grain();
  expect(normal.opacity).toBeGreaterThanOrEqual(0.04);
  expect(normal.opacity).toBeLessThanOrEqual(0.05);
  expect(normal.pointerEvents).toBe("none");
  expect(normal.position).toBe("fixed");
  expect(normal.image).toContain("data:image/svg+xml");
  expect(normal.image).toContain("feTurbulence");
  expect(normal.display).not.toBe("none");
  await expect(page.locator(".noise-soft")).toHaveCount(0);
  const action = page.locator('header a[href*="appointment-request"]').last();
  await action.click();
  await expect(page).toHaveURL(/\/contact#appointment-request$/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect((await grain()).display).toBe("none");
  expect((await grain()).image).toBe("none");
});

for (const density of [1, 2]) {
  test(`${density}× density uses appropriate card/FAQ/divider edges without thinning controls`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({
      baseURL: testInfo.project.use.baseURL, viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: density, reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
    const width = density === 1 ? "1px" : "0.5px";
    const nativeWidth = density === 1 ? "1px" : "0px";
    await expect(page.locator(".journey-card").first()).toHaveCSS("border-top-width", nativeWidth);
    await expect(page.locator("[data-faq-list]").first()).toHaveCSS("border-top-width", nativeWidth);
    await expect(page.locator("[data-faq-list] > li").first()).toHaveCSS("border-bottom-width", nativeWidth);
    if (density === 2) {
      expect(await page.locator(".journey-card").first().evaluate((node) => getComputedStyle(node, "::after").boxShadow)).toContain("0.5px");
      await expect(page.locator("[data-faq-list]").first()).toHaveCSS("box-shadow", /0\.5px/);
      await expect(page.locator("[data-faq-list] > li").first()).toHaveCSS("box-shadow", /-0\.5px/);
    }
    // Verify the rendered edge, not merely a declared .5px which Chromium
    // rounds up for native borders. At either density it is ONE physical pixel.
    await page.evaluate(() => {
      const sample = document.createElement("div");
      sample.id = "hairline-pixel-sample";
      sample.className = "border-hairline";
      sample.style.cssText = "position:fixed;left:400px;top:300px;width:80px;height:80px;background:white;color:black;border-color:black;border-radius:20px;--surface-stroke:black;z-index:100;overflow:hidden";
      document.body.append(sample);
    });
    const png = await page.locator("#hairline-pixel-sample").screenshot();
    const pixels = await page.evaluate(async (base64) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      return [...context.getImageData(0, image.height / 2, 2, 1).data];
    }, png.toString("base64"));
    expect(pixels).toEqual([0, 0, 0, 255, 255, 255, 255, 255]);
    await page.locator("#hairline-pixel-sample").evaluate((node) => node.remove());
    await expect(page.locator(".hairline").first()).toHaveCSS("height", width);
    // The summary's affordance and keyboard outline stay substantial.
    const summary = page.locator("[data-faq-list] summary").first();
    await expect(summary.locator("span.rounded-full")).toHaveCSS("border-top-width", "1px");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(summary.locator("..")).toHaveAttribute("open", "");
    await expect(summary).toHaveCSS("outline-width", "2px");
    // Conditional classes pass through cn(): width and colour must both
    // survive, including the existing filtered-result highlight on retina.
    await page.goto("/services", { waitUntil: "networkidle" });
    const cards = page.locator("#conditions article");
    await expect(cards).toHaveCount(5);
    await expect(cards.first()).toHaveCSS("border-top-width", nativeWidth);
    const edge = () => cards.first().evaluate((node, retina) =>
      retina ? getComputedStyle(node, "::after").boxShadow : getComputedStyle(node).borderTopColor,
    density === 2);
    expect(await edge()).toContain("/ 0.08)");
    const search = page.getByRole("searchbox", { name: "Search conditions treated" });
    await search.fill("PCOS");
    await expect(cards).toHaveCount(2);
    expect(await edge()).toContain("/ 0.2)");
    await search.clear();
    await expect(cards).toHaveCount(5);
    expect(await edge()).toContain("/ 0.08)");
    await page.goto("/about", { waitUntil: "networkidle" });
    await expect(page.locator(".divide-y-hairline > :not(:last-child)").first()).toHaveCSS("border-bottom-width", nativeWidth);
    if (density === 2) await expect(page.locator(".divide-y-hairline > :not(:last-child)").first()).toHaveCSS("box-shadow", /-0\.5px/);
    await context.close();
  });
}

for (const profile of [
  { name: "touch tablet", width: 1440, touch: true },
  { name: "small fine-pointer viewport", width: 800, touch: false },
]) {
  test(`no hidden cursor work on a ${profile.name}`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({
      baseURL: testInfo.project.use.baseURL, viewport: { width: profile.width, height: 900 },
      hasTouch: profile.touch, reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
    await page.mouse.move(300, 300);
    await expect(page.locator("[data-cursor-companion]")).toHaveCount(0);
    await context.close();
  });
}
