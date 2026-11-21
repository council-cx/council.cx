import type { Chapter } from "../content/chapters";
import { Reveal } from "./Reveal";
import { LinkList } from "./LinkList";
import { StepList } from "./StepList";

const BODY_LAG = 0.06;

export function ChapterSection({ chapter }: { chapter: Chapter }) {
  return (
    <article className="chap">
      <Reveal as="h2" lag={0}>
        {chapter.heading}
      </Reveal>
      <div className="hz">
        <Reveal as="p" lag={BODY_LAG}>
          {chapter.body}
        </Reveal>
        {chapter.steps && <StepList list={chapter.steps} />}
        {chapter.links && <LinkList links={chapter.links} />}
      </div>
    </article>
  );
}
