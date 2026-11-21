import { rect } from "../engine/geometry";
import { getContext, line, poly } from "../engine/pen";
import { randomBetween } from "../engine/random";
import { fillPolygon, hatch, INK, PAPER, wash, washGradient } from "../engine/shading";
import type { Polygon } from "../types";

export function groundMarks(x0: number, x1: number, y: number): void {
  for (let x = x0; x < x1; x += randomBetween(5, 9)) {
    line(x, y + 2, x - randomBetween(3, 6), y + randomBetween(6, 10), { w: 0.8, a: 0.35, n: 1, ov: 0 });
  }
}

export function label(text: string, x: number, y: number, size: number, alpha = 0.8): void {
  const ctx = getContext();
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `italic ${size}px "Cormorant Garamond",Georgia,serif`;
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** An oblique block: lit left face, shaded right face, tone on top, shadow cast on the ground. */
export function box3(x: number, y: number, w: number, h: number, depth: number): void {
  const dx = depth * 0.85;
  const dy = depth * 0.5;
  const front: Polygon = [[x, y], [x + w, y], [x + w, y - h], [x, y - h]];
  const side: Polygon = [[x + w, y], [x + w + dx, y - dy], [x + w + dx, y - h - dy], [x + w, y - h]];
  const top: Polygon = [[x, y - h], [x + w, y - h], [x + w + dx, y - h - dy], [x + dx, y - h - dy]];
  const shadowLength = Math.min(h * 0.5, 70);
  const shadow: Polygon = [[x + w, y], [x + w + dx, y - dy], [x + w + dx + shadowLength, y - dy], [x + w + shadowLength * 0.9, y]];
  wash(shadow, 0.2, 0);
  hatch(shadow, -55, 3.2, { a: 0.38, w: 0.6 });
  [top, front, side].forEach((face) => fillPolygon(face, PAPER));
  wash(top, 0.05, 0.05);
  washGradient(front, x, y, x + w, y, 0.06, 0.2);
  wash(side, 0.3, 0.1);
  hatch(front, 90, 4.4, { a: 0.3, tone: (t) => 0.15 + 0.85 * t * t });
  hatch(side, 62, 3, { a: 0.55 });
  hatch(side, -28, 3.8, { a: 0.32, tone: (t) => 0.3 + 0.7 * t });
  hatch(top, 14, 7, { a: 0.2 });
  poly(front, true, { w: 1.7, a: 0.95 });
  poly(side, true, { w: 1.6, a: 0.95 });
  poly(top, true, { w: 1.5, a: 0.9 });
  line(x, y, x + w, y, { w: 2.2, a: 0.9, n: 1 });
}

/** A sunken pit: floor, plus hatched walls seen in perspective. `strength` scales every tone. */
export function pit(x: number, y: number, w: number, h: number, depth: number, strength = 1): void {
  const k = strength;
  const innerX = x + depth;
  const innerY = y + depth * 0.8;
  const innerW = w - depth * 2;
  const innerH = h - depth * 1.6;
  const floor = rect(innerX, innerY, innerW, innerH);
  const backWall: Polygon = [[x, y], [x + w, y], [x + w - depth, innerY], [innerX, innerY]];
  const leftWall: Polygon = [[x, y], [innerX, innerY], [innerX, innerY + innerH], [x, y + h]];
  const rightWall: Polygon = [[x + w, y], [x + w - depth, innerY], [x + w - depth, innerY + innerH], [x + w, y + h]];
  wash(floor, 0.16 * k, 0.1 * k);
  hatch(floor, -30, 6, { a: 0.2 * k });
  wash(backWall, 0.32 * k, 0.12 * k);
  hatch(backWall, 45, 2.4, { a: 0.62 * k });
  wash(leftWall, 0.22 * k, 0.08 * k);
  hatch(leftWall, 90, 3, { a: 0.48 * k });
  wash(rightWall, 0.12 * k, 0);
  hatch(rightWall, 90, 5, { a: 0.28 * k });
  poly(rect(x, y, w, h), true, { w: 2.4 * (0.5 + k / 2), n: 3 });
  poly(floor, true, { w: 1.4 * (0.5 + k / 2) });
  const corners: Array<[number, number, number, number]> = [
    [x, y, innerX, innerY],
    [x + w, y, innerX + innerW, innerY],
    [x + w, y + h, innerX + innerW, innerY + innerH],
    [x, y + h, innerX, innerY + innerH],
  ];
  corners.forEach(([x1, y1, x2, y2]) => line(x1, y1, x2, y2, { w: 1.4 * (0.5 + k / 2) }));
}
