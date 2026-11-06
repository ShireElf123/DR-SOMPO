import { chromium, devices } from '/home/user/DR-SOMPO/node_modules/playwright/index.mjs';
import { writeFile } from 'node:fs/promises';
const base = 'http://127.0.0.1:3010';
const out = '/home/user/.cache/dr-sompo-full-audit';
const browser = await chromium.launch({ executablePath: '/tmp/chromium', headless: true, args: ['--no-sandbox'] });
const results = [];
try {
  const context = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', timezoneId: 'Africa/Johannesburg' });
  await context.route('**/api/enquiry', route => route.abort());
  const page = await context.newPage();
  await page.goto(base + '/contact');
  await page.waitForTimeout(800);
  await page.locator('#enq-service').scrollIntoViewIfNeeded();
  await page.locator('#enq-service').focus();
  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);
  const focus = await page.evaluate(() => {
    const e = document.activeElement;
    const label = e.closest('label');
    const s = getComputedStyle(e), l = getComputedStyle(label);
    return {
      tag: e.tagName, name: e.getAttribute('name'), value: e.value, focusVisible: e.matches(':focus-visible'),
      input: { rect: e.getBoundingClientRect().toJSON(), clip: s.clip, clipPath: s.clipPath, overflow: s.overflow, outline: s.outline, boxShadow: s.boxShadow },
      label: { rect: label.getBoundingClientRect().toJSON(), focusWithin: label.matches(':focus-within'), outline: l.outline, outlineOffset: l.outlineOffset, boxShadow: l.boxShadow, border: l.border, background: l.backgroundColor, className: label.className },
    };
  });
  await page.screenshot({ path: out + '/screens/contact-radio-keyboard-focus-390.png' });
  results.push({ test: 'radio-visible-focus-final', detail: focus });
  for (const path of ['/', '/research', '/contact']) {
    await page.goto(base + path);
    await page.waitForTimeout(650);
    results.push({ test: 'hero-responsive-images-final', path, detail: await page.evaluate(() => {
      const hero = document.querySelector('main h1')?.closest('section');
      return {
        heroFound: Boolean(hero),
        images: [...(hero?.querySelectorAll('img') ?? [])].map(img => {
          const rect = img.getBoundingClientRect();
          const resource = performance.getEntriesByName(img.currentSrc).find(e => e.entryType === 'resource');
          return { src: img.currentSrc, alt: img.alt, rendered: rect.width > 0 && rect.height > 0, width: rect.width, height: rect.height, encodedBytes: resource?.encodedBodySize, loading: img.loading, complete: img.complete };
        }),
        preloads: [...document.querySelectorAll('link[rel="preload"][as="image"]')].map(l => ({ media: l.media, srcset: l.imageSrcset, sizes: l.imageSizes })),
      };
    }) });
  }
  await context.close();
} finally {
  await browser.close();
}
await writeFile(out + '/verification.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
