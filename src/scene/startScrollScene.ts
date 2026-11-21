import { CHAPTER_NAMES } from "../content/chapters";
import { bakeInFrames, type BakeJob } from "../engine/bake";
import { clamp } from "../engine/math";
import { createDialsLayer } from "./dialsLayer";
import { createGroundLayer } from "./groundLayer";
import { createHintLayer } from "./hintLayer";
import { prefersReducedMotion, requireElement, type Layer } from "./layer";
import { createMeterLayer } from "./meterLayer";
import { GROUND_ITEMS } from "./model";
import { createPenTracingLayer } from "./penTracingLayer";
import { createRevealLayer } from "./revealLayer";
import { createSkyLayer } from "./skyLayer";

const LAST_CHAPTER = CHAPTER_NAMES.length - 1;
/** Reference viewport width the scene is composed for. */
const DESIGN_WIDTH = 390;
const MAX_SPREAD = 2.4;
const MAX_SIZE = 1.7;
/** Rate at which the camera catches up with the scroll position. */
const SMOOTHING = 7;
const MAX_FRAME_SECONDS = 0.05;
const SETTLED_DISTANCE = 0.0004;
const DIALS_FONT = '700 14px "IBM Plex Mono"';

function bakeJobs(ground: HTMLElement): BakeJob[] {
  return GROUND_ITEMS.flatMap((item, i) => {
    if (item.kind !== "baked") return [];
    const canvas = requireElement<HTMLCanvasElement>(ground.children[i]!, "canvas");
    return [{ canvas, distance: item.distance, ...item.canvas }];
  });
}

/**
 * Wires the page together: scrolling moves a smoothed camera along the road, and each layer
 * redraws itself from the camera position. Returns a function that tears everything down.
 */
export function startScrollScene(track: HTMLElement): () => void {
  const stage = requireElement<HTMLElement>(track, ".stage");
  const ground = requireElement<HTMLElement>(track, ".ground");
  const dials = createDialsLayer(requireElement<HTMLCanvasElement>(track, "canvas.lt"));
  const layers: Layer[] = [
    createGroundLayer(ground, GROUND_ITEMS),
    createPenTracingLayer(ground, GROUND_ITEMS),
    createRevealLayer(requireElement(track, ".copy")),
    createSkyLayer(requireElement<SVGSVGElement>(track, ".sky")),
    dials,
    createMeterLayer(requireElement(track, ".meter"), CHAPTER_NAMES),
    createHintLayer(requireElement(track, ".hint")),
  ];

  let maxScroll = 1;
  let camera = 0;
  let renderedCamera = NaN;
  let frameRequest = 0;
  let lastFrameTime = 0;
  let resizeRequest = 0;
  let measuredSize = "";

  const targetCamera = () => clamp(scrollY / maxScroll) * LAST_CHAPTER;
  const render = () => {
    if (camera === renderedCamera) return;
    renderedCamera = camera;
    layers.forEach((layer) => layer.update(camera));
  };

  /** One loop drives everything: the smoothed camera, then any time-based layer animation. */
  const frame = (now: number) => {
    const elapsed = Math.min(MAX_FRAME_SECONDS, (now - lastFrameTime) / 1000);
    lastFrameTime = now;
    const target = targetCamera();
    camera = prefersReducedMotion ? target : camera + (target - camera) * (1 - Math.exp(-elapsed * SMOOTHING));
    if (Math.abs(target - camera) < SETTLED_DISTANCE) camera = target;
    render();
    const animating = layers.reduce((busy, layer) => (layer.tick?.(now) ?? false) || busy, false);
    frameRequest = camera !== target || animating ? requestAnimationFrame(frame) : 0;
  };

  const startFrames = () => {
    if (frameRequest) return;
    lastFrameTime = performance.now();
    frameRequest = requestAnimationFrame(frame);
  };

  const measure = () => {
    // Mobile browsers fire resize as the address bar collapses; only a real size change needs measuring.
    const size = `${innerWidth}x${innerHeight}`;
    if (size === measuredSize) return;
    measuredSize = size;
    maxScroll = Math.max(1, track.offsetHeight - stage.offsetHeight);
    const root = document.documentElement;
    root.style.setProperty("--s", clamp(innerWidth / DESIGN_WIDTH, 1, MAX_SPREAD).toFixed(3));
    root.style.setProperty("--k", clamp(innerWidth / DESIGN_WIDTH, 1, MAX_SIZE).toFixed(3));
    camera = targetCamera();
    render();
    startFrames();
  };

  const onResize = () => {
    cancelAnimationFrame(resizeRequest);
    resizeRequest = requestAnimationFrame(measure);
  };

  const stopBaking = bakeInFrames(bakeJobs(ground));
  document.fonts
    .load(DIALS_FONT)
    .then(() => {
      dials.invalidate();
      renderedCamera = NaN;
      render();
    })
    .catch(() => {});

  addEventListener("scroll", startFrames, { passive: true });
  addEventListener("resize", onResize, { passive: true });
  measure();

  return () => {
    stopBaking();
    cancelAnimationFrame(frameRequest);
    removeEventListener("scroll", startFrames);
    removeEventListener("resize", onResize);
    cancelAnimationFrame(resizeRequest);
    layers.forEach((layer) => layer.dispose?.());
  };
}
