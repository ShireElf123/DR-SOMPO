import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1440, 1920, 2560]) {
  test(`footer banner covers the whole viewport throughout its loop at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const track = page.locator("footer .marquee-track");
    await expect
      .poll(() => track.evaluate((el) => el.getAnimations().length))
      .toBe(1);
    for (const phase of [0, 0.25, 0.5, 0.75, 0.999, 1, 1.001, 1.999]) {
      const coverage = await track.evaluate((element, fraction) => {
        const animation = element.getAnimations()[0];
        animation.pause();
        animation.currentTime =
          Number(animation.effect!.getTiming().duration) * fraction;
        const box = element.getBoundingClientRect();
        const viewport = element.parentElement!.getBoundingClientRect();
        return {
          left: box.left,
          right: box.right,
          viewportLeft: viewport.left,
          viewportRight: viewport.right,
        };
      }, phase);
      expect(
        coverage.left,
        `left coverage at phase ${phase}`,
      ).toBeLessThanOrEqual(coverage.viewportLeft + 1);
      expect(
        coverage.right,
        `right coverage at phase ${phase}`,
      ).toBeGreaterThanOrEqual(coverage.viewportRight - 1);
    }
    const copies = track.locator(".marquee-copy");
    await expect(copies).toHaveCount(2);
    const sizes = await copies.evaluateAll((items) =>
      items.map((el) => el.getBoundingClientRect().width),
    );
    expect(sizes[0]).toBeCloseTo(sizes[1], 3);
    expect(sizes[0]).toBeGreaterThanOrEqual(width - 1);
    await expect(copies.nth(1)).toHaveAttribute("aria-hidden", "true");
    // Compare corresponding text, not just the track's box: a changed travel
    // distance could keep coverage yet still visibly jump at the loop seam.
    const seam = await track.evaluate((element) => {
      const animation = element.getAnimations()[0];
      const duration = Number(animation.effect!.getTiming().duration);
      const positions = (copy: Element) =>
        Array.from(
          copy.children,
          (child) => child.getBoundingClientRect().left,
        );
      animation.currentTime = duration * 0.999;
      const before = positions(element.children[1]);
      animation.currentTime = duration;
      return { before, after: positions(element.children[0]) };
    });
    expect(seam.before).toHaveLength(seam.after.length);
    for (let index = 0; index < seam.before.length; index++) {
      expect(seam.before[index] - seam.after[index]).toBeCloseTo(
        sizes[0] * 0.001,
        1,
      );
    }
  });
}

test("banner recomputes its geometry on resize and can be paused by keyboard", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const banner = page.locator("footer .marquee-group");
  const track = banner.locator(".marquee-track");
  for (const width of [390, 1920, 768, 2560, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await track
        .locator(".marquee-copy")
        .first()
        .evaluate((el) => el.getBoundingClientRect().width),
    ).toBeGreaterThanOrEqual(width - 1);
  }
  const pause = banner.getByRole("button", {
    name: "Pause professional affiliations",
  });
  await pause.focus();
  await page.keyboard.press("Enter");
  await expect(banner).toHaveAttribute("data-paused", "true");
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.mouse.move(0, 0);
  await expect(banner).toHaveAttribute("data-paused", "false");
  await expect(track).toHaveCSS("animation-play-state", "running");
});

test("reduced motion shows every affiliation once without an animation or clipped tail", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  const banner = page.locator("footer .marquee-group");
  await expect(banner.locator(".marquee-track")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(banner.locator(".marquee-copy").nth(1)).toBeHidden();
  for (const item of await banner
    .locator(".marquee-copy")
    .first()
    .locator(":scope > span")
    .all()) {
    const box = (await item.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
  }
  await expect(banner.getByRole("button")).toHaveCount(0);
});
