import type { Point } from "../types";
import { round1 } from "./math";
import { arc, curve, line, poly, recordStrokes, scribble, type Stroke } from "./pen";
import { setSeed, TAU } from "./random";

/*
 * The sky: pen constructions and marginal notes in a 390 x 460 view box,
 * recorded as SVG paths so they can be drawn on as the page scrolls.
 */

export interface SkyPath {
  d: string;
  strokeWidth: number;
  opacity: number;
}

const SKY_SEED = 31;
const STROKE_WIDTH_SCALE = 0.85;
const STROKE_OPACITY_SCALE = 0.62;

/** The intro: corner arcs, crop marks, a bat-wing flying machine, notes. */
function drawIntro(): void {
  arc(390, -8, 128, 128, Math.PI / 2, Math.PI, { w: 1.2 });
  arc(390, -8, 60, 60, 0, TAU, { w: 1 });
  line(390, -8, 296, 74, { w: 1 });
  line(18, 168, 30, 168, { w: 1, n: 1 });
  line(24, 162, 24, 174, { w: 1, n: 1 });
  line(360, 330, 372, 330, { w: 1, n: 1 });
  line(366, 324, 366, 336, { w: 1, n: 1 });
  const mirror = (p: Point): Point => [390 - p[0], p[1] + 86];
  const hub: Point = [172, 30];
  const ends = [0, 1, 2, 3, 4, 5, 6].map((i): Point => {
    const angle = ((10 + i * 11) * Math.PI) / 180;
    return [hub[0] - 170 * Math.cos(angle), hub[1] + 64 * Math.sin(angle)];
  });
  ends.forEach((end) => line(...mirror(hub), ...mirror(end), { w: 1, n: 1, ov: 0 }));
  for (let i = 0; i < ends.length - 1; i++) {
    const a = ends[i]!;
    const b = ends[i + 1]!;
    curve(mirror(a), mirror([(a[0] + b[0]) / 2 + 4, (a[1] + b[1]) / 2 - 9]), mirror(b), { w: 1 });
  }
  curve(mirror(hub), mirror([hub[0] - 64, hub[1] - 30]), mirror(ends[0]!), { w: 1.1 });
  scribble(22, 262, 130, 4, 8);
}

function drawCircleInCross(): void {
  arc(300, 262, 112, 112);
  line(300, 130, 300, 394);
  line(168, 262, 432, 262);
  line(222, 183, 378, 341);
  line(378, 183, 222, 341);
  scribble(20, 232, 120, 5, 8);
}

function drawPentagon(): void {
  const pentagon: Point[] = [[80, 144], [166, 206], [133, 306], [27, 306], [-6, 206]];
  poly(pentagon);
  arc(80, 238, 96, 96);
  pentagon.forEach((p) => line(80, 238, p[0], p[1], { n: 1 }));
  scribble(232, 196, 130, 5, 8);
}

function drawArch(): void {
  const dy = -40;
  arc(195, 340 + dy, 155, 155, Math.PI, TAU);
  arc(195, 340 + dy, 125, 125, Math.PI, TAU);
  line(40, 366 + dy, 350, 366 + dy);
  line(40, 358 + dy, 40, 374 + dy, { n: 1 });
  line(350, 358 + dy, 350, 374 + dy, { n: 1 });
  line(195, 185 + dy, 195, 340 + dy);
  scribble(252, 196, 110, 4, 8);
}

function drawThreeCircles(): void {
  const dy = -30;
  [70, 195, 320].forEach((x) => {
    arc(x, 300 + dy, 34, 34);
    line(x, 230 + dy, x, 266 + dy, { n: 1 });
  });
  line(104, 300 + dy, 161, 300 + dy);
  line(229, 300 + dy, 286, 300 + dy);
  scribble(24, 196, 130, 4, 8);
}

function drawSquareInCircle(): void {
  const dy = -34;
  poly([[60, 110 + dy], [330, 110 + dy], [330, 380 + dy], [60, 380 + dy]]);
  arc(195, 245 + dy, 135, 135);
  arc(195, 245 + dy, 96, 96);
  line(195, 90 + dy, 195, 400 + dy);
  line(40, 245 + dy, 350, 245 + dy);
  scribble(24, 196, 90, 4, 8);
}

const SKY_DRAWINGS = [drawIntro, drawCircleInCross, drawPentagon, drawArch, drawThreeCircles, drawSquareInCircle];

function toPathData(points: Point[]): string {
  const first = points[0]!;
  const last = points[points.length - 1]!;
  let d = `M${round1(first[0])} ${round1(first[1])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i]!;
    const next = points[i + 1]!;
    d += `Q${round1(p[0])} ${round1(p[1])} ${round1((p[0] + next[0]) / 2)} ${round1((p[1] + next[1]) / 2)}`;
  }
  return d + `L${round1(last[0])} ${round1(last[1])}`;
}

function toSkyPath({ points, width, alpha }: Stroke): SkyPath {
  return {
    d: toPathData(points),
    strokeWidth: round1(width * STROKE_WIDTH_SCALE),
    opacity: round1(alpha * STROKE_OPACITY_SCALE),
  };
}

/** One list of paths per sky drawing, in chapter order. */
export function recordSkyDrawings(): SkyPath[][] {
  setSeed(SKY_SEED);
  return SKY_DRAWINGS.map((draw) => recordStrokes(draw).map(toSkyPath));
}
