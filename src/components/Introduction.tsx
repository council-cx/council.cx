import { INTRODUCTION } from "../content/chapters";
import { Reveal } from "./Reveal";

export function Introduction() {
  const { lead, unbreakable, tail } = INTRODUCTION.tagline;
  return (
    <article className="chap intro">
      <div className="hz">
        <Reveal as="p" lag={0} className="tag">
          {lead}
          <span style={{ whiteSpace: "nowrap" }}>{unbreakable}</span>
          {tail}
        </Reveal>
      </div>
    </article>
  );
}
