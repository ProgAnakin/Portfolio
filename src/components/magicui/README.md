# Magic UI

Vendored components from [Magic UI](https://magicui.design), MIT licensed,
copyright (c) Magic UI. Taken from `magicuidesign/magicui` at commit
`efe76fc`, from `apps/www/registry/magicui/`.

Magic UI is distributed by copy-paste rather than as a package, so these are
source files in this repository, not a dependency. Kept close to upstream so a
newer version can be diffed in; every change from it is marked `CHANGED:` with
the reason.

Across all of them:

- `@/lib/utils` → `../../lib/cn`, which is where this project keeps `cn`.
- `"use client"` removed. That is a Next.js directive and this is a Vite SPA;
  leaving it in makes a reader think there is a server component boundary here.
- Single quotes and semicolons, to match the rest of the project.
- `cn` is `clsx` alone, without `tailwind-merge` — see `src/lib/cn.ts`. Read
  that before vendoring anything else in: a component whose default classes
  expect to be overridden by the caller's needs its defaults removed instead.

The shadcn CLI could not be used: it fetches component source from
`magicui.design`, which this build environment cannot reach. These were taken
from the project's own repository instead, which is the same source the
registry serves.
