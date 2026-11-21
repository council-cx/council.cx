import { drawCryptex } from "../drawings/cryptex";
import { drawSeal, drawSpiral, drawStones, drawVitruvian, drawZk } from "../drawings/flats";
import { drawPlate } from "../drawings/plate";
import { CRYPTEX, FAR_DISTANCE, FAR_PLATE_DISTANCE, GRID_SPACING, PEN_OBJECTS } from "../content/world";
import type { PenDrawing } from "../types";

/*
 * Everything that sits on the floor, in paint order. The ground element's
 * children are rendered from this list and matched back to it by index.
 */

export interface BakedCanvas {
  /** Drawing size in its own units. */
  width: number;
  height: number;
  /** Pixel density relative to the drawing's own units. */
  scale: number;
  seed: number;
  draw: () => void;
}

interface GroundItemBase {
  /** Distance ahead of the camera at scroll 0. */
  distance: number;
  /** The item is hidden once it is farther ahead than this. */
  hideBeyond: number;
}

export interface GridLineItem extends GroundItemBase {
  kind: "gridLine";
}

export interface BakedItem extends GroundItemBase {
  kind: "baked";
  className: "o" | "f" | "f pl";
  x: number;
  canvas: BakedCanvas;
  /** Carries a second canvas for the turning dials. */
  hasDials?: true;
}

export interface PenItem extends GroundItemBase {
  kind: "pen";
  x: number;
  drawing: PenDrawing;
}

export type GroundItem = GridLineItem | BakedItem | PenItem;

const PLATE_COUNT = 7;
const PLATE_SPACING = 760;
const PLATE_FIRST_DISTANCE = 500;
const FIRST_GRID_LINE = -2;
const LAST_GRID_LINE = 46;

const FLAT_DRAWINGS = [
  { draw: drawVitruvian, distance: 1360 },
  { draw: drawSpiral, distance: 2120 },
  { draw: drawZk, distance: 2880 },
  { draw: drawStones, distance: 3520 },
  { draw: drawSeal, distance: 4400 },
];

const CRYPTEX_SEED = 877;

function gridLines(): GridLineItem[] {
  const lines: GridLineItem[] = [];
  for (let n = FIRST_GRID_LINE; n <= LAST_GRID_LINE; n++) {
    lines.push({ kind: "gridLine", distance: n * GRID_SPACING, hideBeyond: FAR_DISTANCE });
  }
  return lines;
}

function plates(): BakedItem[] {
  return Array.from({ length: PLATE_COUNT }, (_, i): BakedItem => ({
    kind: "baked",
    className: "f pl",
    x: 0,
    distance: PLATE_FIRST_DISTANCE + i * PLATE_SPACING,
    hideBeyond: FAR_PLATE_DISTANCE,
    canvas: { width: 1000, height: 760, scale: 1.1, seed: 97 + i * 53, draw: drawPlate },
  }));
}

function flats(): BakedItem[] {
  return FLAT_DRAWINGS.map(({ draw, distance }, i): BakedItem => ({
    kind: "baked",
    className: "f",
    x: 0,
    distance,
    hideBeyond: FAR_DISTANCE,
    canvas: { width: 400, height: 400, scale: 1.5, seed: 300 + i * 17, draw },
  }));
}

function cryptex(): BakedItem {
  return {
    kind: "baked",
    className: "o",
    x: CRYPTEX.x,
    distance: CRYPTEX.distance,
    hideBeyond: FAR_DISTANCE,
    canvas: { width: 220, height: 260, scale: 2, seed: CRYPTEX_SEED, draw: drawCryptex },
    hasDials: true,
  };
}

function penObjects(): PenItem[] {
  return PEN_OBJECTS.map(({ drawing, x, distance }): PenItem => ({ kind: "pen", x, distance, hideBeyond: FAR_DISTANCE, drawing }));
}

export const GROUND_ITEMS: GroundItem[] = [...gridLines(), ...plates(), ...flats(), cryptex(), ...penObjects()];
