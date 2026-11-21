import type { Box, Polygon } from "../types";
import { line, getContext } from "./pen";
import { random, randomBetween } from "./random";

export const INK = "#3b2a1e";
export const PAPER = "rgb(237,226,198)";
const WASH = "138,92,44";

/** Tone along a hatching normal: 0 is bare paper, 1 is full strength. */
type ToneCurve = (t: number) => number;

export interface HatchOptions {
  w?: number;
  a?: number;
  trim?: number;
  tone?: ToneCurve;
  j?: number;
}

/** Lines run at `angle` degrees; the tone curve varies along the normal (sin, -cos). */
export function hatch(polygon: Polygon, angle: number, spacing: number, options: HatchOptions = {}): void {
  const { w = 0.7, a = 0.5, trim = 2, tone = null, j = 0.45 } = options;
  const theta = (angle * Math.PI) / 180;
  const ux = Math.cos(theta);
  const uy = Math.sin(theta);
  const nx = uy;
  const ny = -ux;
  let min = 1e9;
  let max = -1e9;
  polygon.forEach((p) => {
    const d = p[0] * nx + p[1] * ny;
    min = Math.min(min, d);
    max = Math.max(max, d);
  });
  for (let d = min + spacing * randomBetween(0.3, 0.9); d < max; d += spacing * randomBetween(0.8, 1.2)) {
    if (tone && random() > tone((d - min) / (max - min))) continue;
    const hits: Polygon = [];
    for (let i = 0; i < polygon.length; i++) {
      const from = polygon[i]!;
      const to = polygon[(i + 1) % polygon.length]!;
      const distFrom = from[0] * nx + from[1] * ny - d;
      const distTo = to[0] * nx + to[1] * ny - d;
      if (distFrom * distTo < 0) {
        const t = distFrom / (distFrom - distTo);
        hits.push([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]);
      }
    }
    if (hits.length < 2) continue;
    hits.sort((p, q) => p[0] * ux + p[1] * uy - (q[0] * ux + q[1] * uy));
    const start = hits[0]!;
    const end = hits[hits.length - 1]!;
    if (Math.hypot(end[0] - start[0], end[1] - start[1]) < 4) continue;
    const trimStart = randomBetween(0, trim);
    const trimEnd = randomBetween(0, trim);
    line(start[0] + ux * trimStart, start[1] + uy * trimStart, end[0] - ux * trimEnd, end[1] - uy * trimEnd, { w, a, j, n: 1, ov: 0 });
  }
}

/** Hatching inside any clip path (rings, circles). */
export function clipHatch(
  tracePath: () => void,
  [x0, y0, x1, y1]: Box,
  angle: number,
  spacing: number,
  options: { w?: number; a?: number; tone?: ToneCurve } = {},
): void {
  const ctx = getContext();
  ctx.save();
  ctx.beginPath();
  tracePath();
  ctx.clip("evenodd");
  const theta = (angle * Math.PI) / 180;
  const ux = Math.cos(theta);
  const uy = Math.sin(theta);
  const nx = uy;
  const ny = -ux;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const radius = Math.hypot(x1 - x0, y1 - y0) / 2;
  for (let d = -radius; d < radius; d += spacing * randomBetween(0.85, 1.15)) {
    if (options.tone && random() > options.tone((d + radius) / (2 * radius))) continue;
    const px = cx + nx * d;
    const py = cy + ny * d;
    line(px - ux * radius, py - uy * radius, px + ux * radius, py + uy * radius, { w: options.w ?? 0.7, a: options.a ?? 0.5, j: 0.4, n: 1, ov: 0 });
  }
  ctx.restore();
}

function tracePolygon(polygon: Polygon): void {
  const ctx = getContext();
  polygon.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.closePath();
}

export function fillPolygon(polygon: Polygon, color: string): void {
  const ctx = getContext();
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  tracePolygon(polygon);
  ctx.fill();
}

/** A sepia wash with a darker wet edge. */
export function wash(polygon: Polygon, alpha: number, edge = 0.09): void {
  const ctx = getContext();
  fillPolygon(polygon, `rgba(${WASH},${alpha})`);
  if (!edge) return;
  ctx.save();
  ctx.beginPath();
  tracePolygon(polygon);
  ctx.clip();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 6;
  ctx.strokeStyle = `rgba(90,58,28,${edge})`;
  ctx.stroke();
  ctx.restore();
}

export function washGradient(polygon: Polygon, x0: number, y0: number, x1: number, y1: number, alphaStart: number, alphaEnd: number): void {
  const ctx = getContext();
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, `rgba(${WASH},${alphaStart})`);
  gradient.addColorStop(1, `rgba(${WASH},${alphaEnd})`);
  ctx.globalAlpha = 1;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  tracePolygon(polygon);
  ctx.fill();
}

export function smudge(x: number, y: number, radius: number, alpha: number): void {
  const ctx = getContext();
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(${WASH},${alpha})`);
  gradient.addColorStop(1, `rgba(${WASH},0)`);
  ctx.globalAlpha = 1;
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, 2 * radius, 2 * radius);
}
