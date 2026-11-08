import { test as base, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// A separate production-build process with delivery genuinely OFF, not a
// configured form whose POST is merely mocked to fail. Never use production.
const test = base.extend<{ noDelivery: void }>({
  noDelivery: [async ({ page }, use) => {
    const errors: string[] = [];
    const submissions: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/api/enquiry", (route) => {
      submissions.push(route.request().method());
      return route.fulfill({ status: 503, json: { ok: false } });
    });
    await use();
    expect(errors, "No runtime/hydration errors").toEqual([]);
    expect(submissions, "Local planner must never try to send a draft").toEqual([]);
  }, { auto: true }],
});

test.use({ baseURL: process.env.PLAYWRIGHT_DIRECT_BASE_URL ?? "http://127.0.0.1:3012" });

async function go(page: Page, path = "/contact?service=antenatal") {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

async function expectDestination(page: Page) {
  const planner = page.locator("#appointment-request");
  await expect(planner).toBeFocused();
  await expect.poll(async () => (await planner.boundingBox())!.y).toBeGreaterThanOrEqual(0);
  await expect.poll(async () => (await planner.boundingBox())!.y).toBeLessThan(240);
}

for (const width of [320, 390, 768, 1440]) {
  test(`delivery-off calendar and full fields are usable and contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await go(page);
    const planner = page.getByRole("form", { name: "Request an appointment" });
    await expect(planner).toHaveAttribute("data-enquiry-mode", "direct");
    await expect(planner.locator("[data-date]")).toHaveCount(10);
    await expect(planner.locator("#enq-name")).toBeEnabled();
    await expect(planner.locator("#enq-service")).toHaveValue("antenatal");
    await expect(planner.locator("#enq-message")).toBeVisible();
    await expect(planner.locator('button[type="submit"]')).toHaveCount(0);
    await expect(page.locator("main form")).toHaveCount(0);
    await expect(planner.locator("[data-direct-booking-notice]")).toContainText("is not submitted");
    for (const control of await planner.locator("#enq-name, #enq-contact, #enq-service, #enq-message, #enq-other-date").all()) {
      const box = (await control.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      if (width < 1024) {
        expect(await control.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
        expect(box.height).toBeGreaterThanOrEqual(48);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.body.scrollWidth)).toBeLessThanOrEqual(width);
    const lastDay = planner.locator("[data-date]").last();
    await lastDay.click();
    await expect(lastDay).toHaveAttribute("aria-pressed", "true");
    await expect(planner.locator("#enq-other-date")).toHaveValue((await lastDay.getAttribute("data-date"))!);
  });
}

test("alternate dates, time, live summary and clear action work without sending or persisting", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await go(page);
  const name = page.locator("#enq-name");
  await name.fill("Synthetic Local Draft");
  await page.locator("#enq-message").fill("Synthetic non-clinical note");
  const date = page.locator("#enq-other-date");
  const min = (await date.getAttribute("min"))!;
  const max = (await date.getAttribute("max"))!;
  expect((Date.parse(max) - Date.parse(min)) / 86400000).toBe(90);
  await date.fill(max);
  await page.getByRole("group", { name: "Preferred time (optional)" }).getByRole("button", { name: /Late morning/ }).click();
  const summary = page.locator("[data-appointment-summary]");
  await expect(summary).toContainText("Antenatal care");
  await expect(summary).toContainText("Late morning");
  await expect(summary).toContainText("SAST");
  await expect(summary).toContainText("not a reserved appointment");
  await expect(page.locator('[data-date][aria-pressed="true"]')).toHaveCount(0);
  const clear = summary.getByRole("button", { name: "Clear date and time" });
  await clear.click();
  await expect(date).toHaveValue("");
  await expect(clear).toBeDisabled();
  await expect(page.locator('#enq-slot button[aria-pressed="true"]')).toHaveCount(0);
  await expect(summary).toContainText("Date to agree with the practice");
  await expect(name).toHaveValue("Synthetic Local Draft");
  await expect(page.locator("#enq-message")).toHaveValue("Synthetic non-clinical note");
  await name.press("Enter");
  await expect(page).toHaveURL(/contact\?service=antenatal$/);
  await expect(page.getByText("Request received", { exact: true })).toHaveCount(0);
  expect(await name.evaluate(el => (el as HTMLInputElement).form)).toBeNull();
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  const actions = page.locator("[data-direct-booking-actions]");
  await expect(actions.locator('a[href="tel:+27118427651"]')).toBeVisible();
  await expect(actions.locator('a[href="mailto:chrisscrcross2013@gmail.com"]')).toBeVisible();
  // Refresh intentionally clears the local draft; no hidden persistence.
  await page.reload({ waitUntil: "networkidle" });
  await expect(name).toHaveValue("");
});

test("out-of-range dates explain the bound instead of appearing as valid preferences", async ({ page }) => {
  await go(page);
  const date = page.locator("#enq-other-date");
  const max = (await date.getAttribute("max"))!;
  const afterMax = new Date(Date.parse(max) + 86400000).toISOString().slice(0, 10);
  await date.fill(afterMax);
  await expect(date).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#enq-date-error")).toContainText("next 90 days");
  await expect(page.locator("[data-appointment-summary]")).toContainText("Date to agree with the practice");
  await date.fill(max);
  await expect(date).toHaveAttribute("aria-invalid", "false");
  await expect(page.locator("#enq-date-error")).toHaveCount(0);
});

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`footer booking repeatedly returns to the same draft with ${reducedMotion} motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await go(page);
    await page.locator("#enq-name").fill("Footer Draft");
    const requests: string[] = [];
    page.on("request", request => { if (request.resourceType() === "document") requests.push(request.url()); });
    const book = page.locator("footer").getByRole("link", { name: "Book an appointment" });
    for (let attempt = 0; attempt < 2; attempt++) {
      await book.click();
      await expectDestination(page);
      await expect(page.locator("#enq-name")).toHaveValue("Footer Draft");
      await expect(page.locator("#enq-service")).toHaveValue("antenatal");
      await expect(page).toHaveURL(/contact\?service=antenatal$/);
    }
    expect(requests).toEqual([]);
  });
}

test("phone menu and sticky booking unlock, focus the planner and preserve the draft", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await go(page);
  await page.locator("#enq-name").fill("Phone Menu Draft");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await menu.getByRole("link", { name: "Book an appointment" }).click();
  await expect(menu).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expectDestination(page);
  await page.getByRole("navigation", { name: "Quick appointment actions" }).getByRole("link", { name: "Book an appointment" }).click();
  await expectDestination(page);
  await expect(page.locator("#enq-name")).toHaveValue("Phone Menu Draft");
  await expect(page).toHaveURL(/contact\?service=antenatal$/);
});

test("keyboard booking reaches the planner, and Enter operates the date choices", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await go(page);
  const book = page.locator("footer").getByRole("link", { name: "Book an appointment" });
  await book.focus();
  await page.keyboard.press("Enter");
  await expectDestination(page);
  await page.keyboard.press("Tab");
  await expect(page.locator("#enq-name")).toBeFocused();
  const first = page.locator("[data-date]").first();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await expect(first).toBeFocused();
});

test("modified booking opens a new tab without moving or replacing the original draft", async ({ page, context }) => {
  await go(page);
  await page.locator("#enq-name").fill("Original Tab Draft");
  const book = page.locator("footer").getByRole("link", { name: "Book an appointment" });
  await book.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  const popupPromise = context.waitForEvent("page");
  await book.click({ modifiers: ["Control"] });
  const popup = await popupPromise;
  await popup.waitForURL(/contact\?service=antenatal#appointment-request$/);
  await expect(popup.locator("#enq-service")).toHaveValue("antenatal");
  await expect(page.locator("#enq-name")).toHaveValue("Original Tab Draft");
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
  await popup.close();
});

for (const path of ["/", "/services/antenatal"]) {
  test(`booking from ${path} opens and focuses the restored calendar`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(page, path);
    const book = path === "/"
      ? page.locator("#top").getByRole("link", { name: "Book an appointment" })
      : page.getByRole("link", { name: "Request this appointment" });
    await book.click();
    await expect(page).toHaveURL(/contact(?:\?service=antenatal)?#appointment-request$/);
    await expectDestination(page);
    await expect(page.locator("#appointment-request")).toHaveAttribute("data-enquiry-mode", "direct");
    if (path !== "/") await expect(page.locator("#enq-service")).toHaveValue("antenatal");
  });
}

for (const width of [390, 1440]) {
  test(`restored delivery-off Contact has no automated AA violations at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await go(page);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(violations).toEqual([]);
  });
}

test.describe("delivery-off before JavaScript", () => {
  test.use({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  test("calendar stays visible, fields stay safe, and native booking preserves the service", async ({ page }) => {
    await go(page);
    await expect(page.locator("[data-date]")).toHaveCount(10);
    await expect(page.locator("#enq-name")).toBeDisabled();
    await expect(page.locator("main form")).toHaveCount(0);
    await page.locator("footer").getByRole("link", { name: "Book an appointment" }).click();
    await expect(page).toHaveURL(/contact\?service=antenatal#appointment-request$/);
    await expect(page.locator("#enq-service")).toHaveValue("antenatal");
    await expect(page.locator('[data-direct-booking-actions] a[href^="tel:"]')).toBeVisible();
  });
});

test("the real delivery-off endpoint still fails closed", async ({ request }) => {
  const response = await request.post("/api/enquiry", {
    data: { name: "Synthetic Disabled Test", contactMethod: "Email", contact: "disabled@example.invalid", service: "", preferredDate: "", preferredSlot: "", message: "", consent: true, company: "" },
  });
  expect(response.status()).toBe(503);
  expect(await response.json()).toMatchObject({ ok: false });
});
