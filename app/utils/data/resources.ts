export type ResourceType = "reading" | "video" | "audio" | "interactive";

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  level: "all" | "beginner" | "intermediate" | "advanced";
  tags: string[];
}

export const resources: Resource[] = [
  {
    id: "1",
    title: "British Council",
    description:
      "A self-study reference and practice book for intermediate learners of English.",
    url: "https://learnenglish.britishcouncil.org",
    type: "reading",
    level: "intermediate",
    tags: ["grammar", "self-study"],
  },
  {
    id: "2",
    title: "Oxford Online English",
    description:
      "Free resources to learn English including videos, podcasts, and interactive exercises.",
    url: "https://www.bucksmore.com/bucksmore-summer-2025?gad_source=1&gclid=Cj0KCQjwtJ6_BhDWARIsAGanmKd7Ate0PKwOxQzJJkXfkNUulkzexTEhCkA0ZxIBR-O6J_l9GedbtZUaAkBPEALw_wcB",
    type: "interactive",
    level: "beginner",
    tags: ["multimedia", "free"],
  },
  {
    id: "3",
    title: "TED Talks",
    description:
      "Watch engaging talks on various topics with subtitles to improve listening and vocabulary.",
    url: "https://www.ted.com/",
    type: "video",
    level: "advanced",
    tags: ["listening", "vocabulary"],
  },
  {
    id: "4",
    title: "6 Minute English",
    description:
      "Short audio programs from BBC discussing current topics with transcripts.",
    url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english",
    type: "audio",
    level: "intermediate",
    tags: ["listening", "current events"],
  },
  {
    id: "5",
    title: "EngVid – English Tips",
    description:
      "Interactive language learning platform with gamified lessons.",
    url: "https://www.engvid.com/english-tips/",
    type: "interactive",
    level: "beginner",
    tags: ["gamified", "mobile"],
  },
  {
    id: "6",
    title: "Cambridge Dictionary",
    description:
      "Comprehensive English dictionary with pronunciations and examples.",
    url: "https://dictionary.cambridge.org/",
    type: "reading",
    level: "all",
    tags: ["vocabulary", "reference"],
  },
];
