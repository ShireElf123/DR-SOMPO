import { test as base, expect, devices, type Page } from "@playwright/test";

type HeroFrame = {
  width: number;
  height: number;
  layoutWidth: number;
  scale: number;
  source: string;
  objectPosition: string;
};
type HeroProbe = { mounts: number; frames: HeroFrame[] };

declare global {
  interface Window {
    heroReturnProbe: Promise<HeroProbe>;
  }
}

const test = base.extend<{ runtimeErrors: string[] }>({
  runtimeErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await use(errors);
    expect(errors, "No hydration or navigation errors").toEqual([]);
  }, { auto: true }],
});

/** Watch the actual entrance frames, not just the settled page after navigation. */
async function recordHomeEntrance(page: Page) {
  await page.evaluate(() => {
    const nodes = new Set<Element>();
    const frames: HeroFrame[] = [];
    let firstFrame: number | undefined;
    window.heroReturnProbe = new Promise<HeroProbe>((resolve) => {
      const sample = (time: number) => {
        const hero = document.querySelector("#top .fig-gradient");
        const image = hero && [...hero.querySelectorAll("img")].find((element) =>
          element.src.includes("hero-doctor") && element.getBoundingClientRect().width > 0,
        );
        if (hero && image) {
          firstFrame ??= time;
          nodes.add(hero);
          const rect = image.getBoundingClientRect();
          const style = getComputedStyle(image);
          frames.push({
            width: rect.width,
            height: rect.height,
            layoutWidth: image.clientWidth,
            scale: new DOMMatrixReadOnly(getComputedStyle(hero).transform).a,
            source: image.currentSrc,
            objectPosition: style.objectPosition,
          });
        }
        // The old bug restarted the 1.4s entrance after a ~0.7s exit.
        // Observe longer than both animations, including their initial delay.
        if (firstFrame !== undefined && time - firstFrame >= 2600) {
          resolve({ mounts: nodes.size, frames });
        } else {
          requestAnimationFrame(sample);
        }
      };
      requestAnimationFrame(sample);
    });
  });
}

async function expectStableMobileEntrance(page: Page) {
  await expect(page).toHaveURL(/\/$/);
  const { mounts, frames } = await page.evaluate(() => window.heroReturnProbe);
  expect(frames.length).toBeGreaterThan(5);
  expect(mounts, "Home must not mount inside both departing and incoming wrappers").toBe(1);
  const widths = frames.map((frame) => frame.width);
  const heights = frames.map((frame) => frame.height);
  expect(Math.max(...widths) - Math.min(...widths), "The portrait must not zoom during entry").toBeLessThan(0.5);
  expect(Math.max(...heights) - Math.min(...heights), "The portrait crop must remain stable").toBeLessThan(0.5);
  for (const frame of frames) {
    expect(frame.scale).toBeCloseTo(1, 4);
    expect(frame.width).toBeCloseTo(frame.layoutWidth, 0);
    expect(frame.objectPosition).toBe("62% 18%");
  }
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator("#top h1")).toBeVisible();
}

const { defaultBrowserType: _browser, ...phone } = devices["iPhone 13"];

test.describe("mobile home re-entry", () => {
  test.use(phone);

  for (const scenario of [
    { from: "/services", via: "logo", width: 390, scroll: 0 },
    { from: "/about", via: "menu", width: 390, scroll: 1300 },
    { from: "/contact", via: "logo", width: 360, scroll: 0 },
    { from: "/research", via: "menu", width: 414, scroll: 900 },
    { from: "/patient-info", via: "logo", width: 375, scroll: 0 },
  ]) {
    test(`steady portrait from ${scenario.from} via ${scenario.via} at ${scenario.width}px`, async ({ page }) => {
      await page.setViewportSize({ width: scenario.width, height: 844 });
      await page.goto(scenario.from, { waitUntil: "networkidle" });
      // Isolate route motion from a cold font swap on the initial document.
      await page.evaluate(() => document.fonts.ready);
      if (scenario.scroll) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), scenario.scroll);
      }
      if (scenario.via === "menu") {
        await page.getByRole("button", { name: "Open menu" }).click();
        await expect(page.getByRole("dialog")).toBeVisible();
      }
      await recordHomeEntrance(page);
      if (scenario.via === "menu") {
        await page.getByRole("dialog").getByRole("link", { name: "Home", exact: true }).click();
      } else {
        await page.locator("header a.group[href='/']").click();
      }
      await expectStableMobileEntrance(page);
    });
  }

  test("browser Back also returns to one stable home portrait", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Services", exact: true }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await recordHomeEntrance(page);
    await page.goBack();
    await expectStableMobileEntrance(page);
  });
});

test("desktop return mounts once and retains the photo's scroll parallax", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await recordHomeEntrance(page);
  await page.locator("header a.group[href='/']").click();
  await expect(page).toHaveURL(/\/$/);
  const { mounts, frames } = await page.evaluate(() => window.heroReturnProbe);
  expect(mounts).toBe(1);
  expect(frames.length).toBeGreaterThan(5);
  const imageLayer = page.locator("#top [data-hero-image-layer]");
  await page.mouse.wheel(0, 350);
  await expect.poll(() => imageLayer.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThan(1);
});
