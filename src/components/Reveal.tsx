import type { ReactNode } from "react";
import { revealAttributes } from "../scene/revealLayer";

interface RevealProps {
  as: "h2" | "p" | "ol" | "ul";
  lag: number;
  className?: string;
  children: ReactNode;
}

/** Copy that blurs and slides into focus as the camera reaches its chapter. */
export function Reveal({ as: Tag, lag, className, children }: RevealProps) {
  return (
    <Tag className={className} {...revealAttributes(lag)}>
      {children}
    </Tag>
  );
}
