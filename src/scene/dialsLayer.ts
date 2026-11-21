import { AXIS_Y, DIAL_COUNT, DIAL_LEFT, DIAL_PITCH } from "../drawings/cryptex";
import { clamp, ease } from "../engine/math";
import { INK } from "../engine/shading";
import type { Layer } from "./layer";

const WORD = "COUNCIL";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/** How far, in letters, each dial starts from its final letter. */
const INITIAL_SPIN = [-17, 21, -12, 25, -20, 15, -23];
const CANVAS_SCALE = 2;
const DRAWING_WIDTH = 220;
const DRAWING_HEIGHT = 260;
const DIAL_RADIUS = 44;
const LETTER_ANGLE_STEP = 0.4;
const MAX_VISIBLE_ANGLE = 1.25;
const FOCUS_ANGLE = 0.2;
/** Camera positions between which the dials spin into place. */
const SPIN_START = 3.3;
const SPIN_SPAN = 1.5;

export interface DialsLayer extends Layer {
  /** Forces a repaint, e.g. once the dial font has loaded. */
  invalidate(): void;
}

function drawLetters(ctx: CanvasRenderingContext2D, progress: number): void {
  ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0);
  ctx.clearRect(0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  for (let dial = 0; dial < DIAL_COUNT; dial++) {
    const settled = ease(clamp(progress * 1.3 - dial * 0.05));
    const position = WORD.charCodeAt(dial) - 65 + (1 - settled) * INITIAL_SPIN[dial]!;
    const nearest = Math.round(position);
    for (let letter = nearest - 4; letter <= nearest + 4; letter++) {
      const angle = (letter - position) * LETTER_ANGLE_STEP;
      if (Math.abs(angle) > MAX_VISIBLE_ANGLE) continue;
      const squash = Math.cos(angle);
      const inFocus = Math.abs(angle) < FOCUS_ANGLE;
      ctx.save();
      ctx.globalAlpha = inFocus ? 1 : 0.5 * squash * squash;
      ctx.font = inFocus ? '700 14px "IBM Plex Mono",monospace' : '400 10px "IBM Plex Mono",monospace';
      ctx.translate(DIAL_LEFT + dial * DIAL_PITCH + DIAL_PITCH / 2, AXIS_Y + DIAL_RADIUS * Math.sin(angle));
      ctx.scale(1, squash);
      ctx.fillText(ALPHABET[((letter % 26) + 26) % 26]!, 0, 4.5);
      ctx.restore();
    }
  }
}

/** The dials of the cryptex turn as you scroll, each settling a little after the last, ending on COUNCIL. */
export function createDialsLayer(canvas: HTMLCanvasElement): DialsLayer {
  const ctx = canvas.getContext("2d")!;
  let drawnProgress = -1;

  return {
    update(camera) {
      const progress = ease(clamp((camera - SPIN_START) / SPIN_SPAN));
      if (progress === drawnProgress) return;
      drawnProgress = progress;
      drawLetters(ctx, progress);
    },
    invalidate() {
      drawnProgress = -1;
    },
  };
}
