import { CHAPTER_TRAVEL } from "../content/world";

/** A part of the page that redraws itself from the camera position. */
export interface Layer {
  /** `camera` runs from 0 to the last chapter index. */
  update(camera: number): void;
  /**
   * Time-driven animation that carries on without scrolling. Called on every frame of the shared
   * loop; returns true while more frames are needed.
   */
  tick?(now: number): boolean;
  /** Releases observers or listeners the layer registered. */
  dispose?(): void;
}

export const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function distanceTravelled(camera: number): number {
  return camera * CHAPTER_TRAVEL;
}

export function requireElement<T extends Element>(parent: ParentNode, selector: string): T {
  const element = parent.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}
