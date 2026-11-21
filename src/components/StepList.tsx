import type { StepList as StepListContent } from "../content/chapters";
import { Reveal } from "./Reveal";

const STEPS_LAG = 0.12;

function markerClass(marker: "diamond" | "filled" | undefined): string | undefined {
  if (marker === "diamond") return "dm";
  if (marker === "filled") return "fl";
  return undefined;
}

export function StepList({ list }: { list: StepListContent }) {
  if (list.kind === "flow") {
    return (
      <Reveal as="ol" lag={STEPS_LAG} className="steps">
        {list.steps.map(({ label, marker }) => (
          <li key={label} className={markerClass(marker)}>
            {label}
          </li>
        ))}
      </Reveal>
    );
  }
  return (
    <Reveal as="ol" lag={STEPS_LAG} className="steps num">
      {list.labels.map((label, i) => (
        <li key={label} data-n={String(i + 1).padStart(2, "0")}>
          {label}
        </li>
      ))}
    </Reveal>
  );
}
