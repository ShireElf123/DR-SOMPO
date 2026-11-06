import { test as base, expect, devices, type Locator, type Page } from "@playwright/test";
import { optionalScrollChunks } from "../../scripts/bundle-metrics.mjs";

const test = base.extend<{ runtimeErrors: string[] }>({
  runtimeErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await use(errors);
    expect(errors, "No runtime or hydration errors").toEqual([]);
  }, { auto: true }],
});
const lenisChunk = optionalScrollChunks()[0].src;

async function go(page: Page, path = "/") {
  await page.goto(path, { waitUntil: "networkidle" });
}

async function expectPainted(locator: Locator) {
  await expect(locator).toBeVisible();
  await expect.poll(() => locator.evaluate((element) => {
    for (let node: Element | null = element; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (Number(style.opacity) === 0 || style.visibility === "hidden" || style.display === "none") return false;
    }
    return true;
  })).toBe(true);
}

for (const path of ["/", "/about", "/services", "/services/antenatal", "/patient-info", "/research", "/contact"]) {
  test(`production route ${path} hydrates and stays within the viewport`, async ({ page }) => {
    await go(page, path);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expectPainted(page.locator("main h1"));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}

test("scroll-lit copy mounts paint overlays only near the viewport", async ({ page }) => {
  await go(page);
  const paragraphs = page.locator("[data-scroll-words]");
  // Anchor to the statement inside the practice bento, not the first paragraph
  // on the page: the contract under test is proximity, and the first one drifts
  // into the viewport whenever the hero is retuned.
  const target = paragraphs.nth(1);
  await expect(target.locator('[aria-hidden="true"].absolute')).toHaveCount(0);
  await target.scrollIntoViewIfNeeded();
  await expect.poll(() => target.locator('[aria-hidden="true"].absolute').count()).toBeGreaterThan(0);
  // The paint layer resolves to actual ink, rather than merely existing.
  await expect.poll(() => target.locator('[aria-hidden="true"].absolute').first().evaluate((element) => Number(getComputedStyle(element).opacity))).toBeGreaterThan(0.5);
  await page.locator("h1").scrollIntoViewIfNeeded();
  await expect(target.locator('[aria-hidden="true"].absolute')).toHaveCount(0);
  // The readable layer is the accessibility contract: with the paint copy
  // mounted, textContent concatenates each word twice, so read the words that
  // are not inside the aria-hidden overlay.
  await expect
    .poll(() =>
      paragraphs.first().evaluate((el) =>
        Array.from(el.querySelectorAll("span"))
          .filter((span) => span.children.length === 0 && !span.closest('[aria-hidden="true"]'))
          .map((span) => span.textContent)
          .join(" "),
      ),
    )
    .toContain("women's health advocate");
});

test("condition filtering, empty state and reset still work", async ({ page }) => {
  await go(page, "/services");
  const input = page.getByRole("searchbox", { name: "Search conditions treated" });
  const cards = page.locator("#conditions article");
  await expect(cards).toHaveCount(5);
  await input.fill("PCOS");
  await expect(cards).toHaveCount(2);
  await expect(page.locator("#conditions [aria-live]")).toContainText("2 conditions match PCOS");
  await input.fill("no-such-condition");
  await expect(cards).toHaveCount(0);
  await expect(page.getByText("Nothing here matches that wording", { exact: false })).toBeVisible();
  await input.clear();
  await expect(cards).toHaveCount(5);
});

test("enquiry validation does not send incomplete patient details", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/enquiry", async (route) => {
    requests += 1;
    await route.fulfill({ status: 503, json: { ok: false, error: "Please call the practice." } });
  });
  await go(page, "/contact?service=antenatal");
  await page.locator('button[type="submit"]').click();
  await expect(page.locator("#enq-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator('input[name="consent"]')).toHaveAttribute("aria-invalid", "true");
  expect(requests).toBe(0);
});

test("failed optional scroll download leaves native scrolling usable", async ({ page }) => {
  await page.route(`**${lenisChunk}`, (route) => route.abort());
  await go(page);
  await page.mouse.wheel(0, 800);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
});

test("changing reduced-motion preference tears down and restarts optional scrolling", async ({ page }) => {
  await go(page);
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("hydrates without replacement, scrolling library or animated overlays", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(new URL(request.url()).pathname));
    await go(page);
    const paragraph = page.locator("[data-scroll-words]").first();
    await paragraph.scrollIntoViewIfNeeded();
    await expectPainted(paragraph);
    await expect(paragraph.locator('[aria-hidden="true"].absolute')).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
    expect(requests).not.toContain(lenisChunk);
    expect(await page.locator(".marquee-track").first().evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
    await go(page, "/services");
    await expectPainted(page.locator("h1"));
    await page.getByRole("searchbox").fill("PCOS");
    await expect(page.locator("#conditions article")).toHaveCount(2);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const path of ["/", "/about", "/services"]) {
    test(`headings and reading copy remain painted on ${path}`, async ({ page }) => {
      await go(page, path);
      await expectPainted(page.locator("h1"));
      for (const paragraph of await page.locator("[data-scroll-words]").all()) {
        await paragraph.scrollIntoViewIfNeeded();
        await expectPainted(paragraph);
        await expect(paragraph.locator('[aria-hidden="true"].absolute')).toHaveCount(0);
      }
      await expect(page.locator('a[href="/contact"]').first()).toHaveAttribute("href", "/contact");
    });
  }
});

test("blocked script downloads never blank the server-rendered copy", async ({ page }) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await go(page);
  await expectPainted(page.locator("h1"));
  const paragraph = page.locator("[data-scroll-words]").first();
  await paragraph.scrollIntoViewIfNeeded();
  await expectPainted(paragraph);
});

test.describe("mobile menu", () => {
  const { defaultBrowserType: _browser, ...phone } = devices["iPhone 13"];
  test.use(phone);

  test("stays portalled, traps focus, restores it and never downloads Lenis", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(new URL(request.url()).pathname));
    await go(page);
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
    expect(await dialog.evaluate((element) => element.closest("header"))).toBeNull();
    const first = dialog.locator("a,button").first();
    const last = dialog.locator("a,button").last();
    await first.focus();
    await page.keyboard.press("Shift+Tab");
    await expect(last).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(first).toBeFocused();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    expect(requests).not.toContain(lenisChunk);
  });

  test("menu navigation and the return home transition remain functional", async ({ page }) => {
    await go(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Services", exact: true }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expectPainted(page.locator("h1"));
    await page.locator("header").getByRole("link", { name: "Dr Sompo", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expectPainted(page.locator("h1"));
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
});

for (const width of [360, 768, 1024]) {
  test(`home and services fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/services"]) {
      await go(page, path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), path).toBe(true);
      await expectPainted(page.locator("h1"));
    }
  });
}
