export type Point = [number, number];
export type Polygon = Point[];
export type Box = [x0: number, y0: number, x1: number, y1: number];

export interface PenPath {
  cls: string;
  d: string;
  rotating?: true;
  transform?: string;
}

export interface PenDrawing {
  viewBox: string;
  preserveAspectRatio: string;
  className: string;
  paths: PenPath[];
  /** Distance ahead of the camera below which the strokes start being traced. */
  from: number;
  /** Camera travel over which the whole drawing is traced. */
  span: number;
  /** Distances ahead of the camera between which the drawing goes from transparent to opaque. */
  fade?: [transparentAt: number, opaqueAt: number];
}
