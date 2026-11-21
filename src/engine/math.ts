export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Smoothstep. */
export function ease(value: number): number {
  return value * value * (3 - 2 * value);
}

export function round1(value: number): number {
  return +value.toFixed(1);
}
