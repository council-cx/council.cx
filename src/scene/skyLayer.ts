import { clamp, ease } from "../engine/math";
import { prefersReducedMotion, type Layer } from "./layer";

/** Camera position beyond which the intro sketch stops animating. */
const INTRO_ACTIVE_UNTIL = 1.1;

const DRAW_SECONDS = 2.75;
const HOLD_SECONDS = 0.8;
const ERASE_SECONDS = 1.6;
const REST_SECONDS = 0.5;
const CYCLE_SECONDS = DRAW_SECONDS + HOLD_SECONDS + ERASE_SECONDS + REST_SECONDS;
const START_DELAY_MS = 400;
/** The intro sketch is made of two pen passes. */
const INTRO_PASSES = 2;

function easeInOut(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

/** Dash offset of the sketch at `seconds` into the loop: drawn, held, then rubbed out from the start. */
function introDashOffset(seconds: number): number {
  const cycle = seconds % CYCLE_SECONDS;
  if (cycle < DRAW_SECONDS) return 1 - easeInOut(cycle / DRAW_SECONDS);
  if (cycle < DRAW_SECONDS + HOLD_SECONDS) return 0;
  if (cycle < DRAW_SECONDS + HOLD_SECONDS + ERASE_SECONDS) return -easeInOut((cycle - DRAW_SECONDS - HOLD_SECONDS) / ERASE_SECONDS);
  return 1;
}

/** Writes a style value only when it changed, so settled drawings cost no style recalculation. */
function writeOnce(cache: Map<string, string>, key: string, value: string, write: (value: string) => void): void {
  if (cache.get(key) === value) return;
  cache.set(key, value);
  write(value);
}

/** Each sky drawing is drawn on as its chapter approaches, then fades once it has been read. */
export function createSkyLayer(sky: SVGSVGElement): Layer {
  const [intro, ...chapterDrawings] = [...sky.querySelectorAll<SVGGElement>("g")];
  if (!intro) throw new Error("The sky has no drawings");
  const introPaths = [...intro.querySelectorAll("path")].slice(0, INTRO_PASSES);
  const introLoops = introPaths.length >= INTRO_PASSES && !prefersReducedMotion;
  const written = new Map<string, string>();
  let camera = 0;
  let introStartedAt: number | null = null;
  let lastIntroOffset = "";

  return {
    update(current) {
      camera = current;
      chapterDrawings.forEach((drawing, index) => {
        const chapter = index + 1;
        writeOnce(written, `d${index}`, ease(clamp((camera - (chapter - 0.75)) / 0.85)).toFixed(3), (value) => drawing.style.setProperty("--d", value));
        writeOnce(written, `o${index}`, (1 - ease(clamp((camera - (chapter + 0.35)) / 0.6))).toFixed(3), (value) => (drawing.style.opacity = value));
      });
      writeOnce(written, "intro", (1 - ease(clamp((camera - 0.25) / 0.6))).toFixed(3), (value) => (intro.style.opacity = value));
    },
    /** Plays the first sketch on a gentle loop while the camera is near the start. */
    tick(now) {
      if (!introLoops || camera > INTRO_ACTIVE_UNTIL) {
        introStartedAt = null;
        return false;
      }
      introStartedAt ??= now + START_DELAY_MS;
      const offset = introDashOffset(Math.max(0, (now - introStartedAt) / 1000)).toFixed(4);
      if (offset !== lastIntroOffset) {
        lastIntroOffset = offset;
        introPaths.forEach((path) => (path.style.strokeDashoffset = offset));
      }
      return true;
    },
  };
}
