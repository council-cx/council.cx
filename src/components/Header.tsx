import { CHAPTER_NAMES } from "../content/chapters";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="bar">
      <Logo />
      <div className="meter" aria-hidden="true">
        <span className="txt">
          <span className="num">{`01 / 0${CHAPTER_NAMES.length}`}</span>
          <span className="lbl">{CHAPTER_NAMES[0]}</span>
        </span>
        <span className="rule">
          <i />
          <b />
        </span>
      </div>
    </header>
  );
}
