import { test, expect, type Page } from "@playwright/test";

// Fit the existing desktop hero in the viewport; the cold-phone case below
// independently uses 390×844. Below-fold is not the same as animation-blocked.
test.use({ viewport: { width: 1440, height: 1200 } });

type OpeningFrame = {
  time: number;
  settled: boolean;
  targets: { name: string; opacity: number; hit: boolean; x: number; y: number; width: number; height: number }[];
  image: { width: number; height: number; position: string };
};
type OpeningProbe = {
  frames: OpeningFrame[];
  shifts: number[];
  errors: string[];
};

declare global {
  interface Window {
    heroOpeningProbe: Promise<OpeningProbe>;
    heroTestClicks: { href: string; trusted: boolean; time: number }[];
  }
}

/** Starts before hydration, and samples every painted frame, not networkidle. */
async function observeOpening(page: Page) {
  await page.addInitScript(() => {
    const frames: OpeningFrame[] = [];
    const shifts: number[] = [];
    const errors: string[] = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!shift.hadRecentInput) shifts.push(shift.value);
      }
    }).observe({ type: "layout-shift", buffered: true });
    window.addEventListener("error", (event) => errors.push(event.message));
    let start: number | undefined;
    let alignedToPaint = false;
    window.heroOpeningProbe = new Promise((resolve) => {
      const sample = (now: number) => {
        const root = document.querySelector("#top");
        const image = root?.querySelector<HTMLImageElement>('img[src*="hero-sanctuary"]');
        if (root && image && image.clientWidth) {
          start ??= now;
          // rAF can run while the first paint is still font/render-blocked.
          // CSS animation startTime is the actual painted sequence's clock.
          const arrival = root.querySelector('[data-hero-arrival="actions"]')?.getAnimations()[0];
          if (!alignedToPaint && typeof arrival?.startTime === "number") {
            start = arrival.startTime;
            alignedToPaint = true;
          }
          const targets = ['a[href*="appointment-request"]', 'a[href="/about"]', "[data-hero-call]"].map((selector) => {
            const element = root.querySelector<HTMLAnchorElement>(selector)!;
            const rect = element.getBoundingClientRect();
            let opacity = 1;
            for (let node: Element | null = element; node; node = node.parentElement) {
              opacity *= Number(getComputedStyle(node).opacity);
            }
            // Check the label and all four inset corners, including the arrow.
            // A floating call chip must not partly cover the secondary action.
            const hit = [[rect.width / 2, rect.height / 2], [10, 10], [rect.width - 10, 10], [10, rect.height - 10], [rect.width - 10, rect.height - 10]].every(([x, y]) => {
              const target = document.elementFromPoint(rect.x + x, rect.y + y);
              return !!target && element.contains(target);
            });
            return { name: selector, opacity, hit, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
          });
          const settled = [...root.querySelectorAll("[data-hero-arrival]")].every((element) => {
            const style = getComputedStyle(element);
            return style.opacity === "1" && style.transform === "none" && style.filter === "none";
          });
          const rect = image.getBoundingClientRect();
          frames.push({ time: now - start, settled, targets, image: { width: rect.width, height: rect.height, position: getComputedStyle(image).objectPosition } });
        }
        if (start !== undefined && now - start > 1700) resolve({ frames, shifts, errors });
        else requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
  });
}

function expectAvailableAndStable({ frames, errors }: OpeningProbe) {
  expect(errors).toEqual([]);
  expect(frames.length).toBeGreaterThan(8);
  for (const frame of frames) {
    for (const target of frame.targets) {
      expect(target.opacity, `${target.name} opacity at ${frame.time}ms`).toBeGreaterThanOrEqual(0.95);
      expect(target.hit, `${target.name} hit-test at ${frame.time}ms`).toBe(true);
      const first = frames[0].targets.find((item) => item.name === target.name)!;
      expect(Math.abs(target.x - first.x)).toBeLessThan(0.5);
      expect(Math.abs(target.y - first.y)).toBeLessThan(0.5);
      expect(Math.abs(target.width - first.width)).toBeLessThan(0.5);
      expect(Math.abs(target.height - first.height)).toBeLessThan(0.5);
    }
  }
  expect(frames.filter((frame) => frame.time >= 1500).every((frame) => frame.settled)).toBe(true);
}

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`hero settles without moving or hiding actions: ${reducedMotion}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion });
    await observeOpening(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const probe = await page.evaluate(() => window.heroOpeningProbe);
    await testInfo.attach("hero-painted-frames", { body: JSON.stringify(probe, null, 2), contentType: "application/json" });
    expectAvailableAndStable(probe);
    if (reducedMotion === "reduce") expect(probe.frames.every((frame) => frame.settled)).toBe(true);
    else expect(probe.frames.some((frame) => !frame.settled)).toBe(true);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}

test("cold mid-range mobile: no CLS, stationary portrait, actions available throughout", async ({ browser }, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    reducedMotion: "no-preference", baseURL: testInfo.project.use.baseURL,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false, latency: 150, downloadThroughput: 1_600_000 / 8,
    uploadThroughput: 750_000 / 8, connectionType: "cellular4g",
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await observeOpening(page);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const probe = await page.evaluate(() => window.heroOpeningProbe);
  await testInfo.attach("throttled-mobile-hero", { body: JSON.stringify({ profile: "390×844 / DPR 2 / CPU 4× / 1.6Mbps down / 750Kbps up / 150ms RTT / cold cache", ...probe }, null, 2), contentType: "application/json" });
  expectAvailableAndStable(probe);
  expect(probe.shifts.reduce((sum, value) => sum + value, 0), "Cold-load CLS including fonts").toBe(0);
  const widths = probe.frames.map((frame) => frame.image.width);
  const heights = probe.frames.map((frame) => frame.image.height);
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(0.5);
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(0.5);
  expect(probe.frames.every((frame) => frame.image.position === "54% 62%")).toBe(true);
  await context.close();
});

test("real call and enquiry clicks work at every controlled animation checkpoint", async ({ page }) => {
  await page.addInitScript(() => {
    window.heroTestClicks = [];
    // Pause the real CSS timelines before first paint, so slow CI round trips
    // cannot silently move an "early" click beyond the entire opening.
    const hold = new MutationObserver(() => {
      if (!document.head) return;
      const style = document.createElement("style");
      style.textContent = "#top [data-hero-arrival] { animation-play-state: paused !important; }";
      document.head.append(style);
      hold.disconnect();
    });
    hold.observe(document, { childList: true, subtree: true });
    // Prevent actual navigation / dialling only after capturing a trusted click.
    // The separate navigation test below exercises the unmodified booking link.
    document.addEventListener("click", (event) => {
      const target = (event.target as Element).closest<HTMLAnchorElement>('#top a[href*="appointment-request"], #top [data-hero-call]');
      if (!target) return;
      window.heroTestClicks.push({ href: target.getAttribute("href")!, trusted: event.isTrusted, time: performance.now() });
      event.preventDefault();
    }, true);
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  for (const checkpoint of [0, 250, 600, 1000, 1400]) {
    await page.evaluate((time) => {
      (document.activeElement as HTMLElement)?.blur();
      for (const element of document.querySelectorAll("#top [data-hero-arrival]")) {
        for (const animation of element.getAnimations()) animation.currentTime = time;
      }
    }, checkpoint);
    for (const selector of ['#top a[href*="appointment-request"]', "#top [data-hero-call]"]) {
      const box = await page.locator(selector).boundingBox();
      expect(box).not.toBeNull();
      await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    }
  }
  const clicks = await page.evaluate(() => window.heroTestClicks);
  expect(clicks).toHaveLength(10);
  expect(clicks.every((click) => click.trusted)).toBe(true);
  expect(clicks.filter((click) => click.href === "/contact#appointment-request")).toHaveLength(5);
  expect(clicks.filter((click) => click.href.startsWith("tel:"))).toHaveLength(5);
});

test("enquiry navigation is not held for the hero animation", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator('#top a[href*="appointment-request"]').click();
  await expect(page).toHaveURL(/\/contact#appointment-request$/);
});

test("Home re-entry has no obscuring curtain and does not replay the portrait zoom", async ({ page }) => {
  await observeOpening(page);
  await page.goto("/about", { waitUntil: "networkidle" });
  await page.locator('header a.group[href="/"]').click();
  const probe = await page.evaluate(() => window.heroOpeningProbe);
  expectAvailableAndStable(probe);
  await expect(page.locator(".fixed.inset-0.z-\\[80\\]")).toHaveCount(0);
});

test("reduced motion is final even when hydration scripts are blocked", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/_next/static/chunks/*.js", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  for (const part of await page.locator("#top [data-hero-arrival]").all()) {
    await expect(part).toHaveCSS("opacity", "1");
    await expect(part).toHaveCSS("transform", "none");
    await expect(part).toHaveCSS("filter", "none");
  }
  await expect(page.locator('#top a[href*="appointment-request"]')).toBeVisible();
  await expect(page.locator("#top [data-hero-call]")).toBeVisible();
});

test("hero parallax and repeating decoration stop working offscreen", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
  await expect(page.locator("#top")).toHaveAttribute("data-hero-active", "false");
  const image = page.locator("[data-hero-image-layer]");
  const transform = await image.evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollTo({ top: 3200, behavior: "instant" }));
  await page.waitForTimeout(300);
  await expect(image).toHaveCSS("transform", transform);
  const running = await page.locator("#top").evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length);
  expect(running).toBe(0);
});
