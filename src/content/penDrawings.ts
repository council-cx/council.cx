import type { PenDrawing } from "../types";
import { armillaryPaths } from "./drawings/armillary";
import { domePaths } from "./drawings/dome";
import { obeliskPaths } from "./drawings/obelisk";
import { pantheonPaths } from "./drawings/pantheon";
import { porticoPaths } from "./drawings/portico";
import { pressPaths } from "./drawings/press";
import { towerPaths } from "./drawings/tower";
import { waterwheelPaths } from "./drawings/waterwheel";

const ALIGN_BOTTOM = "xMidYMax meet";
const ALIGN_CENTER = "xMidYMid meet";

const pantheon: PenDrawing = { viewBox: "0 0 325 294", preserveAspectRatio: ALIGN_BOTTOM, className: "pn", paths: pantheonPaths, from: 1820, span: 1700 };
const press: PenDrawing = { viewBox: "0 0 300 390", preserveAspectRatio: ALIGN_BOTTOM, className: "sp", paths: pressPaths, from: 1720, span: 1400 };
const tower: PenDrawing = { viewBox: "0 0 280 410", preserveAspectRatio: ALIGN_BOTTOM, className: "ob twr twl", paths: towerPaths, from: 1520, span: 1100 };
const armillary: PenDrawing = { viewBox: "0 0 440 520", preserveAspectRatio: ALIGN_BOTTOM, className: "am", paths: armillaryPaths, from: 2300, span: 1600 };
const obelisk: PenDrawing = { viewBox: "0 0 240 420", preserveAspectRatio: ALIGN_CENTER, className: "ob", paths: obeliskPaths, from: 1500, span: 1200 };
const waterwheel: PenDrawing = { viewBox: "0 0 300 400", preserveAspectRatio: ALIGN_CENTER, className: "ww", paths: waterwheelPaths, from: 815, span: 450 };
const portico: PenDrawing = { viewBox: "0 0 360 250", preserveAspectRatio: ALIGN_BOTTOM, className: "pt", paths: porticoPaths, from: 2620, span: 1900 };
const dome: PenDrawing = { viewBox: "0 0 272 333", preserveAspectRatio: ALIGN_CENTER, className: "dm", paths: domePaths, from: 1920, span: 1700 };

export const PEN_DRAWINGS = {
  pantheon,
  pantheonFront: { ...pantheon, from: 2215, span: 1500, fade: [650, 1050] },
  press,
  pressFront: press,
  tower,
  towerFront: { ...tower, className: "ob twr", from: 2620, span: 1300 },
  armillary,
  armillaryFront: { ...armillary, from: 1220, span: 1300 },
  obelisk,
  waterwheel,
  gear: { ...waterwheel, className: "ww wc", preserveAspectRatio: ALIGN_BOTTOM, from: 660, span: 850 },
  portico,
  porticoFront: { ...portico, className: "pt ptr", from: 555, span: 240 },
  dome,
  domeFront: { ...dome, from: 1720, span: 1700 },
  domeFar: { ...dome, from: 2320, span: 1700 },
} satisfies Record<string, PenDrawing>;
