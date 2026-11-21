import { GRID_SPACING, PLANE_WIDTH } from "../content/world";
import { GROUND_ITEMS } from "../scene/model";
import { GroundItemView } from "./GroundItems";

const FIRST_LINE_OFFSET = 100;
const PHONE_MAX_WIDTH = 720;

/** Vertical grid lines never move; phones get fewer. */
function VerticalLines() {
  const isPhone = innerWidth < PHONE_MAX_WIDTH;
  const count = isPhone ? 10 : 14;
  const span = isPhone ? 1000 : 1400;
  const firstLeft = PLANE_WIDTH / 2 - span + FIRST_LINE_OFFSET;
  return Array.from({ length: count }, (_, i) => <div key={i} className="vl" style={{ left: firstLeft + i * GRID_SPACING }} />);
}

export function Floor() {
  return (
    <div className="floor" aria-hidden="true">
      <div className="scene">
        <div className="plane">
          <div className="road" />
          <VerticalLines />
          <div className="ground">
            {GROUND_ITEMS.map((item, i) => (
              <GroundItemView key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
