import { test as base, expect, devices, type Locator, type Page } from "@playwright/test";

const test = base.extend<{ runtimeErrors: string[] }>({
  runtimeErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    // Never deliver test enquiries to the practice, even if an assertion fails.
    await page.route("**/api/enquiry", (route) => route.fulfill({
      status: 503, json: { ok: false, error: "Test delivery is disabled." },
    }));
    await use(errors);
    expect(errors, "No runtime or hydration errors").toEqual([]);
  }, { auto: true }],
});

async function go(page: Page, path = "/contact") {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

async function expectPageFits(page: Page) {
  const width = page.viewportSize()!.width;
  const dimensions = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  // Do not compare with innerWidth: mobile overflow inflated it to 610px on a
  // 390px device, so the old scrollWidth <= innerWidth check falsely passed.
  expect(dimensions.client).toBe(width);
  expect(dimensions.content, "The document must not widen to fit the form").toBeLessThanOrEqual(width);
  expect(dimensions.body, "Hidden overflow must not mask oversized content").toBeLessThanOrEqual(width);
}

async function expectWithinPhone(page: Page, locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 0.5);
}

const { defaultBrowserType: _browser, ...phone } = devices["iPhone 13"];

test.describe("mobile appointment request", () => {
  test.use(phone);

  for (const width of [320, 360, 375, 390, 414, 430]) {
    test(`form fits ${width}px, with readable inputs and a contained date strip`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await go(page);
      await expectPageFits(page);
      const form = page.locator("main form");
      await expectWithinPhone(page, form);
      const formBox = (await form.boundingBox())!;
      expect(formBox.width).toBeCloseTo(width - 40, 0);

      for (const field of await form.locator("fieldset, #enq-name, #enq-contact, #enq-service, #enq-message").all()) {
        await expectWithinPhone(page, field);
      }
      for (const input of await form.locator("#enq-name, #enq-contact, #enq-service, #enq-message").all()) {
        expect(await input.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
        expect((await input.boundingBox())!.height).toBeGreaterThanOrEqual(48);
      }
      for (const target of await form.locator('[role="radiogroup"] label, label:has(input[name="consent"]), button[type="submit"]').all()) {
        expect((await target.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }

      await page.locator("#enq-name").click();
      await expect(page.locator("#enq-name")).toBeFocused();
      await expectPageFits(page);
      await page.locator("#enq-name").blur();

      const days = form.getByRole("group", { name: "Preferred day (optional)" });
      const rail = days.locator("div").first();
      await expect(days.getByRole("button")).toHaveCount(10);
      await expect(rail).toHaveCSS("overflow-x", "auto");
      expect(await rail.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
      await rail.evaluate(el => { el.scrollLeft = el.scrollWidth; });
      expect(await rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
      const lastDay = days.getByRole("button").last();
      await lastDay.click();
      await expect(lastDay).toHaveAttribute("aria-pressed", "true");
      await expectWithinPhone(page, lastDay);
      await expectPageFits(page);
      expect(await page.evaluate(() => scrollX)).toBe(0);
    });
  }

  test("Home's appointment tile keeps the contact page at phone width", async ({ page }) => {
    await go(page, "/");
    await expectPageFits(page);
    await page.locator('a[href*="appointment-request"]').filter({ hasText: "Request an appointment" }).click();
    await expect(page).toHaveURL(/\/contact#appointment-request$/);
    await expect(page.locator("main form")).toBeVisible();
    await expectPageFits(page);
    await expectWithinPhone(page, page.locator("main form"));
  });

  test("portrait and landscape keep the form contained without losing entered text", async ({ page }) => {
    await go(page);
    await page.locator("#enq-name").fill("Mobile Layout Test");
    for (const viewport of [{ width: 844, height: 390 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await expectPageFits(page);
      await expectWithinPhone(page, page.locator("main form"));
      await expect(page.locator("#enq-name")).toHaveValue("Mobile Layout Test");
      await expect(page.locator("#enq-name")).toHaveCSS("font-size", "16px");
    }
  });

  test("validation, sending, delivery failure, retry and success fit the phone", async ({ page }) => {
    const submissions: Record<string, unknown>[] = [];
    const responses: (() => void)[] = [];
    await page.route("**/api/enquiry", async (route) => {
      submissions.push(route.request().postDataJSON());
      const attempt = submissions.length;
      await new Promise<void>((resolve) => responses.push(resolve));
      await route.fulfill(attempt === 1
        ? { status: 503, json: { ok: false, error: "Test delivery unavailable. Please call the practice." } }
        : { status: 200, json: { ok: true } });
    });
    await go(page);
    const submit = page.locator('main button[type="submit"]');
    await submit.click();
    await expect(page.locator("#enq-name")).toHaveAttribute("aria-invalid", "true");
    expect(submissions).toHaveLength(0);
    await expectPageFits(page);

    await page.locator("#enq-name").fill("Mobile Layout Test");
    await page.getByRole("group", { name: "Preferred day (optional)" }).getByRole("button").last().click();
    await page.getByRole("group", { name: "Preferred time (optional)" }).getByRole("button", { name: /Late morning/ }).click();
    await page.locator("#enq-service").selectOption({ index: 1 });
    await page.locator("main form").getByText("Email", { exact: true }).click();
    await page.locator("#enq-contact").fill("mobile-layout@example.invalid");
    await page.locator('input[name="consent"]').check();

    for (const attempt of [1, 2]) {
      await submit.click();
      await expect.poll(() => responses.length).toBe(1);
      await expect(submit).toBeDisabled();
      await expect(submit).toContainText("Sending request");
      await expectPageFits(page);
      responses.shift()!();
      if (attempt === 1) {
        await expect(page.locator("main form").getByRole("alert")).toContainText("Test delivery unavailable");
        await expect(page.locator("main form").getByRole("alert")).toBeFocused();
        await expect(submit).toBeEnabled();
        await expectPageFits(page);
      }
    }
    const success = page.locator('main [role="status"]');
    await expect(success).toContainText("Request received");
    await expectWithinPhone(page, success);
    await expectPageFits(page);
    expect(submissions).toHaveLength(2);
    expect(submissions[1]).toMatchObject({
      name: "Mobile Layout Test", contactMethod: "Email", contact: "mobile-layout@example.invalid", consent: true,
      preferredSlot: "Late morning",
    });
    expect(submissions[1].preferredDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    await page.getByRole("button", { name: "Send another" }).click();
    await expect(page.locator("#enq-name")).toHaveValue("");
    await expectPageFits(page);
  });
});

for (const width of [768, 1024, 1440]) {
  test(`contact keeps its intended columns at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await go(page);
    await expectPageFits(page);
    const section = page.locator("section").filter({ has: page.locator("form") });
    const grid = section.locator(".shell > .grid");
    const columns = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" "));
    expect(columns).toHaveLength(width >= 1024 ? 2 : 1);
    await expectWithinPhone(page, page.locator("main form"));
  });
}

test.describe("appointment form before JavaScript", () => {
  test.use({ ...phone, javaScriptEnabled: false });
  test("server-rendered mobile form does not overflow", async ({ page }) => {
    await go(page);
    await expectPageFits(page);
    await expectWithinPhone(page, page.locator("main form"));
  });
});


test("the configured flow submits the alternate date and selected time, not an assumed slot", async ({ page }) => {
  const payloads: Record<string, unknown>[] = [];
  await page.route("**/api/enquiry", route => {
    payloads.push(route.request().postDataJSON());
    return route.fulfill({ status: 503, json: { ok: false, error: "Synthetic delivery disabled." } });
  });
  await go(page);
  const date = page.locator("#enq-other-date");
  const lastAllowed = (await date.getAttribute("max"))!;
  await date.fill(lastAllowed);
  await page.getByRole("group", { name: "Preferred time (optional)" }).getByRole("button", { name: /Late morning/ }).click();
  await page.locator("#enq-name").fill("Synthetic Alternate Date");
  await page.locator('label:has(input[value="Email"])').click();
  await page.locator("#enq-contact").fill("alternate@example.invalid");
  await page.locator("#enq-consent").check();
  await page.locator('main button[type="submit"]').click();
  await expect.poll(() => payloads.length).toBe(1);
  expect(payloads[0]).toMatchObject({ preferredDate: lastAllowed, preferredSlot: "Late morning" });
  await expect(date).toHaveValue(lastAllowed);
  await expect(page.getByText("Request received", { exact: true })).toHaveCount(0);
});
