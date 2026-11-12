export type Resource = {
  label: string;
  description: string;
  type: "spreadsheet" | "pdf" | "dataset" | "link";
  href: string;
};

export type Article = {
  number: string;
  category: string;
  title: string;
  dek: string;
  slug: string;
  readTime: string;
  body: string[];
  resources?: Resource[];
};

export type Edition = {
  slug: string;
  version: string;
  number: string;
  date: string;
  status: "published" | "draft";
  title: string;
  summary: string;
  coverImage: string;
  systemStatus: string;
  operatorLucidity: string;
  cognitiveLoad: string;
  stability: string;
  patchNotes: string[];
  articles: Article[];
  closingLeak: string;
};

export const editions: Edition[] = [
  {
    slug: "26-14",
    version: "26.14",
    number: "001",
    date: "November 2026",
    status: "published",
    title: "A few things worth investigating",
    summary: "A collection of small obsessions, questionable experiments and things that probably deserved a closer look.",
    coverImage: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1400&q=85",
    systemStatus: "High-Intensity Research / Slightly Vibrating",
    operatorLucidity: "88% (Partial failure in spatial rendering; table was flipped)",
    cognitiveLoad: "[||||||||--] (92% Capacity / 2008 Telecom Aesthetics)",
    stability: "Nominal, provided no one mentions 'efficiency.'",
    patchNotes: [
      "[REMOVED]: The 4:00 AM Wikipedia spiral regarding 18th-century naval rations.",
      "[ADDED]: Experimental support for 32-bit architectural rendering (Beta).",
      "[OPTIMIZED]: Streamlined the protocol for turning mid-2000s jingles into \"market research.\""
    ],
    articles: [
      {
        number: "01",
        category: "EXPERIMENT / OBJECTS",
        title: "A brief appreciation of nuts & bolts",
        dek: "An entirely unnecessary investigation into the fidget potential of hardware-store objects.",
        slug: "nuts-and-bolts",
        readTime: "4 min",
        body: [
          "Some objects are designed to be useful. Others acquire a second life in the hands of someone who is supposed to be doing something else. A nut and bolt, for instance, can become a surprisingly compelling little mechanical distraction.",
          "This is not a definitive study, nor is it an endorsement of dismantling perfectly good furniture. It is a small framework for looking at ordinary hardware through a rather different lens: tactile satisfaction, movement, sound, weight and the pleasure of a mechanism doing exactly what it is supposed to do.",
          "The full archived version is where the scoring framework, object notes and future additions belong. Consider this a field note from an investigation that got slightly out of hand."
        ],
        resources: [
          {
            label: "Object scoring sheet",
            description: "A spreadsheet template for recording tactile impressions and scores.",
            type: "spreadsheet",
            href: "#"
          }
        ]
      },
      {
        number: "02",
        category: "KITCHEN / EXPERIMENT",
        title: "The timing of salt",
        dek: "A kitchen experiment about when seasoning enters the picture, and what changes when it does.",
        slug: "the-timing-of-salt",
        readTime: "6 min",
        body: [
          "A pinch of salt seems like a simple thing. Add it, stir, taste, move on. But cooking is full of small decisions whose effects are easier to notice when you isolate them.",
          "This experiment compares a few approaches to seasoning pasta and its accompanying sauce. The point isn't to produce a universal rule. It's to pay attention to extraction, concentration, texture and the way a dish changes as its components meet.",
          "The archived version can hold the full method, tasting notes, photographs, source material and a downloadable results sheet. No conclusions have been invented in advance; the useful part is documenting what actually happens."
        ],
        resources: [
          {
            label: "Experiment log",
            description: "A blank results sheet to use when running the experiment.",
            type: "spreadsheet",
            href: "#"
          },
          {
            label: "Research notes",
            description: "A place for references and background reading as the experiment develops.",
            type: "pdf",
            href: "#"
          }
        ]
      }
    ],
    closingLeak: "The Operator has asked whether the folder marked \"miscellaneous\" can be considered a filing system. I have elected not to answer until I have had time to consult the relevant authorities. There are no relevant authorities."
  }
];

export function getEdition(slug: string) {
  return editions.find((edition) => edition.slug === slug);
}

export function getArticle(slug: string) {
  for (const edition of editions) {
    const article = edition.articles.find((item) => item.slug === slug);
    if (article) return { edition, article };
  }
  return undefined;
}
