import { expect, test } from "@playwright/test";

/**
 * The identity: the illustrated mark plus the outlined wordmark, on the site and
 * in the files that carry it off the site. These checks would have caught the
 * old card — a forest-green tab icon, a logo that only exists at 700 px, a
 * header descriptor that fails contrast, and the monogram that was replaced.
 */

test.describe("brand", () => {
  test("the header carries the mark, the name and a legible descriptor", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const logo = page.locator("header a.group[href='/']");
    await expect(logo).toHaveCount(1);

    const mark = logo.locator('img[src="/brand/mark-132.webp"]');
    await expect(mark).toHaveCount(1);
    await expect(mark).toBeVisible();
    await expect(mark).toHaveAttribute("alt", "");
    const box = await mark.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(32);

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
    await expect(logo.locator("img")).toBeVisible();
    // The descriptor is desktop-only; on a phone the mark and the name are enough.
    await expect(logo.getByText("Obstetrician & Gynaecologist")).toBeHidden();
  });

  test("the tab icon is the mark on cream, not the old forest square", async ({ request }) => {
    const icon = await request.get("/icon.png");
    expect(icon.status()).toBe(200);
    expect(icon.headers()["content-type"]).toContain("image/png");
    expect((await icon.body()).byteLength).toBeGreaterThan(5_000);

    const apple = await request.get("/apple-icon.png");
    expect(apple.status()).toBe(200);
    expect(apple.headers()["content-type"]).toContain("image/png");

    // The green release's tile is gone for good.
    expect((await request.get("/icon.svg")).status()).toBe(404);
    expect((await request.get("/brand/monogram.svg")).status()).toBe(404);
  });

  test("every lockup ships as a file the printer can use", async ({ request }) => {
    const files = [
      "logo-stacked.png",
      "logo-stacked-inverse.png",
      "logo-horizontal.png",
      "logo-horizontal-short.png",
      "mark-1024.png",
      "mark-132.webp",
      "avatar-1024.png",
      "app-icon-512.png",
      "app-icon-192.png",
    ];
    for (const file of files) {
      const response = await request.get(`/brand/${file}`);
      expect(response.status(), file).toBe(200);
      expect(response.headers()["content-type"], file).toMatch(/image\/(png|webp)/);
      expect((await response.body()).byteLength, file).toBeGreaterThan(2_000);
    }
  });

  test("the share card starts with the real lockup", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    expect((await response.body()).byteLength).toBeGreaterThan(20_000);
  });
});
