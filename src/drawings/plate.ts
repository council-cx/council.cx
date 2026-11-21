import { rect } from "../engine/geometry";
import { arc, line, poly, scribble } from "../engine/pen";
import { randomBetween as between, TAU } from "../engine/random";
import { fillPolygon, hatch, smudge, wash, washGradient } from "../engine/shading";
import { label, pit } from "./primitives";

/*
 * A floor plate, 1000 x 760: a codex sheet laid on the ground.
 * Sunken pits with hatched walls, pochéd plan rooms, stairs, measured lines, notes.
 */

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XII", "XIV"];

function romanNumeral(upperBound: number): string {
  return ROMAN_NUMERALS[Math.floor(between(0, upperBound))]!;
}

function room(x: number, y: number, w: number, h: number): void {
  const wallThickness = 8;
  const doorWidth = 34;
  const doorX = x + w * 0.22;
  const walls = [
    rect(x, y, w, wallThickness),
    rect(x, y + h - wallThickness, doorX - x, wallThickness),
    rect(doorX + doorWidth, y + h - wallThickness, x + w - doorX - doorWidth, wallThickness),
    rect(x, y + wallThickness, wallThickness, h - 2 * wallThickness),
    rect(x + w - wallThickness, y + wallThickness, wallThickness, h - 2 * wallThickness),
    rect(x + w * 0.46, y + wallThickness, wallThickness * 0.8, h * 0.55),
  ];
  walls.forEach((wall) => {
    fillPolygon(wall, "rgba(237,226,198,.6)");
    wash(wall, 0.34, 0.1);
    hatch(wall, 45, 2.3, { a: 0.6 });
    poly(wall, true, { w: 1.3, n: 1 });
  });
  arc(doorX, y + h - wallThickness, doorWidth, doorWidth, -Math.PI / 2, 0, { w: 1, a: 0.7 });
  line(doorX, y + h - wallThickness, doorX, y + h - wallThickness - doorWidth, { w: 1.2 });
  scribble(x + 20, y + h * 0.4, w * 0.35, 3, 8);
}

function stairs(x: number, y: number, w: number, h: number, steps = 8): void {
  const outline = rect(x, y, w, h);
  washGradient(outline, x, y, x, y + h, 0.02, 0.24);
  for (let i = 1; i < steps; i++) line(x, y + (i * h) / steps, x + w, y + (i * h) / steps, { w: 1.2, a: 0.8 });
  poly(outline, true, { w: 1.8 });
  hatch(
    [[x, y + h - h / steps], [x + w, y + h - h / steps], [x + w, y + h], [x, y + h]],
    45,
    3,
    { a: 0.5 },
  );
}

function dimension(x1: number, y: number, x2: number, text: string): void {
  line(x1, y, x2, y, { w: 1.2 });
  line(x1, y - 6, x1, y + 6, { w: 1.2, n: 1 });
  line(x2, y - 6, x2, y + 6, { w: 1.2, n: 1 });
  label(text, (x1 + x2) / 2, y - 6, 15, 0.85);
}

function compass(x: number, y: number, radius: number): void {
  arc(x, y, radius, radius, 0, TAU, { w: 1.3 });
  arc(x, y, radius * 0.55, radius * 0.55, 0, TAU, { w: 1 });
  line(x - radius * 1.35, y, x + radius * 1.35, y, { w: 1 });
  line(x, y - radius * 1.35, x, y + radius * 1.35, { w: 1 });
}

export function drawPlate(): void {
  for (let n = 0; n < 7; n++) smudge(between(0, 1000), between(0, 760), between(60, 150), 0.1);
  for (let n = 0; n < 3; n++) line(0, between(80, 700), 1000, between(80, 700), { w: 0.9, a: 0.32, j: 1.4, n: 1, ov: 0 });
  for (let n = 0; n < 2; n++) line(between(60, 280), 0, between(60, 280), 760, { w: 0.9, a: 0.32, j: 1.4, n: 1, ov: 0 });
  for (let n = 0; n < 2; n++) line(between(720, 940), 0, between(720, 940), 760, { w: 0.9, a: 0.32, j: 1.4, n: 1, ov: 0 });
  pit(between(20, 70), between(70, 150), between(170, 230), between(100, 150), between(18, 26));
  room(between(40, 90), between(410, 460), between(180, 220), between(150, 190));
  room(between(700, 760), between(70, 120), between(190, 240), between(130, 170));
  pit(between(710, 760), between(440, 500), between(190, 240), between(110, 150), between(18, 26));
  stairs(between(110, 150), between(250, 300), 90, 60, 8);
  stairs(between(760, 800), between(280, 320), 80, 56, 7);
  dimension(between(330, 360), between(120, 200), between(640, 670), romanNumeral(11));
  dimension(between(330, 360), between(560, 640), between(640, 670), romanNumeral(11));
  compass(500 + between(-40, 40), between(300, 460), between(24, 34));
  for (let n = 0; n < 14; n++) scribble(between(20, 820), between(30, 700), between(90, 170), Math.round(between(3, 6)), 8);
  for (let n = 0; n < 5; n++) label(romanNumeral(12), between(30, 970), between(40, 730), 16, 0.7);
}
