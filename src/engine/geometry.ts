import type { Point, Polygon } from "../types";
import { getContext } from "./pen";
import { TAU } from "./random";

export function rect(x: number, y: number, w: number, h: number): Polygon {
  return [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
}

export function ellipsePolygon(cx: number, cy: number, rx: number, ry: number, rot = 0, segments = 48): Polygon {
  return Array.from({ length: segments }, (_, i): Point => {
    const angle = (i * TAU) / segments;
    const x = rx * Math.cos(angle);
    const y = ry * Math.sin(angle);
    return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)];
  });
}

export function traceEllipse(cx: number, cy: number, rx: number, ry: number, rot = 0): void {
  const ctx = getContext();
  ctx.moveTo(cx + rx * Math.cos(rot), cy + rx * Math.sin(rot));
  ctx.ellipse(cx, cy, rx, ry, rot, 0, TAU);
}
