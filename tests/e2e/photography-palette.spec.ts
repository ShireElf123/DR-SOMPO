import { expect, test } from "@playwright/test";

/**
 * The placeholders were generated independently of the reskin, so several of
 * them carried the one colour family the palette cannot absorb: bottle-green
 * consulting-room walls, an emerald operating theatre, a wall of saturated
 * agave outside the hospital. Measured across the set, the mean share of
 * cool-green pixels was 12.9% and one frame was 45.7% green — a cold block
 * sitting inside a peach page.
 *
 * Nine photographs were re-graded from the same negatives: same room, same
 * people, same light, warm walls. This check keeps the photography inside the
 * palette, and names the frame when it drifts out.
 *
 * Green reads as hue 65-170deg with real saturation; warm reads as 330-45deg
 * with real saturation. A little foliage in a garden is fine; a green wall is
 * not.
 */

const photographs = [
  "antenatal.jpg",
  "cervical-research.jpg",
  "chambers-table.jpg",
  "consulting-sanctuary.jpg",
  "corridor.jpg",
  "fertility.jpg",
  "gynae.jpg",
  "hospital-exterior.jpg",
  "maternity-suite.jpg",
  "patient-quiet.jpg",
  "research-desk.jpg",
  "screening-room.jpg",
  "surgery.jpg",
  "waiting-room.jpg",
];

type Sample = { green: number; warm: number };

const sample = async (page: import("@playwright/test").Page, file: string): Promise<Sample> =>
  page.evaluate(async (src) => {
    const image = new Image();
    image.src = src;
    await image.decode();

    const width = 240;
    const height = Math.max(1, Math.round((image.naturalHeight / image.naturalWidth) * width));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("no 2d context");
    context.drawImage(image, 0, 0, width, height);
    const { data } = context.getImageData(0, 0, width, height);

    let green = 0;
    let warm = 0;
    let seen = 0;
    for (let index = 0; index < data.length; index += 4) {
      const r = data[index] / 255;
      const g = data[index + 1] / 255;
      const b = data[index + 2] / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      seen += 1;
      if (max < 0.12) continue;
      const saturation = max === 0 ? 0 : delta / max;
      if (saturation <= 0.14) continue;
      let hue = 0;
      if (delta > 0) {
        if (max === r) hue = ((g - b) / delta) % 6;
        else if (max === g) hue = (b - r) / delta + 2;
        else hue = (r - g) / delta + 4;
        hue *= 60;
        if (hue < 0) hue += 360;
      }
      if (hue >= 65 && hue <= 170) green += 1;
      else if (hue > 330 || hue < 45) warm += 1;
    }
    return { green: (green / seen) * 100, warm: (warm / seen) * 100 };
  }, `/images/${file}`);

test("every photograph sits in the warm palette", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const report: string[] = [];
  const greens: number[] = [];
  for (const file of photographs) {
    const { green, warm } = await sample(page, file);
    greens.push(green);
    report.push(`${file} green ${green.toFixed(1)}% warm ${warm.toFixed(1)}%`);
    // A frame whose dominant field is cool green fights every peach surface
    // around it. The worst photo that still reads warm is 8.1% green.
    expect(green, `${file} is too green for the palette (${report.at(-1)})`).toBeLessThanOrEqual(12);
    // And a frame with almost no warmth in it reads as a grey or blue insert.
    expect(warm, `${file} carries too little warmth (${report.at(-1)})`).toBeGreaterThanOrEqual(20);
  }

  const mean = greens.reduce((sum, value) => sum + value, 0) / greens.length;
  expect(mean, `set-wide green share\n${report.join("\n")}`).toBeLessThanOrEqual(4);
});
