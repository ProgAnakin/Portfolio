import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves a project site from /<repo>/, Vercel serves from /.
// The base is passed in by whichever one is building rather than hardcoded,
// so the same commit deploys correctly to both.
const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  // No manual chunking: the lazy import of the 3D scene already keeps three.js
  // and react-three-fiber out of the entry bundle, and forcing a `three` chunk
  // pulled the rest of the 3D stack *into* the entry instead.
});
