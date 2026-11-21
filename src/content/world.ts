import type { PenDrawing } from "../types";
import { PEN_DRAWINGS } from "./penDrawings";

/** Size of the floor plane, matching `.plane` in floor.css. */
export const PLANE_WIDTH = 2640;
export const PLANE_HEIGHT = 3600;
/** World units the camera travels per chapter. */
export const CHAPTER_TRAVEL = 760;
/** Spacing of the floor grid. */
export const GRID_SPACING = 200;
/** Objects farther ahead than this stay hidden. */
export const FAR_DISTANCE = 4300;
export const FAR_PLATE_DISTANCE = 3000;

interface Placement {
  /** Lateral offset from the road centre. */
  x: number;
  /** Distance ahead of the camera at scroll 0. */
  distance: number;
}

export interface PenObject extends Placement {
  drawing: PenDrawing;
}

export const CRYPTEX: Placement = { x: 0, distance: 4400 };

export const PEN_OBJECTS: PenObject[] = [
  { drawing: PEN_DRAWINGS.porticoFront, x: 215, distance: 650 },
  { drawing: PEN_DRAWINGS.waterwheel, x: -255, distance: 900 },
  { drawing: PEN_DRAWINGS.tower, x: -330, distance: 2020 },
  { drawing: PEN_DRAWINGS.armillaryFront, x: 255, distance: 1650 },
  { drawing: PEN_DRAWINGS.obelisk, x: 470, distance: 1950 },
  { drawing: PEN_DRAWINGS.press, x: -255, distance: 2400 },
  { drawing: PEN_DRAWINGS.pantheonFront, x: 330, distance: 2350 },
  { drawing: PEN_DRAWINGS.pantheon, x: -440, distance: 2800 },
  { drawing: PEN_DRAWINGS.gear, x: 265, distance: 3150 },
  { drawing: PEN_DRAWINGS.domeFront, x: 470, distance: 3250 },
  { drawing: PEN_DRAWINGS.dome, x: -450, distance: 3700 },
  { drawing: PEN_DRAWINGS.armillary, x: -255, distance: 3900 },
  { drawing: PEN_DRAWINGS.towerFront, x: 450, distance: 4100 },
  { drawing: PEN_DRAWINGS.pressFront, x: 255, distance: 4500 },
  { drawing: PEN_DRAWINGS.portico, x: -420, distance: 4600 },
  { drawing: PEN_DRAWINGS.domeFar, x: 460, distance: 4800 },
];
