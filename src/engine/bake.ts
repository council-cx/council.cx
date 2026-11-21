import { bindCanvas } from "./pen";
import { setSeed } from "./random";
import { INK } from "./shading";

export interface BakeJob {
  canvas: HTMLCanvasElement;
  /** Distance ahead of the camera: nearer drawings are baked first. */
  distance: number;
  draw: () => void;
  /** Pixel density of the canvas relative to the drawing's own units. */
  scale: number;
  seed: number;
}

const FRAME_BUDGET_MS = 9;
const FONT_WAIT_MS = 1200;
const BAKED_CLASS = "rd";

function bake({ canvas, draw, scale, seed }: BakeJob): void {
  const ctx = canvas.getContext("2d")!;
  setSeed(seed);
  bindCanvas(ctx);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  draw();
  ctx.globalAlpha = 1;
  canvas.classList.add(BAKED_CLASS);
}

function whenLabelFontReady(): Promise<unknown> {
  const loaded = document.fonts.load('italic 20px "Cormorant Garamond"').catch(() => 0);
  const timeout = new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS));
  return Promise.race([loaded, timeout]);
}

/**
 * Bakes the nearest drawings first, a few milliseconds per frame, so the first paint never waits.
 * Returns a function that stops the work.
 */
export function bakeInFrames(jobs: BakeJob[]): () => void {
  const queue = [...jobs].sort((a, b) => a.distance - b.distance);
  let frame = 0;
  let cancelled = false;

  const bakeSome = () => {
    const start = performance.now();
    while (queue.length && performance.now() - start < FRAME_BUDGET_MS) bake(queue.shift()!);
    if (queue.length) frame = requestAnimationFrame(bakeSome);
  };

  void whenLabelFontReady().then(() => {
    if (!cancelled) frame = requestAnimationFrame(bakeSome);
  });

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
  };
}
