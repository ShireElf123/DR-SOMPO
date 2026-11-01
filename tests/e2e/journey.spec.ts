import { test, expect, type Page } from "@playwright/test";
import { journey } from "../../lib/practice";

async function entryAt(page: Page, fraction: number) {
  await page.evaluate((position) => {
    const box = document.querySelector(".journey-list")!.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + box.top - window.innerHeight + box.height * position, behavior: "instant" });
  }, fraction);
  // Native scroll timelines are sampled in the browser's rendering lifecycle.
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

async function state(page: Page) {
  return page.locator("#journey").evaluate((root) => ({
    steps: [...root.querySelectorAll(".journey-step-reveal")].map((node) => {
      const style = getComputedStyle(node);
      return { opacity: Number(style.opacity), y: new DOMMatrixReadOnly(style.transform).m42 };
    }),
    lines: [...root.querySelectorAll(".journey-connector")].map((node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).a),
    animations: root.getAnimations({ subtree: true }).map((animation) => ({
      state: animation.playState,
      properties: [...new Set((animation.effect as KeyframeEffect).getKeyframes().flatMap((frame) => Object.keys(frame)))],
    })),
  }));
}

async function expectFinal(page: Page, staticOnly = false) {
  const result = await state(page);
  expect(result.steps).toHaveLength(3);
  expect(result.lines).toHaveLength(2);
  for (const step of result.steps) {
    expect(step.opacity).toBe(1);
    expect(step.y).toBe(0);
  }
  for (const line of result.lines) expect(line).toBe(1);
  if (staticOnly) expect(result.animations).toEqual([]);
  return result;
}

test("desktop connector draws and the three steps enter in order", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => CSS.supports("animation-timeline: view()"))).toBe(true);
  const before = await state(page);
  expect(before.steps.map((step) => step.opacity)).toEqual([0, 0, 0]);
  expect(before.lines).toEqual([0, 0]);

  await entryAt(page, 0.2);
  const entering = await state(page);
  expect(entering.steps[0].opacity).toBeGreaterThan(entering.steps[1].opacity);
  expect(entering.steps[1].opacity).toBeGreaterThan(entering.steps[2].opacity);
  expect(entering.steps[2].opacity).toBe(0);
  expect(entering.lines[0]).toBeGreaterThan(0);
  expect(entering.lines[0]).toBeLessThan(1);
  expect(entering.lines[1]).toBeLessThan(entering.lines[0]);
  for (const animation of entering.animations) {
    expect(animation.properties.filter((key) => !["offset", "computedOffset", "easing", "composite", "opacity", "transform"].includes(key))).toEqual([]);
  }

  await entryAt(page, 1);
  const finished = await expectFinal(page);
  for (const step of journey) {
    const card = page.getByRole("article", { name: step.title, exact: true });
    await expect(card).toContainText(step.body);
    await expect(card).toContainText(step.meta);
  }
  await page.locator("#journey").screenshot({ path: testInfo.outputPath("journey-desktop.png") });
  // No exit animation or background per-frame JS: the completed CSS effect
  // stays finished and unchanged even far beyond the section's entry range.
  await page.locator("footer").scrollIntoViewIfNeeded();
  const offscreen = await expectFinal(page);
  expect(offscreen.animations.every((animation) => animation.state === "finished")).toBe(true);
  await testInfo.attach("journey-entry", { body: JSON.stringify({ before, entering, finished, offscreen }, null, 2), contentType: "application/json" });
});

test("keyboard readers get the full journey immediately and clear focus on each article", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const cards = page.locator(".journey-card");
  await cards.first().focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  for (let index = 0; index < 3; index++) {
    const card = cards.nth(index);
    await expect(card).toBeFocused();
    expect(await card.evaluate((node) => node.matches(":focus-visible"))).toBe(true);
    await expect(card).toHaveCSS("outline-width", "2px");
    await expect(card).toHaveCSS("outline-style", "solid");
    await expect(card).toHaveAccessibleName(journey[index].title);
    await expectFinal(page);
    await expect(card.locator('button, a, [role="button"]')).toHaveCount(0);
    await page.keyboard.press("Tab");
  }
  expect(await cards.evaluateAll((nodes) => nodes.includes(document.activeElement as HTMLElement))).toBe(false);
});

test("desktop hover responds without altering card layout or animating paint properties", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await entryAt(page, 1);
  const card = page.locator(".journey-card").first();
  const before = await card.boundingBox();
  await card.hover();
  await expect.poll(() => card.evaluate((node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m42)).toBe(-4);
  const after = await card.boundingBox();
  expect(after!.width).toBe(before!.width);
  expect(after!.height).toBe(before!.height);
  await expect(card).toHaveCSS("transition-property", "transform");
  await expect(card.locator("img")).toHaveCSS("transition-property", "transform");
});

for (const profile of [
  { name: "reduced desktop", width: 1440, touch: false, reduce: true },
  { name: "touch phone", width: 390, touch: true, reduce: false },
  { name: "reduced touch phone", width: 390, touch: true, reduce: true },
  { name: "wide touch device", width: 1024, touch: true, reduce: false },
]) {
  test(`${profile.name}: the entire journey is static before, during and after entry`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({
      baseURL: testInfo.project.use.baseURL,
      viewport: { width: profile.width, height: 844 },
      hasTouch: profile.touch, isMobile: profile.touch, deviceScaleFactor: profile.touch ? 2 : 1,
      reducedMotion: profile.reduce ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
    await expectFinal(page, true);
    for (const fraction of [0.2, 0.6, 1]) {
      await entryAt(page, fraction);
      await expectFinal(page, true);
    }
    if (profile.name === "touch phone") await page.locator("#journey").screenshot({ path: testInfo.outputPath("journey-mobile.png") });
    const card = page.locator(".journey-card").first();
    await card.focus();
    await expect(card).toHaveCSS("transform", "none");
    await expect(card.locator("img")).toHaveCSS("transform", "none");
    await expectFinal(page, true);
    await expect(card).toHaveCSS("outline-width", "2px");
    await context.close();
  });
}

test("switching to reduced motion during entry immediately completes everything", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await entryAt(page, 0.2);
  expect((await state(page)).steps[2].opacity).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expectFinal(page, true);
});

test("static fallback stays complete when scroll-timeline enhancement is absent", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  // Drop only the @supports enhancement, exactly as an unsupported browser
  // would. This is a fallback-style check, not a claim of testing that browser.
  await page.evaluate(() => {
    const removeEnhancement = (sheet: CSSStyleSheet | CSSGroupingRule) => {
      for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
        const rule = sheet.cssRules[i];
        if (rule instanceof CSSSupportsRule && rule.conditionText.includes("animation-timeline")) sheet.deleteRule(i);
        else if (rule instanceof CSSGroupingRule) removeEnhancement(rule);
      }
    };
    for (const sheet of document.styleSheets) removeEnhancement(sheet);
  });
  await expectFinal(page, true);
  await entryAt(page, 0.2);
  await expectFinal(page, true);
});

test("future wide and tall photographs cannot resize the journey cards", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const cards = page.locator(".journey-card");
  await cards.first().scrollIntoViewIfNeeded();
  const before = await cards.evaluateAll((nodes) => nodes.map((node) => ({ width: node.clientWidth, height: node.clientHeight })));
  for (const [width, height] of [[40, 400], [400, 40]]) {
    await cards.locator("img").evaluateAll(async (images, size) => {
      await Promise.all(images.map(async (element) => {
        const image = element as HTMLImageElement;
        image.removeAttribute("srcset");
        image.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size[0]}" height="${size[1]}"><rect width="100%" height="100%" fill="#dcebe1"/></svg>`)}`;
        await image.decode();
      }));
    }, [width, height]);
    expect(await cards.evaluateAll((nodes) => nodes.map((node) => ({ width: node.clientWidth, height: node.clientHeight })))).toEqual(before);
  }
});
