import { recordSkyDrawings } from "../engine/sky";

const SKY_DRAWINGS = recordSkyDrawings();
const INTRO_PATH_STAGGER_MS = 30;

export function Sky() {
  return (
    <svg className="sky" viewBox="0 0 390 460" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {SKY_DRAWINGS.map((paths, index) => (
        <g key={index} className={index === 0 ? "g0" : undefined} data-k={index === 0 ? undefined : index}>
          {paths.map(({ d, strokeWidth, opacity }, pathIndex) => (
            <path
              key={pathIndex}
              pathLength={1}
              d={d}
              style={{
                strokeWidth,
                opacity,
                animationDelay: index === 0 && pathIndex > 1 ? `${0.4 + pathIndex * INTRO_PATH_STAGGER_MS / 1000}s` : undefined,
              }}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
