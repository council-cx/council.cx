export const TAU = Math.PI * 2;

const LEHMER_MULTIPLIER = 16807;
const LEHMER_MODULUS = 2147483647;

let seed = 11;

/** Seeded so the drawings are identical on every visit. */
export function setSeed(value: number): void {
  seed = value;
}

export function random(): number {
  seed = (seed * LEHMER_MULTIPLIER) % LEHMER_MODULUS;
  return seed / LEHMER_MODULUS;
}

export function randomBetween(min: number, max: number): number {
  return min + (max - min) * random();
}

export function randomPhase(): number {
  return random() * TAU;
}
