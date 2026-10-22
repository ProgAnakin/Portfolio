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

export interface VideoSource {
  src: string;
  type: string;
}

export interface ProjectMedia {
  kind: 'image' | 'video';
  /** The still's file, or the clip's first source. */
  src: string;
  /**
   * A clip's files, best first. The same clip saved as `.mp4` and `.webm`
   * becomes one item with two sources: H.264 for every mainstream browser,
   * VP9 for the open-source builds that ship without an H.264 decoder.
   */
  sources?: VideoSource[];
  /** Read off the filename: `02-the-scorecard.webp` → "The scorecard". */
  caption: string;
  /** A clip's first frame, from `<same name>.poster.<ext>` beside it. */
  poster?: string;
}

const VIDEO = /\.(mp4|webm)$/i;
/** `00-the-tour.poster.webp` belongs to `00-the-tour.mp4`; it is not a still. */
const POSTER = /\.poster\.[^.]+$/i;
/** mp4 before webm: the browser plays the first source it can. */
const VIDEO_ORDER = ['mp4', 'webm'];

const stem = (path: string) => path.replace(POSTER, '').replace(/\.[^./]+$/, '');
const extension = (path: string) => path.split('.').pop()!.toLowerCase();

function captionOf(path: string): string {
  const name = stem(path).split('/').pop() ?? '';
  const words = name
    .replace(/^\d+[-_\s]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  if (!words) return '';
  return words[0].toUpperCase() + words.slice(1);
}

const posters = new Map<string, string>();
const clips = new Map<string, VideoSource[]>();
for (const path of Object.keys(FILES)) {
  if (POSTER.test(path)) posters.set(stem(path), FILES[path]);
  else if (VIDEO.test(path)) {
    const list = clips.get(stem(path)) ?? [];
    list.push({ src: FILES[path], type: `video/${extension(path)}` });
    clips.set(stem(path), list);
  }
}

const byProject = new Map<string, ProjectMedia[]>();
const seen = new Set<string>();

for (const path of Object.keys(FILES).sort((a, b) => a.localeCompare(b))) {
  if (POSTER.test(path)) continue;
  const id = path.split('/').at(-2);
  if (!id) continue;
  const list = byProject.get(id) ?? [];
  if (VIDEO.test(path)) {
    if (seen.has(stem(path))) continue;
    seen.add(stem(path));
    const sources = clips
      .get(stem(path))!
      .sort((a, b) => VIDEO_ORDER.indexOf(a.type.slice(6)) - VIDEO_ORDER.indexOf(b.type.slice(6)));
    list.push({
      kind: 'video',
      src: sources[0].src,
      sources,
      caption: captionOf(path),
      poster: posters.get(stem(path)),
    });
  } else {
    list.push({ kind: 'image', src: FILES[path], caption: captionOf(path) });
  }
  byProject.set(id, list);
}

export function mediaFor(id: string): ProjectMedia[] {
  return byProject.get(id) ?? [];
}
