import { recordSkyDrawings } from "../engine/sky";

const SKY_DRAWINGS = recordSkyDrawings();

export function Sky() {
  return (
    <svg className="sky" viewBox="0 0 390 460" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {SKY_DRAWINGS.map((paths, index) => (
        <g key={index} className={index === 0 ? "g0" : undefined} data-k={index === 0 ? undefined : index}>
          {paths.map(({ d, strokeWidth, opacity }, pathIndex) => (
            <path key={pathIndex} pathLength={1} d={d} style={{ strokeWidth, opacity }} />
          ))}
        </g>
      ))}
    </svg>
  );
}
