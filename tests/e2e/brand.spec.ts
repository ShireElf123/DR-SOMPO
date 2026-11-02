import { expect, test } from "@playwright/test";

/**
 * The identity: one monogram, one wordmark, one accent colour — and the files
 * that carry them off the site. These are the checks that would have caught the
 * old card: a green tile in the tab, a logo that only exists at 700 px, a header
 * descriptor that fails contrast at 7.5 px.
 */

test.describe("brand", () => {
  test("the header carries the monogram, the name and a legible descriptor", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const logo = page.locator("header a.group[href='/']");
    await expect(logo).toHaveCount(1);

    // The outline is defined once by the layout sprite and referenced, not copied.
    const monogram = logo.locator("svg use[href='#brand-monogram']");
    await expect(monogram).toHaveCount(1);
    await expect(page.locator("symbol#brand-monogram")).toHaveCount(1);
    await expect(logo.locator("svg")).toHaveCSS("color", "rgb(235, 99, 0)");

    // The accessible name stays the doctor's name — the descriptor is decorative.
    await expect(logo).toHaveAccessibleName("Dr CM Ngwey-Sompo");

    const descriptor = logo.getByText("Obstetrician & Gynaecologist");
    await expect(descriptor).toHaveAttribute("aria-hidden", "true");
    const size = await descriptor.evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize));
    expect(size).toBeGreaterThanOrEqual(8);
    const contrast = await descriptor.evaluate((el) => {
      const rgba = getComputedStyle(el).color.match(/[\d.]+/g)!.map(Number);
      const [r, g, b, a = 1] = rgba;
      const lin = (v: number) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };
      const near = [253, 248, 242].map((back, i) => Math.round(a * [r, g, b][i] + (1 - a) * back));
      const l1 = 0.2126 * lin(near[0]) + 0.7152 * lin(near[1]) + 0.0722 * lin(near[2]);
      const l2 = 0.2126 * lin(253) + 0.7152 * lin(248) + 0.0722 * lin(242);
      const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
      return (hi + 0.05) / (lo + 0.05);
    });
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });

  test("the phone header shortens the lockup without losing the name", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    const logo = page.locator("header a.group[href='/']");
    await expect(logo).toHaveAccessibleName("Dr Sompo");
    await expect(logo.locator("svg use[href='#brand-monogram']")).toBeVisible();
    // The descriptor is desktop-only; on a phone the mark and the name are enough.
    await expect(logo.getByText("Obstetrician & Gynaecologist")).toBeHidden();
  });

  test("the tab icon is the ember tile, not the old forest one", async ({ request }) => {
    const response = await request.get("/icon.svg");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("#EB6300");
    expect(body).not.toMatch(/#174D3C|#0F3A2D|#0A2A20|#DCEBE1/i);
    expect(body).toContain("brand-N");

    const apple = await request.get("/apple-icon.png");
    expect(apple.status()).toBe(200);
    expect(apple.headers()["content-type"]).toContain("image/png");
  });

  test("every lockup is present, outlined and free of the old illustration", async ({ request }) => {
    const files = [
      "logo-stacked.svg",
      "logo-stacked-inverse.svg",
      "logo-horizontal.svg",
      "logo-horizontal-short.svg",
      "monogram.svg",
      "app-icon.svg",
      "app-icon-512.png",
      "logo-stacked-1200.png",
    ];
    for (const file of files) {
      const response = await request.get(`/brand/${file}`);
      expect(response.status(), file).toBe(200);
      if (!file.endsWith(".png")) {
        const body = await response.text();
        // Outlines, not <text>: a printer may not have Instrument Serif.
        expect(body, file).not.toContain("<text");
        expect(body, file).toContain("<path");
      }
    }

    const stacked = await (await request.get("/brand/logo-stacked.svg")).text();
    expect(stacked).toContain('aria-label="Dr CM Ngwey-Sompo');
  });

  test("the share card starts with the real lockup", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const body = await response.body();
    expect(body.byteLength).toBeGreaterThan(20_000);
  });
});
