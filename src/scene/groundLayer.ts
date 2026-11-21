import { round1 } from "../engine/math";
import { distanceTravelled, type Layer } from "./layer";
import type { GroundItem } from "./model";

/** Items closer than this have passed behind the camera. */
const BEHIND_CAMERA = -460;
/** Hides an item and pauses its animations (see floor.css). */
const OFFSTAGE_CLASS = "off";

interface Tracked {
  element: HTMLElement;
  distance: number;
  hideBeyond: number;
  visible: boolean;
}

/** Slides the whole ground towards the camera and hides what is out of range. */
export function createGroundLayer(ground: HTMLElement, items: GroundItem[]): Layer {
  const tracked: Tracked[] = items.map((item, i) => ({
    element: ground.children[i] as HTMLElement,
    distance: item.distance,
    hideBeyond: item.hideBeyond,
    visible: true,
  }));

  return {
    update(camera) {
      const travelled = distanceTravelled(camera);
      ground.style.transform = `translate3d(0,${round1(travelled)}px,0)`;
      tracked.forEach((item) => {
        const ahead = item.distance - travelled;
        const visible = ahead > BEHIND_CAMERA && ahead < item.hideBeyond;
        if (visible === item.visible) return;
        item.element.classList.toggle(OFFSTAGE_CLASS, !visible);
        item.visible = visible;
      });
    },
  };
}
