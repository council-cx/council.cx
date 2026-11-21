import { useLayoutEffect, type RefObject } from "react";
import { startScrollScene } from "../scene/startScrollScene";

/** Brings the rendered page to life: scroll-driven camera, baked drawings and animated copy. */
export function useScrollScene(track: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    if (!track.current) return;
    return startScrollScene(track.current);
  }, [track]);
}
