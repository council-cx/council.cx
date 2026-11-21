import type { CSSProperties } from "react";
import { PLANE_HEIGHT } from "../content/world";
import type { BakedItem, GridLineItem, GroundItem, PenItem } from "../scene/model";

const DIALS_CANVAS_SIZE = { width: 440, height: 520 };

function placementStyle({ x, distance }: { x: number; distance: number }): CSSProperties {
  return { "--x": x, "--d": distance } as CSSProperties;
}

function GridLine({ item }: { item: GridLineItem }) {
  return <div className="hl" style={{ top: PLANE_HEIGHT - item.distance }} />;
}

function BakedDrawing({ item }: { item: BakedItem }) {
  const { width, height, scale } = item.canvas;
  return (
    <div className={item.className} style={placementStyle(item)}>
      <canvas width={Math.round(width * scale)} height={Math.round(height * scale)} />
      {item.hasDials && <canvas className="lt rd" {...DIALS_CANVAS_SIZE} />}
    </div>
  );
}

function PenDrawingView({ item }: { item: PenItem }) {
  const { className, viewBox, preserveAspectRatio, paths } = item.drawing;
  const fixedPaths = paths.filter((path) => !path.rotating);
  const rotatingPaths = paths.filter((path) => path.rotating);
  return (
    <div className="o" style={placementStyle(item)}>
      <svg className={`dr ${className}`} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio}>
        {fixedPaths.map((path, i) => (
          <path key={i} className={path.cls} d={path.d} transform={path.transform} />
        ))}
      </svg>
      {rotatingPaths.length > 0 && (
        // Separate svg so its rotation is a composited transform and never repaints the traced strokes.
        <svg className={`dr ${className} rot`} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio}>
          {rotatingPaths.map((path, i) => (
            <path key={i} className={path.cls} d={path.d} />
          ))}
        </svg>
      )}
    </div>
  );
}

export function GroundItemView({ item }: { item: GroundItem }) {
  switch (item.kind) {
    case "gridLine":
      return <GridLine item={item} />;
    case "baked":
      return <BakedDrawing item={item} />;
    case "pen":
      return <PenDrawingView item={item} />;
  }
}
