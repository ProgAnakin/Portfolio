import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves a project site from /<repo>/, Vercel serves from /.
// The base is passed in by whichever one is building rather than hardcoded,
// so the same commit deploys correctly to both.
const base = process.env.VITE_BASE ?? '/';

/**
 * Absolute URLs, or none.
 *
 * A canonical link and an `og:image` have to be absolute, and this repo
 * deploys to two hosts with different origins — so the origin is passed in at
 * build time rather than guessed. If nobody passes one, every tag that needs
 * it is *removed*: a canonical pointing at the wrong domain tells Google the
 * real site is a duplicate, which is worse than having no canonical at all.
 */
function absoluteUrls(): Plugin {
  const site = (process.env.VITE_SITE_URL ?? '').replace(/\/+$/, '');
  return {
    name: 'shop:absolute-urls',
    transformIndexHtml(html) {
      if (!site) {
        return html
          .split('\n')
          .filter((line) => !line.includes('__SITE_URL__'))
          .join('\n');
      }
      return html.replaceAll('__SITE_URL__', site + base.replace(/\/$/, ''));
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), absoluteUrls()],
  // No manual chunking: the lazy import of the 3D scene already keeps three.js
  // and react-three-fiber out of the entry bundle, and forcing a `three` chunk
  // pulled the rest of the 3D stack *into* the entry instead.
});
