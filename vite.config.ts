import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves a project site from /<repo>/, Vercel serves from /.
// The base is passed in by whichever one is building rather than hardcoded,
// so the same commit deploys correctly to both.
const base = process.env.VITE_BASE ?? '/';

/**
 * Where this site actually lives.
 *
 * The production host, declared once. Vercel serves it; the repository's
 * homepage field says so, and every absolute tag on the page — the canonical
 * link, `og:url`, `og:image` — has to name it, because a scraper resolves
 * nothing relative and a canonical aimed at the wrong domain tells a search
 * engine the real site is the duplicate.
 *
 * Override it with `VITE_SITE_URL` when building for somewhere else. The full
 * public address, including any path the site is served under — it is used
 * verbatim, not joined to `base`, because the host and the path prefix do not
 * always belong to each other.
 */
const site = (process.env.VITE_SITE_URL ?? 'https://portfolio-beige-sigma-29.vercel.app').replace(
  /\/+$/,
  '',
);

function absoluteUrls(): Plugin {
  return {
    name: 'shop:absolute-urls',
    transformIndexHtml(html) {
      // Blank on purpose is a valid answer: drop the tags rather than ship a
      // guess. `VITE_SITE_URL=` does that.
      if (!site) {
        return html
          .split('\n')
          .filter((line) => !line.includes('__SITE_URL__'))
          .join('\n');
      }
      return html.replaceAll('__SITE_URL__', site);
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
