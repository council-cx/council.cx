import type { Point, Polygon } from "../types";
import { randomBetween, randomPhase, TAU } from "./random";

/*
 * The pen: strokes wobble, overshoot and are laid down twice, like a pen drawing.
 * Strokes are painted straight onto the bound canvas, or recorded so they can be
 * replayed as SVG paths.
 */

export interface Stroke {
  points: Point[];
  width: number;
  alpha: number;
}

export interface LineOptions {
  w?: number;
  a?: number;
  /** Wobble amplitude. */
  j?: number;
  /** Number of passes. */
  n?: number;
  /** Overshoot of the second pass. */
  ov?: number;
}

export interface ArcOptions {
  w?: number;
  a?: number;
  j?: number;
  n?: number;
  rot?: number;
}

let context: CanvasRenderingContext2D | null = null;
let recording: Stroke[] | null = null;

export function bindCanvas(target: CanvasRenderingContext2D): void {
  context = target;
}

export function getContext(): CanvasRenderingContext2D {
  if (!context) throw new Error("No canvas bound to the pen");
  return context;
}

export function recordStrokes(draw: () => void): Stroke[] {
  const strokes: Stroke[] = [];
  recording = strokes;
  draw();
  recording = null;
  return strokes;
}

function emit(points: Point[], width: number, alpha: number): void {
  if (points.length < 2) return;
  if (recording) {
    recording.push({ points, width, alpha });
    return;
  }
  const ctx = getContext();
  const first = points[0]!;
  const last = points[points.length - 1]!;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(first[0], first[1]);
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i]!;
    const next = points[i + 1]!;
    ctx.quadraticCurveTo(p[0], p[1], (p[0] + next[0]) / 2, (p[1] + next[1]) / 2);
  }
  ctx.lineTo(last[0], last[1]);
  ctx.stroke();
}

function passWidth(width: number, pass: number): number {
  return width * (pass ? 0.7 : 1) * randomBetween(0.9, 1.1);
}

/** A hand-drawn line: low-frequency wobble, overshooting second pass. */
export function line(x1: number, y1: number, x2: number, y2: number, options: LineOptions = {}): void {
  const { w = 1.2, a = 0.85, j = 0.7, n = 2, ov = 2 } = options;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const nx = -uy;
  const ny = ux;
  for (let pass = 0; pass < n; pass++) {
    const start = pass ? randomBetween(-ov, ov * 0.6) : 0;
    const end = pass ? randomBetween(-ov * 0.6, ov) : 0;
    const steps = Math.max(2, Math.round(length / 12));
    const phase1 = randomPhase();
    const phase2 = randomPhase();
    const freq1 = randomBetween(0.015, 0.04);
    const freq2 = randomBetween(0.05, 0.1);
    const points: Point[] = [];
    for (let i = 0; i <= steps; i++) {
      const along = -start + ((length + start + end) * i) / steps;
      const wobble = j * (Math.sin(along * freq1 + phase1) + 0.5 * Math.sin(along * freq2 + phase2)) * (pass ? 1.3 : 0.8);
      points.push([x1 + ux * along + nx * wobble, y1 + uy * along + ny * wobble]);
    }
    emit(points, passWidth(w, pass), a * (pass ? 0.5 : 1));
  }
}

/** A hand-drawn arc or ellipse; full circles overshoot on the second pass. */
export function arc(cx: number, cy: number, rx: number, ry: number, from = 0, to = TAU, options: ArcOptions = {}): void {
  const { w = 1.2, a = 0.85, j = 0.6, n = 2, rot = 0 } = options;
  const cosRot = Math.cos(rot);
  const sinRot = Math.sin(rot);
  const isFull = Math.abs(to - from) >= 6.2;
  for (let pass = 0; pass < n; pass++) {
    const phase1 = randomPhase();
    const phase2 = randomPhase();
    const end = to + (isFull && pass ? 0.14 : 0);
    const steps = Math.max(10, Math.round((Math.abs(end - from) * Math.max(rx, ry)) / 9));
    const points: Point[] = [];
    for (let i = 0; i <= steps; i++) {
      const angle = from + ((end - from) * i) / steps;
      const radiusScale = 1 + (j / Math.max(rx, ry, 1)) * (Math.sin(angle * 3 + phase1) + 0.5 * Math.sin(angle * 7 + phase2)) * (pass ? 1.4 : 1);
      const x = rx * radiusScale * Math.cos(angle);
      const y = ry * radiusScale * Math.sin(angle);
      points.push([cx + x * cosRot - y * sinRot, cy + x * sinRot + y * cosRot]);
    }
    emit(points, passWidth(w, pass), a * (pass ? 0.5 : 1));
  }
}

/** A quadratic bezier, hand-wobbled. */
export function curve(from: Point, control: Point, to: Point, options: { w?: number; a?: number } = {}): void {
  const points: Point[] = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const u = 1 - t;
    points.push([
      u * u * from[0] + 2 * u * t * control[0] + t * t * to[0] + randomBetween(-0.4, 0.4),
      u * u * from[1] + 2 * u * t * control[1] + t * t * to[1] + randomBetween(-0.4, 0.4),
    ]);
  }
  emit(points, options.w ?? 1, options.a ?? 0.8);
}

export function poly(polygon: Polygon, closed = true, options: LineOptions = {}): void {
  const count = polygon.length;
  const edges = closed ? count : count - 1;
  for (let i = 0; i < edges; i++) {
    const from = polygon[i]!;
    const to = polygon[(i + 1) % count]!;
    line(from[0], from[1], to[0], to[1], { ov: 1.2, ...options });
  }
}

/** Marginal notes: rows of small loops, like script in a codex. */
export function scribble(x: number, y: number, width: number, rows = 4, gap = 8): void {
  for (let row = 0; row < rows; row++) {
    let cx = x + randomBetween(0, 5);
    const end = x + width * randomBetween(0.55, 1);
    const cy = y + row * gap;
    while (cx < end) {
      const loopWidth = Math.min(randomBetween(14, 36), end - cx);
      const freq = randomBetween(0.9, 1.5);
      const amplitude = randomBetween(1.2, 2.4);
      const phase = randomPhase();
      const points: Point[] = [];
      for (let i = 0; i <= loopWidth; i += 1.6) {
        points.push([
          cx + i + Math.sin(i * freq * 1.3 + phase) * 0.6,
          cy + Math.sin(i * freq + phase) * amplitude * (0.5 + 0.5 * Math.sin(i * 0.4 + phase)),
        ]);
      }
      emit(points, 0.9, randomBetween(0.55, 0.85));
      cx += loopWidth + randomBetween(3, 6);
    }
  }
}
