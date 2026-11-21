import { clamp, ease, round1 } from "../engine/math";
import type { Layer } from "./layer";

/** Chapter-relative distance over which copy fades in or out. */
const FADE_SPAN = 0.22;
const REVEAL_THRESHOLD = 0.5;
const SLIDE_PX = 16;
const BLUR_PX = 4;

const REVEAL_ATTRIBUTE = "data-reveal";
const REVEAL_LAG_ATTRIBUTE = "data-lag";

interface RevealTarget {
  element: HTMLElement;
  lag: number;
  /** Last visibility written to the element, so unchanged copy costs no style work. */
  shown: number;
}

/** Marks an element to be revealed by the layer; `lag` delays it relative to its chapter's other copy. */
export function revealAttributes(lag: number): Record<string, string | number> {
  return { [REVEAL_ATTRIBUTE]: "", [REVEAL_LAG_ATTRIBUTE]: lag };
}

function collectTargets(chapter: Element): RevealTarget[] {
  return [...chapter.querySelectorAll<HTMLElement>(`[${REVEAL_ATTRIBUTE}]`)].map((element) => ({
    element,
    lag: Number(element.getAttribute(REVEAL_LAG_ATTRIBUTE)),
    shown: -1,
  }));
}

/** Copy blurs and slides into focus as the camera reaches its chapter, and out again as it leaves. */
export function createRevealLayer(copy: HTMLElement): Layer {
  const chapters = [...copy.querySelectorAll(".chap")].map(collectTargets);

  return {
    update(camera) {
      chapters.forEach((targets, index) => {
        const distance = camera - index;
        const direction = distance < 0 ? 1 : -1;
        targets.forEach((target) => {
          const visibility = +ease(clamp((REVEAL_THRESHOLD - (Math.abs(distance) + target.lag)) / FADE_SPAN)).toFixed(3);
          if (visibility === target.shown) return;
          target.shown = visibility;
          const { style } = target.element;
          style.opacity = String(visibility);
          style.visibility = visibility === 0 ? "hidden" : "";
          style.transform = visibility === 1 ? "none" : `translate3d(0,${round1((1 - visibility) * SLIDE_PX * direction)}px,0)`;
          style.filter = visibility === 1 ? "none" : `blur(${round1((1 - visibility) * BLUR_PX)}px)`;
        });
      });
    },
  };
}
