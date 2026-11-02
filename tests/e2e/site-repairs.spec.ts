import { test as base, expect, type Page } from "@playwright/test";

const test = base.extend<{ safeRequests: void }>({
  safeRequests: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.route("**/api/enquiry", (route) =>
        route.fulfill({
          status: 503,
          json: { ok: false, error: "Synthetic delivery unavailable." },
        }),
      );
      await use();
      expect(errors, "No runtime or hydration errors").toEqual([]);
    },
    { auto: true },
  ],
});

const routes = [
  "/",
  "/services",
  "/about",
  "/research",
  "/patient-info",
  "/contact",
  ...[
    "antenatal",
    "delivery",
    "general",
    "oncology",
    "fertility-assessment",
    "laparoscopy",
  ].map((slug) => `/services/${slug}`),
];
const go = async (page: Page, path: string) => {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
};
async function fillValid(page: Page) {
  await page.locator("#enq-name").fill("Synthetic Browser Test");
  await page.locator('label:has(input[value="Email"])').click();
  await page.locator("#enq-contact").fill("browser@example.invalid");
  await page.locator("#enq-consent").check();
}

for (const width of [320, 360, 390, 430, 640, 768, 1024, 1440]) {
  test(`every route keeps its full heading and hero copy inside the frame at ${width}px`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await go(page, route);
      const clipped = await page
        .locator("main h1, [data-hero-copy]")
        .evaluateAll((nodes) =>
          nodes.flatMap((element) => {
            const box = element.getBoundingClientRect();
            const failures: string[] = [];
            for (
              let parent = element.parentElement;
              parent && parent.tagName !== "MAIN";
              parent = parent.parentElement
            ) {
              const style = getComputedStyle(parent);
              if (
                ![style.overflow, style.overflowY].some((value) =>
                  ["hidden", "clip"].includes(value),
                )
              )
                continue;
              const frame = parent.getBoundingClientRect();
              if (box.top < frame.top - 1 || box.bottom > frame.bottom + 1)
                failures.push(
                  `${element.tagName} clipped by ${parent.className}`,
                );
            }
            return failures;
          }),
        );
      expect(clipped, route).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  });
}

test("long service heading still fits with enlarged text and spacing", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 900 });
  await go(page, "/services/laparoscopy");
  await page.addStyleTag({
    content:
      "html{font-size:20px} [data-hero-copy] *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  const containment = await page
    .locator("[data-hero-copy]")
    .evaluate((copy) => {
      const a = copy.getBoundingClientRect(),
        b = copy.parentElement!.getBoundingClientRect();
      return (
        a.top >= b.top - 1 && a.bottom <= b.bottom + 1 && a.right <= b.right + 1
      );
    });
  expect(containment).toBe(true);
});

for (const route of ["/", "/patient-info"]) {
  test(`FAQs work with keyboard and hide collapsed answers from assistive technology on ${route}`, async ({
    page,
  }) => {
    await go(page, route);
    const detail = page.locator("[data-faq-list] details").first();
    const summary = detail.locator("summary");
    if (await detail.evaluate((el) => (el as HTMLDetailsElement).open))
      await summary.click();
    await expect(detail.locator("p")).toBeHidden();
    const answer = (await detail.locator("p").textContent())!.trim();
    expect(await detail.ariaSnapshot()).not.toContain(answer);
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(detail).toHaveJSProperty("open", true);
    await expect(detail.locator("p")).toBeVisible();
    expect(await detail.ariaSnapshot()).toContain(answer);
    await page.keyboard.press("Space");
    await expect(detail).toHaveJSProperty("open", false);
    await expect(summary).toBeFocused();
  });
}

test("mobile Book scrolls to the existing request and preserves its draft and service query", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await go(page, "/contact?service=antenatal");
  await page.locator("#enq-name").fill("Draft preserved");
  await page.locator("#enq-message").fill("Synthetic appointment note");
  const documents: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "document") documents.push(request.url());
  });
  await page
    .getByRole("navigation", { name: "Quick appointment actions" })
    .getByRole("link", { name: "Book an appointment" })
    .click();
  await expect(page.locator("#enq-name")).toHaveValue("Draft preserved");
  await expect(page.locator("#enq-message")).toHaveValue(
    "Synthetic appointment note",
  );
  await expect(page.locator("#appointment-request")).toBeFocused();
  await expect(page).toHaveURL(/contact\?service=antenatal$/);
  expect(documents).toEqual([]);
});

test("overview and detail links resolve to the same displayed and submitted service", async ({
  page,
}) => {
  const payloads: Record<string, unknown>[] = [];
  await page.route("**/api/enquiry", (route) => {
    payloads.push(route.request().postDataJSON());
    return route.fulfill({
      status: 503,
      json: { ok: false, error: "Synthetic receiver disabled." },
    });
  });
  await go(page, "/services");
  await page.locator('main a[href="/contact?service=antenatal#appointment-request"]').click();
  await expect(page.locator("#enq-service")).toHaveValue("antenatal");
  await expect(page.locator("#enq-service option:checked")).toContainText(
    "Antenatal care",
  );
  await fillValid(page);
  await page.locator('main button[type="submit"]').click();
  await expect.poll(() => payloads.length).toBe(1);
  expect(payloads[0].service).toBe("antenatal");
  await go(page, "/services/antenatal");
  await page.getByRole("link", { name: "Request this appointment" }).click();
  await expect(page.locator("#enq-service")).toHaveValue("antenatal");
  await go(page, "/contact?service=Antenatal%20care");
  await expect(page.locator("#enq-service")).toHaveValue("antenatal");
  await go(page, "/contact?service=unsupported");
  await expect(page.locator("#enq-service")).toHaveValue("");
});

test("validation focuses a visible error summary and maps server date/slot errors", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await go(page, "/contact");
  await page.locator('main button[type="submit"]').click();
  const summary = page.locator('main [role="alert"][tabindex="-1"]');
  await expect(summary).toBeFocused();
  const position = (await summary.boundingBox())!;
  expect(position.y).toBeGreaterThan(0);
  expect(position.y + position.height).toBeLessThan(844);
  await summary.getByRole("link", { name: "Full name" }).click();
  await expect(page.locator("#enq-name")).toBeFocused();
  await fillValid(page);
  await page.route("**/api/enquiry", (route) =>
    route.fulfill({
      status: 422,
      json: {
        ok: false,
        errors: {
          preferredDate: "Choose another day for this test.",
          preferredSlot: "Choose another time for this test.",
        },
      },
    }),
  );
  await page.locator('main button[type="submit"]').click();
  await expect(summary).toBeFocused();
  await expect(page.locator("#enq-date-error")).toHaveText(
    "Choose another day for this test.",
  );
  await expect(page.locator("#enq-slot-error")).toHaveText(
    "Choose another time for this test.",
  );
  await expect(page.locator("#enq-date")).toHaveAttribute(
    "aria-describedby",
    "enq-date-error",
  );
});

test("native submission after a script failure is POST and never puts details in the URL", async ({
  page,
}) => {
  await go(page, "/contact");
  await fillValid(page);
  await page.locator("#enq-message").fill("Synthetic-private-note");
  const sent = page.waitForRequest(
    (request) => new URL(request.url()).pathname === "/api/enquiry",
  );
  await page
    .locator("main form")
    .evaluate((element) => (element as HTMLFormElement).submit());
  const request = await sent;
  expect(request.method()).toBe("POST");
  expect(new URL(request.url()).search).toBe("");
  expect(request.url()).not.toMatch(/Synthetic|browser%40/);
});

test("contact-method focus is visible, and the pending channel is disabled", async ({
  page,
}) => {
  await go(page, "/contact");
  await page.locator("#enq-service").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator('input[value="Telephone"]')).toBeFocused();
  await expect(page.locator('label:has(input[value="Telephone"])')).toHaveCSS(
    "outline-style",
    "solid",
  );
  await expect(page.locator('input[value="WhatsApp"]')).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('input[value="Email"]')).toBeChecked();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('input[value="Telephone"]')).toBeChecked();
});

for (const timezoneId of [
  "Africa/Johannesburg",
  "Pacific/Auckland",
  "America/Los_Angeles",
]) {
  test.describe(timezoneId, () => {
    test.use({ timezoneId });
    test("practice-date labels hydrate consistently without Sunday options", async ({
      page,
    }) => {
      await go(page, "/contact");
      const dates = await page
        .locator("[data-date]")
        .evaluateAll((elements) =>
          elements.map((element) => ({
            iso: (element as HTMLElement).dataset.date!,
            text: element.textContent!,
          })),
        );
      expect(dates).toHaveLength(10);
      for (const { iso, text } of dates) {
        const expected = new Intl.DateTimeFormat("en-ZA", {
          weekday: "short",
          timeZone: "UTC",
        }).format(new Date(`${iso}T00:00:00Z`));
        expect(text).toContain(expected);
        expect(text).not.toMatch(/Sun|Sat/);
      }
    });
  });
}

test("live reduced motion stops and hides the desktop cursor follower", async ({
  page,
}) => {
  await go(page, "/");
  await page.mouse.move(400, 200);
  await expect(page.locator("[data-cursor-companion]")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-cursor-companion]")).toBeHidden();
  await expect(page.locator("[data-cursor-companion]")).toHaveCount(0);
  await page.mouse.move(800, 500);
  await expect(page.locator("[data-cursor-companion]")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("[data-cursor-companion]")).toHaveCount(1);
});

test("sharing metadata matches each page and FAQ structured data is scoped to visible FAQs", async ({
  page,
}) => {
  for (const path of routes) {
    await go(page, path);
    const data = await page.evaluate(() => ({
      canonical: (
        document.querySelector('link[rel="canonical"]') as HTMLLinkElement
      ).href,
      og: (document.querySelector('meta[property="og:url"]') as HTMLMetaElement)
        .content,
      title: (
        document.querySelector('meta[property="og:title"]') as HTMLMetaElement
      ).content,
      graphs: [
        ...document.querySelectorAll('script[type="application/ld+json"]'),
      ].map((node) => JSON.parse(node.textContent!)),
    }));
    expect(new URL(data.og).pathname).toBe(path);
    expect(new URL(data.canonical).pathname).toBe(path);
    if (path !== "/")
      expect(data.title).not.toBe(
        "Dr CM Ngwey-Sompo | Specialist Obstetrician & Gynaecologist",
      );
    const faq = data.graphs.filter((graph) => graph["@type"] === "FAQPage");
    expect(faq.length).toBe(
      path === "/patient-info" || path.startsWith("/services/") ? 1 : 0,
    );
    expect(
      data.graphs.some(
        (graph) =>
          graph.procedureType === "https://schema.org/NoninvasiveProcedure",
      ),
    ).toBe(false);
  }
});

for (const width of [390, 1440]) {
  test(`placeholder photos have no visible AI badges or notices at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await go(page, route);
      await expect(page.locator("[data-photography-notice]")).toHaveCount(0);
      // Check rendered copy, not factual image alternative text or metadata.
      const visibleCopy = await page.locator("main").innerText();
      expect(visibleCopy, route).not.toMatch(/AI(?:-generated| illustration)|not a portrait of Dr Sompo/);
    }
  });
}

for (const path of ["/", "/research", "/contact"]) {
  test(`phone downloads one hero variant with accurate alternative text on ${path}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(page, path);
    const hero = page.locator("main section").first();
    const selector =
      path === "/"
        ? 'img[src*="hero-doctor"]'
        : "picture[data-responsive-hero] img";
    await expect(hero.locator(selector)).toHaveCount(1);
    await expect(hero.locator("[data-photography-notice]")).toHaveCount(0);
    await expect(hero.locator(selector)).toHaveAttribute("alt", /AI-generated/);
    const selectedSource = await hero
      .locator(selector)
      .evaluate((img) => (img as HTMLImageElement).currentSrc);
    const requests = await page.evaluate(() =>
      performance.getEntriesByType("resource").map((entry) => entry.name),
    );
    expect(requests).toContain(selectedSource);
    if (path === "/") {
      expect(
        requests.filter((name) =>
          new URL(name).searchParams.get("url")?.endsWith("hero-doctor.jpg"),
        ),
      ).toHaveLength(1);
    } else {
      const chosenWidth = new URL(selectedSource).searchParams.get("w");
      const unused =
        path === "/research"
          ? "/images/cervical-research.jpg"
          : "/images/hospital-exterior.jpg";
      // The desktop source must not be prioritised/preloaded; it may be used
      // lazily elsewhere on the page, so don't prohibit all uses of that file.
      const preloads = await page
        .locator('link[rel="preload"][as="image"]')
        .evaluateAll((links) =>
          links.map((link) => (link as HTMLLinkElement).imageSrcset),
        );
      expect(
        preloads.some((value) => value.includes(encodeURIComponent(unused))),
      ).toBe(false);
      expect(chosenWidth).not.toBeNull();
    }
  });
}

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("form cannot collect data before hydration; native FAQs still work", async ({
    page,
  }) => {
    await go(page, "/contact");
    await expect(page.locator("#enq-name")).toBeDisabled();
    await expect(page.locator('main button[type="submit"]')).toBeDisabled();
    await expect(page.locator("main form")).toHaveAttribute("method", "post");
    await expect(
      page.getByText(/The online form needs JavaScript/),
    ).toBeVisible();
    await go(page, "/");
    const detail = page.locator("[data-faq-list] details").first();
    await detail.locator("summary").click();
    await expect(detail.locator("p")).toBeVisible();
  });
});

test("unknown routes and reserved service names return a consistent noindex 404", async ({
  page,
}) => {
  for (const path of [
    "/__missing-audit-page",
    "/services/unknown",
    "/services/__proto__",
    "/services/constructor",
  ]) {
    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(404);
    await expect(page.locator("main h1")).toContainText(
      "couldn't find that page",
    );
    const robots = await page
      .locator('meta[name="robots"]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("content")),
      );
    expect(robots.some((value) => value?.includes("noindex"))).toBe(true);
    expect(robots).not.toContain("index, follow");
  }
});
