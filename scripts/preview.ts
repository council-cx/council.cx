import { join, normalize } from "node:path";

const DIST_DIR = "dist";
const PORT = Number(process.env.PORT ?? 4173);
const HASHED_ASSET = /-[a-z0-9]{8}\.(js|css|woff2)$/;
const IMMUTABLE = "public, max-age=31536000, immutable";

const server = Bun.serve({
  port: PORT,
  async fetch(request) {
    const { pathname } = new URL(request.url);
    const requested = pathname === "/" ? "/index.html" : pathname;
    const file = Bun.file(join(DIST_DIR, normalize(requested)));
    if (!(await file.exists())) return new Response("Not found", { status: 404 });
    // Hashed files never change, so browsers may keep them forever; the page itself is always revalidated.
    return new Response(file, { headers: { "Cache-Control": HASHED_ASSET.test(requested) ? IMMUTABLE : "no-cache" } });
  },
});

console.log(`Previewing ${DIST_DIR}/ at ${server.url}`);
