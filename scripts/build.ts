import { createHash } from "node:crypto";
import { readdir, readFile, rm, writeFile, cp } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = "dist";
const PUBLIC_DIR = "public";
const FONTS_DIR = "src/assets/fonts";
const HASH_LENGTH = 8;

/** Fonts the first screen draws with; everything else loads on demand when a glyph needs it. */
const CRITICAL_FONTS = [
  "eb-garamond-latin-wght-normal",
  "cinzel-latin-wght-normal",
  "instrument-sans-latin-wght-normal",
  "ibm-plex-mono-latin-500-normal",
];

/**
 * Bun inlines every url() asset into the stylesheet as base64. Fonts stay external so the browser
 * fetches only the faces the page uses, in parallel with the script.
 */
const keepFontsExternal: Bun.BunPlugin = {
  name: "keep-fonts-external",
  setup(build) {
    build.onResolve({ filter: /\.woff2$/ }, ({ path }) => ({ path, external: true }));
  },
};

async function replaceInFiles(files: string[], from: string, to: string): Promise<void> {
  await Promise.all(
    files.map(async (file) => {
      const path = join(OUT_DIR, file);
      const text = await readFile(path, "utf8");
      if (text.includes(from)) await writeFile(path, text.replaceAll(from, to));
    }),
  );
}

/**
 * Copies the fonts into the output under content-hashed names, so they can be cached forever, and
 * returns the hashed file names keyed by their original names.
 */
async function copyHashedFonts(referrers: string[]): Promise<Map<string, string>> {
  const hashed = new Map<string, string>();
  const fonts = (await readdir(FONTS_DIR)).filter((file) => file.endsWith(".woff2"));
  for (const file of fonts) {
    const bytes = await readFile(join(FONTS_DIR, file));
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, HASH_LENGTH);
    const name = file.replace(".woff2", `-${hash}.woff2`);
    await cp(join(FONTS_DIR, file), join(OUT_DIR, name));
    await replaceInFiles(referrers, file, name);
    hashed.set(file.replace(".woff2", ""), name);
  }
  return hashed;
}

async function preloadCriticalFonts(fontNames: Map<string, string>): Promise<void> {
  const tags = CRITICAL_FONTS.map((font) => {
    const file = fontNames.get(font);
    if (!file) throw new Error(`Critical font is missing: ${font}`);
    return `<link rel="preload" href="./${file}" as="font" type="font/woff2" crossorigin>`;
  }).join("");
  const indexPath = join(OUT_DIR, "index.html");
  const html = await readFile(indexPath, "utf8");
  await writeFile(indexPath, html.replace("</head>", `${tags}</head>`));
}

await rm(OUT_DIR, { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: ["./index.html"],
  outdir: OUT_DIR,
  minify: true,
  splitting: true,
  publicPath: "./",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [keepFontsExternal],
});

if (!result.success) {
  result.logs.forEach((log) => console.error(log));
  process.exit(1);
}

await cp(PUBLIC_DIR, OUT_DIR, { recursive: true });

const stylesheets = (await readdir(OUT_DIR)).filter((file) => file.endsWith(".css"));
const fontNames = await copyHashedFonts(stylesheets);
await preloadCriticalFonts(fontNames);
console.log(`Built ${result.outputs.length} files into ${OUT_DIR}/`);
