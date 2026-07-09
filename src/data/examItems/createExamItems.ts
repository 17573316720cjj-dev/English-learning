import type { ExamLevel, LearningItem, PhraseCategory, PhraseDifficulty } from "../../domain";

interface ExamItemSeed {
  id: string;
  phrase: string;
  meaningZh: string;
  example: string;
  exampleZh: string;
  category: PhraseCategory;
  difficulty: PhraseDifficulty;
}

export function createExamItems(examLevel: ExamLevel, items: ExamItemSeed[]): LearningItem[] {
  const prefix = examLevel.toLowerCase();

  return items.map((item) => ({
    ...item,
    id: `${prefix}-${item.id}`,
    source: "built-in",
    examLevel
  }));
}
