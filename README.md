# council.cx site

React + TypeScript app, managed and built with [Bun](https://bun.sh) (no Vite: Bun's HTML entry point,
dev server and bundler cover everything needed). The build is a static `dist/` folder deployable to any static host.

    bun install
    bun run dev          # dev server with hot reload, http://localhost:3000
    bun run typecheck    # tsc --noEmit, strict
    bun run build        # static site into dist/
    bun run preview      # serves dist/ at http://localhost:4173 (PORT to override)

## Structure

    index.html            entry: meta tags, favicon, #root
    src/main.tsx, App.tsx mounts the page, imports the stylesheets
    src/components/       one component per page section and UI part
                          (Header, Sky, Floor, Copy > Introduction / ChapterSection, ScrollHint, Reveal)
    src/content/          typed content: chapters (copy), world layout, pen drawing data
    src/scene/            scroll-driven scene: a smoothed camera drives small layers (ground, pen tracing,
                          copy reveal, sky, cryptex dials, meter, hint); `startScrollScene` wires them together
    src/drawings/         the procedural pen drawings baked into canvases (plate, flats, cryptex)
    src/engine/           sketch engine (seeded RNG, pen strokes, hatching and wash shading), canvas baking, sky paths
    src/hooks/            useScrollScene
    src/styles/           plain CSS split per area; design tokens live in tokens.css
    src/assets/fonts/     self-hosted woff2 + fonts.css (served offline; copied beside the CSS in dist/)
    scripts/              build.ts and preview.ts

React renders the markup once; the 60fps scroll loop updates styles imperatively on those elements, which is
why the scene code lives outside React state. Copy that fades with scroll is wrapped in `Reveal`.

Fonts: Cinzel, EB Garamond, Instrument Sans, IBM Plex Mono, Cormorant Garamond (SIL OFL, via Fontsource).
