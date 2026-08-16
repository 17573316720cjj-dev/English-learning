import type { ExamLevel, LearningItem, PhraseDifficulty, PhraseTag, ProgressState } from "../domain";
import { shuffleLearningItems } from "./practice";
import { getWeakLearningItems } from "./review";
import { getItemTags } from "./tags";

export const DAILY_PRACTICE_ITEM_LIMIT = 12;
const DAILY_WEAK_ITEM_LIMIT = 5;

export interface PracticeFilters {
  examLevel: ExamLevel | "All";
  tag: PhraseTag | "All";
  difficulty: PhraseDifficulty | "All";
}

export interface StudyPlanPreset {
  id: string;
  title: string;
  subtitle: string;
  filters: PracticeFilters;
}

export interface PracticeLaunchConfig {
  title: string;
  description?: string;
  filters?: PracticeFilters;
  itemIds?: string[];
  scopeId?: string;
}

export const defaultPracticeFilters: PracticeFilters = {
  examLevel: "All",
  tag: "All",
  difficulty: "All"
};

export const studyPlanPresets: StudyPlanPreset[] = [
  {
    id: "cet4-high-frequency-basic",
    title: "CET-4 高频基础",
    subtitle: "基础高频短语",
    filters: {
      examLevel: "CET4",
      tag: "HighFrequency",
      difficulty: "Basic"
    }
  },
  {
    id: "cet6-writing-translation",
    title: "CET-6 写作翻译",
    subtitle: "进阶写作表达",
    filters: {
      examLevel: "CET6",
      tag: "Writing",
      difficulty: "Intermediate"
    }
  },
  {
    id: "tem4-reading-expression",
    title: "TEM-4 阅读表达",
    subtitle: "阅读理解核心",
    filters: {
      examLevel: "TEM4",
      tag: "Reading",
      difficulty: "Intermediate"
    }
  },
  {
    id: "tem8-advanced-speaking",
    title: "TEM-8 高级口试",
    subtitle: "口试论证表达",
    filters: {
      examLevel: "TEM8",
      tag: "Speaking",
      difficulty: "Intermediate"
    }
  }
];

export function filterLearningItems(items: LearningItem[], filters: PracticeFilters): LearningItem[] {
  return items.filter((item) => {
    const matchesExamLevel = filters.examLevel === "All" || item.examLevel === filters.examLevel;
    const matchesTag = filters.tag === "All" || getItemTags(item).includes(filters.tag);
    const matchesDifficulty = filters.difficulty === "All" || item.difficulty === filters.difficulty;

    return matchesExamLevel && matchesTag && matchesDifficulty;
  });
}

function hasPracticeHistory(progress: ProgressState, itemId: string): boolean {
  const counts = progress.perItem[itemId];
  return Boolean(counts && counts.correct + counts.incorrect > 0);
}

function uniqueById(items: LearningItem[]): LearningItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function getTodayPracticeDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayPracticeItems(
  items: LearningItem[],
  progress: ProgressState,
  seed: string,
  dateKey = getTodayPracticeDateKey()
): LearningItem[] {
  const weakItems = getWeakLearningItems(items, progress).slice(0, DAILY_WEAK_ITEM_LIMIT);
  const weakIds = new Set(weakItems.map((item) => item.id));
  const newHighFrequencyItems = shuffleLearningItems(
    items.filter((item) => !weakIds.has(item.id) && !hasPracticeHistory(progress, item.id) && getItemTags(item).includes("HighFrequency")),
    seed,
    `Today:${dateKey}:new-high-frequency`
  );
  const remainingItems = shuffleLearningItems(
    items.filter((item) => !weakIds.has(item.id)),
    seed,
    `Today:${dateKey}:remaining`
  );

  return uniqueById([...weakItems, ...newHighFrequencyItems, ...remainingItems]).slice(0, DAILY_PRACTICE_ITEM_LIMIT);
}
