import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
for (const width of [390, 1440]) {
  for (const route of routes) {
    test(`WCAG automated checks on ${route} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.route("**/api/enquiry", (request) => request.abort());
      await page.goto(route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.map((node) => ({
            target: node.target,
            message: node.failureSummary,
          })),
        })),
      ).toEqual([]);
      const invalidLabels = await page
        .locator("[aria-labelledby]")
        .evaluateAll((elements) =>
          elements.flatMap((element) =>
            (element.getAttribute("aria-labelledby") ?? "")
              .split(/\s+/)
              .filter((id) => id && !document.getElementById(id)),
          ),
        );
      expect(invalidLabels).toEqual([]);
    });
  }
}
