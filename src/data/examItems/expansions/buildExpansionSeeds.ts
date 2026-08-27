import type { PhraseCategory, PhraseDifficulty, PhraseTag } from "../../../domain";
import type { ExamItemSeed } from "../createExamItems";

interface PhrasePart {
  en: string;
  zh: string;
}

interface SharedExpansionFields {
  category: PhraseCategory;
  difficulty: PhraseDifficulty;
  tags: PhraseTag[];
}

interface CollocationGroup extends SharedExpansionFields {
  action: PhrasePart;
  objects: PhrasePart[];
  subjectEn?: string;
  subjectZh?: string;
  tailEn?: string;
  tailZh?: string;
}

interface FixedPhraseSpec extends SharedExpansionFields {
  phrase: string;
  meaningZh: string;
  example: string;
  exampleZh: string;
  id?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildCollocationSeeds(groups: CollocationGroup[]): ExamItemSeed[] {
  return groups.flatMap((group) =>
    group.objects.map((object) => {
      const phrase = `${group.action.en} ${object.en}`;
      const subjectEn = group.subjectEn ?? "Students";
      const subjectZh = group.subjectZh ?? "学生";
      const tailEn = group.tailEn ?? "during exam preparation";
      const tailZh = group.tailZh ?? "在备考中";

      return {
        id: slugify(phrase),
        phrase,
        meaningZh: `${group.action.zh}${object.zh}`,
        example: `${subjectEn} should ${phrase} ${tailEn}.`,
        exampleZh: `${subjectZh}应该${tailZh}${group.action.zh}${object.zh}。`,
        category: group.category,
        difficulty: group.difficulty,
        tags: group.tags
      };
    })
  );
}

export function buildFixedPhraseSeeds(items: FixedPhraseSpec[]): ExamItemSeed[] {
  return items.map((item) => ({
    id: item.id ?? slugify(item.phrase),
    phrase: item.phrase,
    meaningZh: item.meaningZh,
    example: item.example,
    exampleZh: item.exampleZh,
    category: item.category,
    difficulty: item.difficulty,
    tags: item.tags
  }));
}
