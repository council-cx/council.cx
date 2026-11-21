export interface FlowStep {
  label: string;
  marker?: "diamond" | "filled";
}

export type StepList =
  | { kind: "flow"; steps: FlowStep[] }
  | { kind: "numbered"; labels: string[] };

export interface ChapterLink {
  label: string;
  href: string;
  /** Accessible name when the visible label alone (e.g. a handle) is not descriptive. */
  ariaLabel?: string;
  icon?: "x" | "mail";
}

export interface Chapter {
  name: string;
  heading: string;
  body: string;
  steps?: StepList;
  links?: ChapterLink[];
}

export const INTRODUCTION = {
  name: "Introduction",
  tagline: {
    lead: "Secure crypto with open source ",
    unbreakable: "community-owned",
    tail: " compliance",
  },
};

export const CHAPTERS: Chapter[] = [
  {
    name: "The problem",
    heading: "Theft outruns response",
    body: "$8.7B was stolen in 2026. Big players can get funds frozen; most victims have no one to call.",
  },
  {
    name: "The idea",
    heading: "An open blacklist",
    body: "A community-owned list of malicious addresses, readable by anyone, with evidence behind every entry.",
  },
  {
    name: "How it works",
    heading: "Evidence, then verdict",
    body: "Anyone can request an addition or removal. A group of AI jurors reviews it and the list updates.",
    steps: {
      kind: "flow",
      steps: [{ label: "Request" }, { label: "AI jurors", marker: "diamond" }, { label: "Added", marker: "filled" }],
    },
  },
  {
    name: "The protocol",
    heading: "The protocol and the product",
    body: "The blacklist and AI jurors are open-source and permissionless. We sell integration services to different parties.",
    steps: { kind: "numbered", labels: ["Exchanges and issuers", "Wallets, RPCs, cards", "dApps and protocols"] },
  },
  {
    name: "Integrate",
    heading: "Integrate Council",
    body: "No demo yet. The Council list and platform plug into any system. Interested? Get in touch.",
    links: [
      { label: "contact@council.cx", href: "mailto:contact@council.cx", icon: "mail" },
      { label: "@councilcx", href: "https://x.com/councilcx", ariaLabel: "@councilcx on X", icon: "x" },
    ],
  },
];

export const CHAPTER_NAMES = [INTRODUCTION.name, ...CHAPTERS.map((chapter) => chapter.name)];
