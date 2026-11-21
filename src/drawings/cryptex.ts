import { ellipsePolygon, rect } from "../engine/geometry";
import { arc, getContext, line } from "../engine/pen";
import { TAU } from "../engine/random";
import { fillPolygon, hatch, PAPER, wash, washGradient } from "../engine/shading";
import { box3, groundMarks } from "./primitives";

export const AXIS_Y = 170;
export const DIAL_COUNT = 7;
export const DIAL_PITCH = 17;
export const DIAL_LEFT = 44;
const COBALT = "#2b86d1";

interface BandOptions {
  alphaTop?: number;
  alphaBottom?: number;
  hatchAlpha?: number;
}

/** A turned cylinder seen from the side, shaded darker towards the bottom. */
function band(x1: number, x2: number, radius: number, { alphaTop = 0.02, alphaBottom = 0.4, hatchAlpha = 0.5 }: BandOptions = {}): void {
  const top = AXIS_Y - radius;
  const bottom = AXIS_Y + radius;
  const body = rect(x1, top, x2 - x1, 2 * radius);
  fillPolygon(body, PAPER);
  washGradient(body, 0, top, 0, bottom, alphaTop, alphaBottom);
  hatch(body, 0, 2.2, { a: hatchAlpha, tone: (t) => Math.min(1, t * t * 1.15) });
  line(x1, top, x2, top, { w: 1.3 });
  line(x1, bottom, x2, bottom, { w: 1.4 });
  line(x1, top, x1, bottom, { w: 1.3 });
  line(x2, top, x2, bottom, { w: 1.3 });
}

function endCapEllipse(cx: number, rx: number, ry: number, washAlpha: number): void {
  const face = ellipsePolygon(cx, AXIS_Y, rx, ry);
  fillPolygon(face, PAPER);
  wash(face, washAlpha, 0.1);
  arc(cx, AXIS_Y, rx, ry, 0, TAU, { w: 1.4 });
}

function scrollwork(x: number): void {
  for (let row = 0; row < 4; row++) {
    const y = 140 + row * 20;
    arc(x, y, 6, 6, 0, TAU * 0.85, { w: 0.9 });
    arc(x, y, 2.5, 2.5, 0, TAU * 0.85, { w: 0.8 });
  }
}

function cobaltBead(): void {
  const ctx = getContext();
  ctx.globalAlpha = 1;
  ctx.fillStyle = COBALT;
  ctx.beginPath();
  ctx.arc(207, AXIS_Y, 9, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(20,17,15,.85)";
  ctx.lineWidth = 1.3;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.55)";
  ctx.beginPath();
  ctx.arc(204, AXIS_Y - 3, 2.5, 0, TAU);
  ctx.fill();
}

/** The cryptex, standing on y = 250 in a 220 x 260 canvas. The dial letters live on a separate canvas. */
export function drawCryptex(): void {
  groundMarks(14, 204, 250);
  wash(ellipsePolygon(112, 253, 92, 7), 0.2, 0);
  box3(50, 250, 26, 30, 14);
  box3(146, 250, 26, 30, 14);
  for (let i = 0; i < DIAL_COUNT; i++) {
    const x = DIAL_LEFT + i * DIAL_PITCH;
    band(x, x + DIAL_PITCH, 44, { hatchAlpha: 0.35, alphaBottom: 0.34 });
  }
  [44, 61, 78, 95, 112, 129, 146, 163].forEach((x) => line(x, AXIS_Y - 46, x, AXIS_Y + 46, { w: 1.1, a: 0.8, n: 1 }));
  line(44, AXIS_Y - 6, 163, AXIS_Y - 6, { w: 0.7, a: 0.5, n: 1, ov: 0 });
  line(44, AXIS_Y + 8, 163, AXIS_Y + 8, { w: 0.7, a: 0.5, n: 1, ov: 0 });

  endCapEllipse(14, 8, 40, 0.45);
  arc(14, AXIS_Y, 3, 22, 0, TAU, { w: 0.9, a: 0.6 });
  band(14, 44, 40, { alphaTop: 0.1, alphaBottom: 0.55, hatchAlpha: 0.6 });
  band(40, 48, 47, { alphaTop: 0.1, alphaBottom: 0.5 });
  scrollwork(29);

  band(163, 171, 47, { alphaTop: 0.1, alphaBottom: 0.5 });
  band(171, 196, 40, { alphaTop: 0.1, alphaBottom: 0.55, hatchAlpha: 0.6 });
  scrollwork(183);
  band(196, 208, 22, { alphaTop: 0.06, alphaBottom: 0.4 });
  endCapEllipse(208, 6, 22, 0.4);
  cobaltBead();
}
