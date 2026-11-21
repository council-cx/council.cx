import type { ChapterLink } from "../content/chapters";
import { Reveal } from "./Reveal";

const LINKS_LAG = 0.12;

const isExternal = (href: string) => href.startsWith("http");

function XIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path className="stroke" d="M3 5.5h18v13H3zM3.5 6l8.5 7 8.5-7" />
    </svg>
  );
}

const ICONS = { x: XIcon, mail: MailIcon };

export function LinkList({ links }: { links: ChapterLink[] }) {
  return (
    <Reveal as="ul" lag={LINKS_LAG} className="links">
      {links.map(({ label, href, ariaLabel, icon }) => {
        const Icon = icon && ICONS[icon];
        return (
          <li key={href}>
            <a href={href} aria-label={ariaLabel} {...(isExternal(href) && { target: "_blank", rel: "noopener noreferrer" })}>
              {Icon && <Icon />}
              {label}
            </a>
          </li>
        );
      })}
    </Reveal>
  );
}
