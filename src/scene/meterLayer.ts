import { clamp } from "../engine/math";
import { prefersReducedMotion, requireElement, type Layer } from "./layer";

const LABEL_TRANSITION_MS = 280;
const LABEL_EASING = "cubic-bezier(.23,1,.32,1)";

const LABEL_ENTRANCE: Keyframe[] = [
  { opacity: 0, transform: "translateY(5px)", filter: "blur(3px)" },
  { opacity: 1, transform: "none", filter: "blur(0)" },
];

/** The progress meter in the header: chapter number and name, plus a rule that fills as you scroll. */
export function createMeterLayer(meter: HTMLElement, chapterNames: string[]): Layer {
  const number = requireElement<HTMLElement>(meter, ".num");
  const label = requireElement<HTMLElement>(meter, ".lbl");
  const labelGroup = requireElement<HTMLElement>(meter, ".txt");
  const rule = requireElement<HTMLElement>(meter, ".rule");
  const fill = requireElement<HTMLElement>(meter, ".rule i");
  const dot = requireElement<HTMLElement>(meter, ".rule b");
  const lastChapter = chapterNames.length - 1;
  let shownChapter = -1;
  let shownProgress = -1;
  let ruleWidth = 0;

  const showChapter = (index: number) => {
    number.textContent = `0${index + 1} / 0${chapterNames.length}`;
    label.textContent = chapterNames[index]!;
    if (!prefersReducedMotion && shownChapter >= 0) {
      labelGroup.animate(LABEL_ENTRANCE, { duration: LABEL_TRANSITION_MS, easing: LABEL_EASING });
    }
    shownChapter = index;
  };

  /** Both marks move by transform, which keeps the header out of layout while scrolling. */
  const place = (progress: number) => {
    fill.style.transform = `scaleX(${progress.toFixed(4)})`;
    dot.style.transform = `translate3d(${(progress * ruleWidth).toFixed(1)}px,0,0)`;
  };

  // The rule's width only changes on resize, so it is observed instead of measured every frame.
  const ruleObserver = new ResizeObserver(([entry]) => {
    ruleWidth = entry!.contentRect.width;
    if (shownProgress >= 0) place(shownProgress);
  });
  ruleObserver.observe(rule);

  return {
    update(camera) {
      const chapter = clamp(Math.round(camera), 0, lastChapter);
      if (chapter !== shownChapter) showChapter(chapter);
      const progress = +(camera / lastChapter).toFixed(4);
      if (progress === shownProgress) return;
      shownProgress = progress;
      place(progress);
    },
    dispose: () => ruleObserver.disconnect(),
  };
}
