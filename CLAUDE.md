# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev       # Start dev server at localhost:4321
npm run build     # Build to ./dist/
npm run preview   # Preview production build locally
npm run check     # Type check (astro check); CI runs it before build/deploy
npm run astro ... # Run Astro CLI (e.g. astro add, astro check)
```

## Architecture

This is an Astro 6 project (ESM, Node >=22.12). Pages in `src/pages/` map directly to routes. Layouts in `src/layouts/` wrap pages via `<slot />`. Components in `src/components/` are reusable `.astro` files. Static assets go in `public/` (served at root) or `src/assets/` (processed by Astro).

## Design

Follow [DESIGN.md](DESIGN.md) for any visual change: one amber accent on a light shaft-gray page, black only inside the observation window, BIZ UD Gothic throughout, left-aligned layout, one bold element per page, no gradients/glow/card grids. Tokens live in `src/layouts/Layout.astro`; keep DESIGN.md and the tokens in sync.
