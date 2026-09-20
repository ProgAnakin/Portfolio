/**
 * Screenshots and clips, dropped in rather than declared.
 *
 * Every other piece of a project is a field in `projects.ts`, but media is not
 * something you write — it is something you export from a screen recorder at
 * eleven at night and want on the site before you forget. So the folder *is*
 * the data: put a file in `assets/shots/<project id>/` and it appears, in
 * filename order, captioned from its own name. Nothing to wire up, nothing to
 * forget to wire up.
 *
 * Vite resolves the glob at build time, so every file is fingerprinted and
 * cache-busted like any other asset, and a file nobody references is never
 * shipped. See `assets/shots/README.md` for the naming convention.
 */
const FILES = import.meta.glob('../assets/shots/*/*.{png,jpg,jpeg,webp,avif,mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export interface ProjectMedia {
  kind: 'image' | 'video';
  src: string;
  /** Read off the filename: `02-the-swipe-quiz.webp` → "The swipe quiz". */
  caption: string;
}

const VIDEO = /\.(mp4|webm)$/i;

function captionOf(path: string): string {
  const name = path.split('/').pop() ?? '';
  const words = name
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[-_\s]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  if (!words) return '';
  return words[0].toUpperCase() + words.slice(1);
}

const byProject = new Map<string, ProjectMedia[]>();

for (const path of Object.keys(FILES).sort((a, b) => a.localeCompare(b))) {
  const id = path.split('/').at(-2);
  if (!id) continue;
  const list = byProject.get(id) ?? [];
  list.push({
    kind: VIDEO.test(path) ? 'video' : 'image',
    src: FILES[path],
    caption: captionOf(path),
  });
  byProject.set(id, list);
}

export function mediaFor(id: string): ProjectMedia[] {
  return byProject.get(id) ?? [];
}
