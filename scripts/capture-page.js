import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const directory = resolve('rendered/kb/incidents/4471/postmortem');
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1040, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(pathToFileURL(resolve(directory, 'index.html')).href);
  await page.locator('.stamp b').waitFor();
  await page.screenshot({ path: resolve(directory, 'page.png'), fullPage: true });
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`Captured ${directory}/page.png`);
  console.log(`Rendered signature: ${await page.locator('.stamp b').textContent()}`);
} finally {
  await browser.close();
}
