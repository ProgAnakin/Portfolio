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
    * { box-sizing: border-box; }
    body { margin: 0; padding: 54px 60px; background: #f4f4f1; color: #0c0c0c; font-family: Archivo, sans-serif; }
    header { display: flex; justify-content: space-between; border-bottom: 1px solid #d3d3ce; padding-bottom: 20px; font-size: 16px; }
    .eyebrow { font-size: 12px; text-transform: uppercase; letter-spacing: .12em; font-weight: 650; }
    main { display: grid; grid-template-columns: 1.35fr 1fr; gap: 48px; margin-top: 42px; align-items: center; }
    h1 { margin: 0; font-size: 90px; line-height: .95; letter-spacing: -.065em; font-weight: 720; }
    h1 span { color: #536622; }
    .lead { margin: 26px 0 0; font-size: 24px; line-height: 1.35; }
    aside { padding: 30px; background: #0c0c0c; color: #f4f4f1; box-shadow: 8px 8px 0 #d6ed83; }
    .value { margin-top: 27px; font-size: 74px; line-height: 1; font-weight: 560; letter-spacing: -.03em; }
    .value span { color: #d6ed83; }
    .caption { color: #b8b8b3; margin-top: 12px; font-size: 16px; }
    .figures { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; border-top: 1px solid #2b2b2b; padding-top: 24px; margin-top: 28px; }
    .small-value { font-size: 30px; font-weight: 560; }
    footer { position: absolute; bottom: 36px; font-size: 15px; color: #383836; }
  </style></head><body>
    <header><span class="eyebrow">Sales experience. Builder’s mindset.</span><span>${escape(profile.role)} · ${escape(profile.employer)}</span></header>
    <main>
      <div><h1>${escape(profile.name).replace(' ', '<br>')}<span>.</span></h1><p class="lead">I sell technology.<br>And build tools for people who sell.</p></div>
      <aside><div class="eyebrow">On the shop floor</div><div class="value">${escape(figures[0].value)}<span>+</span></div><div class="caption">${escape(figures[0].label)}</div>
        <div class="figures">${figures.slice(1, 3).map((figure) => `<div><div class="small-value">${escape(figure.value)}</div><div class="caption">${escape(figure.label)}</div></div>`).join('')}</div>
      </aside>
    </main>
    <footer>${profile.languages.map((language) => escape(language.name)).join(' · ')} &nbsp; / &nbsp; Sales, SDR & business development</footer>
  </body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL('../public/og.jpg', import.meta.url).pathname, type: 'jpeg', quality: 90 });
} finally {
  await browser.close();
}
