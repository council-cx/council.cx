import { ellipsePolygon, rect, traceEllipse } from "../engine/geometry";
import { arc, getContext, line, poly } from "../engine/pen";
import { randomBetween, TAU } from "../engine/random";
import { clipHatch, fillPolygon, hatch, PAPER, wash } from "../engine/shading";
import type { Point, Polygon } from "../types";
import { label, pit } from "./primitives";

/*
 * Flat drawings laid on the floor, 400 x 400.
 */

const COBALT = "#2b86d1";
const CENTER = 200;

function polarPoint(radius: number, angle: number): Point {
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)];
}

function quarterSegment(startAngle: number): Polygon {
  const points: Polygon = [];
  for (let i = 0; i <= 12; i++) points.push(polarPoint(190, startAngle + ((Math.PI / 2) * i) / 12));
  return points;
}

function degreeTicks(): void {
  for (let degrees = 0; degrees < 360; degrees += 5) {
    const angle = (degrees * Math.PI) / 180;
    const length = degrees % 30 ? 6 : 13;
    const from = polarPoint(192, angle);
    const to = polarPoint(192 + length, angle);
    line(from[0], from[1], to[0], to[1], { w: 0.8, a: 0.7, n: 1, ov: 0, j: 0.1 });
  }
}

function cobaltDot(): void {
  const ctx = getContext();
  ctx.globalAlpha = 1;
  ctx.fillStyle = COBALT;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, 8, 0, TAU);
  ctx.fill();
}

export function drawVitruvian(): void {
  [-Math.PI * 0.75, -Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.75].forEach((startAngle) => {
    const segment = quarterSegment(startAngle);
    wash(segment, 0.12, 0);
    hatch(segment, 45, 5.5, { a: 0.35, tone: (t) => 0.3 + 0.7 * t });
  });
  arc(CENTER, CENTER, 190, 190, 0, TAU, { w: 1.5 });
  pit(65.7, 65.7, 268.6, 268.6, 30, 0.2);
  pit(122, 122, 156, 156, 16, 0.2);
  arc(CENTER, CENTER, 134.3, 134.3, 0, TAU, { w: 1.4 });
  line(200, 0, 200, 400, { w: 1, a: 0.55 });
  line(0, 200, 400, 200, { w: 1, a: 0.55 });
  line(65.7, 65.7, 334.3, 334.3, { w: 0.9, a: 0.5 });
  line(334.3, 65.7, 65.7, 334.3, { w: 0.9, a: 0.5 });
  arc(CENTER, CENTER, 40, 40, 0, TAU, { w: 1.2 });
  degreeTicks();
  cobaltDot();
}

export function drawSpiral(): void {
  const squares: Array<[x: number, y: number, w: number, h: number]> = [
    [10, 83, 235, 235],
    [245, 83, 145, 145],
    [300, 228, 90, 90],
    [245, 263, 55, 55],
    [245, 228, 35, 35],
  ];
  squares.forEach(([x, y, w, h], i) => {
    if (i % 2) return;
    const square = rect(x, y, w, h);
    wash(square, 0.1, 0.06);
    hatch(square, i ? -40 : 55, 6, { a: 0.28 });
  });
  poly([[10, 83], [390, 83], [390, 318], [10, 318]], true, { w: 1.6 });
  line(245, 83, 245, 318, { w: 1.2 });
  line(245, 228, 390, 228, { w: 1.2 });
  line(300, 228, 300, 318, { w: 1.2 });
  line(245, 263, 300, 263, { w: 1.2 });
  line(280, 228, 280, 263, { w: 1.2 });
  const quarterArcs: Array<[cx: number, cy: number, r: number, from: number, to: number]> = [
    [245, 318, 235, Math.PI, Math.PI * 1.5],
    [245, 228, 145, Math.PI * 1.5, TAU],
    [300, 228, 90, 0, Math.PI / 2],
    [300, 263, 55, Math.PI / 2, Math.PI],
    [280, 263, 35, Math.PI, Math.PI * 1.5],
    [280, 248, 20, Math.PI * 1.5, TAU],
  ];
  quarterArcs.forEach(([cx, cy, r, from, to]) => arc(cx, cy, r, r, from, to, { w: 2.2, j: 0.3 }));
}

export function drawZk(): void {
  arc(CENTER, CENTER, 170, 170, 0, TAU, { w: 1.5 });
  const triangle: Polygon = [[200, 30], [347.2, 285], [52.8, 285]];
  wash(triangle, 0.08, 0.05);
  poly(triangle, true, { w: 1.6 });
  arc(CENTER, CENTER, 85, 85, 0, TAU, { w: 1.3 });
  line(200, 30, 200, 285, { w: 1 });
  const square = rect(155, 155, 90, 90);
  fillPolygon(square, PAPER);
  wash(square, 0.3, 0.15);
  hatch(square, 45, 2.6, { a: 0.6 });
  hatch(square, -45, 3.2, { a: 0.4 });
  poly(square, true, { w: 1.5 });
}

export function drawStones(): void {
  [70, 200, 330].forEach((y, i) => {
    const stone = ellipsePolygon(CENTER, y, 40, 40);
    fillPolygon(stone, PAPER);
    wash(stone, 0.2, 0.12);
    clipHatch(() => traceEllipse(CENTER, y, 40, 40), [160, y - 40, 240, y + 40], 50, 3, { a: 0.35, tone: (t) => t });
    arc(CENTER, y, 40, 40, 0, TAU, { w: 1.6 });
    label(String(i + 1), CENTER, y + 12, 36, 0.9);
  });
  [[112, 158], [242, 288]].forEach(([from, to]) => line(CENTER, from!, CENTER, to!, { w: 1.2, a: 0.7 }));
}

export function drawSeal(): void {
  arc(CENTER, CENTER, 190, 190, 0, TAU, { w: 1.6 });
  arc(CENTER, CENTER, 170, 170, 0, TAU, { w: 1.2 });
  arc(CENTER, CENTER, 110, 110, 0, TAU, { w: 1.4 });
  for (let degrees = 0; degrees < 360; degrees += 5) {
    const angle = (degrees * Math.PI) / 180;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const notch = degrees % 15 ? 0 : 6;
    line(200 + 112 * c, 200 + 112 * s, 200 + (150 + randomBetween(8, 18)) * c, 200 + (150 + randomBetween(8, 18)) * s, { w: 0.8, a: 0.5, n: 1, ov: 0, j: 0.1 });
    line(200 + (171 - notch) * c, 200 + (171 - notch) * s, 200 + 190 * c, 200 + 190 * s, { w: 0.8, a: 0.6, n: 1, ov: 0, j: 0.1 });
  }
  line(200, 90, 200, 310, { w: 1, a: 0.6 });
  line(90, 200, 310, 200, { w: 1, a: 0.6 });
}
