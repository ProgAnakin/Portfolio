import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { figures, profile } from '../src/data/profile.ts';

// Render a fresh social card from the same data used by the page.
const font = await readFile(new URL('../public/fonts/archivo-wdth-latin.woff2', import.meta.url));
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
});
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="en"><head><style>
    @font-face { font-family: Archivo; src: url(data:font/woff2;base64,${font.toString('base64')}); font-weight: 100 900; font-stretch: 62% 125%; }
    * { box-sizing: border-box; } body { margin: 0; padding: 56px 64px; background: #0c0c0c; color: #f4f4f1; font-family: Archivo, sans-serif; }
    header { display: flex; gap: 48px; border-top: 1px solid #2b2b2b; padding-top: 16px; font-size: 17px; }
    .label { color: #b8b8b3; font-size: 15px; margin-bottom: 5px; }
    h1 { margin: 40px 0 0; font-stretch: 125%; text-transform: uppercase; font-size: 100px; line-height: .94; font-weight: 780; }
    .figures { position: absolute; left: 64px; right: 64px; bottom: 56px; display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid #2b2b2b; }
    .figure { padding: 20px 18px 0; border-left: 1px solid #2b2b2b; } .figure:first-child { border: 0; padding-left: 0; }
    .value { font-size: 46px; font-weight: 560; letter-spacing: -.03em; } .caption { color: #b8b8b3; margin-top: 6px; font-size: 17px; }
  </style></head><body>
    <header><div><div class="label">Now</div>${escape(profile.role)}, ${escape(profile.employer)}</div><div><div class="label">Open to</div>Sales, SDR and business development</div></header>
    <h1>${escape(profile.name).replace(' ', '<br>')}</h1>
    <div class="figures">${figures.map((figure) => `<div class="figure"><div class="value">${escape(figure.value)}</div><div class="caption">${escape(figure.label)}</div></div>`).join('')}</div>
  </body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL('../public/og.jpg', import.meta.url).pathname, type: 'jpeg', quality: 90 });
} finally {
  await browser.close();
}
