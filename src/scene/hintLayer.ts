import { clamp } from "../engine/math";
import type { Layer } from "./layer";

/** Camera position by which the scroll hint has fully faded. */
const HINT_FADE_END = 0.22;

export function createHintLayer(hint: HTMLElement): Layer {
  let shown = -1;
  return {
    update(camera) {
      const opacity = +clamp(1 - camera / HINT_FADE_END).toFixed(3);
      if (opacity === shown) return;
      shown = opacity;
      hint.style.opacity = String(opacity);
      // Once faded, its endless pulse no longer needs styling or painting.
      hint.style.visibility = opacity === 0 ? "hidden" : "visible";
    },
  };
}
