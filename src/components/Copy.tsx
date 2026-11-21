import { CHAPTERS } from "../content/chapters";
import { ChapterSection } from "./ChapterSection";
import { Introduction } from "./Introduction";

export function Copy() {
  return (
    <div className="copy">
      <Introduction />
      {CHAPTERS.map((chapter) => (
        <ChapterSection key={chapter.name} chapter={chapter} />
      ))}
    </div>
  );
}
