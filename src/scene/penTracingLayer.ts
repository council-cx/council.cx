import { clamp, round1 } from "../engine/math";
import { distanceTravelled, type Layer } from "./layer";
import type { GroundItem } from "./model";

/** Strokes are re-dashed in steps of 1/400 of the drawing. */
const PROGRESS_STEPS = 400;

interface Stroke {
  path: SVGPathElement;
  length: number;
}

interface TracedDrawing {
  element: HTMLElement;
  distance: number;
  from: number;
  span: number;
  fade?: [number, number];
  strokes: Stroke[];
  totalLength: number;
  progress: number;
  opacity?: number;
}

function hideStrokes(element: HTMLElement): Stroke[] {
  return [...element.querySelectorAll("path")].map((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    return { path, length };
  });
}

function traceDrawing(drawing: TracedDrawing, ahead: number): void {
  const progress = Math.round(clamp((drawing.from - ahead) / drawing.span) * PROGRESS_STEPS) / PROGRESS_STEPS;
  if (drawing.fade) {
    const [transparentAt, opaqueAt] = drawing.fade;
    const opacity = round1(clamp((ahead - transparentAt) / (opaqueAt - transparentAt)));
    if (opacity !== drawing.opacity) {
      drawing.opacity = opacity;
      drawing.element.style.opacity = String(opacity);
    }
  }
  if (progress === drawing.progress) return;
  drawing.progress = progress;
  let remaining = progress * drawing.totalLength;
  for (const { path, length } of drawing.strokes) {
    path.style.strokeDashoffset = String(round1(length - Math.max(0, Math.min(length, remaining))));
    remaining -= length;
  }
}

/** Traces each pen drawing stroke by stroke as it nears the camera. */
export function createPenTracingLayer(ground: HTMLElement, items: GroundItem[]): Layer {
  const drawings: TracedDrawing[] = [];
  items.forEach((item, i) => {
    if (item.kind !== "pen") return;
    const element = ground.children[i] as HTMLElement;
    const strokes = hideStrokes(element);
    drawings.push({
      element,
      distance: item.distance,
      from: item.drawing.from,
      span: item.drawing.span,
      fade: item.drawing.fade,
      strokes,
      totalLength: strokes.reduce((sum, stroke) => sum + stroke.length, 0),
      progress: -1,
    });
  });

  return {
    update(camera) {
      const travelled = distanceTravelled(camera);
      drawings.forEach((drawing) => traceDrawing(drawing, drawing.distance - travelled));
    },
  };
}
