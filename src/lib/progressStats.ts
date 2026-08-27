import type { ExamLevel, LearningItem, PhraseTag, ProgressState } from "../domain";
import { getItemTags } from "./tags";

export const examProgressLevels: ExamLevel[] = ["CET4", "CET6", "TEM4", "TEM8"];
export const progressTagOrder: PhraseTag[] = ["HighFrequency", "Writing", "Reading", "Translation", "Speaking"];

export interface TagProgressSummary {
  tag: PhraseTag;
  totalItems: number;
  practicedItems: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
}

export interface ExamProgressSummary {
  examLevel: ExamLevel;
  totalItems: number;
  practicedItems: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  weakItems: number;
  tagSummaries: TagProgressSummary[];
  focusTag: TagProgressSummary | null;
}

function getCounts(progress: ProgressState, itemId: string): { correct: number; incorrect: number } {
  return progress.perItem[itemId] ?? { correct: 0, incorrect: 0 };
}

function getAttemptCount(progress: ProgressState, item: LearningItem): number {
  const counts = getCounts(progress, item.id);
  return counts.correct + counts.incorrect;
}

function getAccuracy(correctAttempts: number, totalAttempts: number): number {
  return totalAttempts === 0 ? 0 : Math.round((correctAttempts / totalAttempts) * 100);
}

function isWeak(progress: ProgressState, item: LearningItem): boolean {
  const counts = getCounts(progress, item.id);
  return counts.incorrect > 0 && counts.incorrect >= counts.correct;
}

function getTagSummary(items: LearningItem[], progress: ProgressState, tag: PhraseTag): TagProgressSummary {
  const taggedItems = items.filter((item) => getItemTags(item).includes(tag));
  const correctAttempts = taggedItems.reduce((total, item) => total + getCounts(progress, item.id).correct, 0);
  const totalAttempts = taggedItems.reduce((total, item) => total + getAttemptCount(progress, item), 0);

  return {
    tag,
    totalItems: taggedItems.length,
    practicedItems: taggedItems.filter((item) => getAttemptCount(progress, item) > 0).length,
    totalAttempts,
    correctAttempts,
    accuracy: getAccuracy(correctAttempts, totalAttempts)
  };
}

function compareFocusTags(left: TagProgressSummary, right: TagProgressSummary): number {
  const leftUnstarted = left.totalItems > 0 && left.totalAttempts === 0 ? 1 : 0;
  const rightUnstarted = right.totalItems > 0 && right.totalAttempts === 0 ? 1 : 0;

  return (
    rightUnstarted - leftUnstarted ||
    left.accuracy - right.accuracy ||
    right.totalItems - left.totalItems ||
    progressTagOrder.indexOf(left.tag) - progressTagOrder.indexOf(right.tag)
  );
}

function getFocusTag(tagSummaries: TagProgressSummary[]): TagProgressSummary | null {
  const availableTags = tagSummaries.filter((summary) => summary.totalItems > 0);
  if (availableTags.length === 0) return null;

  return [...availableTags].sort(compareFocusTags)[0] ?? null;
}

export function getExamProgressSummaries(
  items: LearningItem[],
  progress: ProgressState
): ExamProgressSummary[] {
  return examProgressLevels.map((examLevel) => {
    const examItems = items.filter((item) => item.examLevel === examLevel);
    const correctAttempts = examItems.reduce((total, item) => total + getCounts(progress, item.id).correct, 0);
    const totalAttempts = examItems.reduce((total, item) => total + getAttemptCount(progress, item), 0);
    const tagSummaries = progressTagOrder.map((tag) => getTagSummary(examItems, progress, tag));

    return {
      examLevel,
      totalItems: examItems.length,
      practicedItems: examItems.filter((item) => getAttemptCount(progress, item) > 0).length,
      totalAttempts,
      correctAttempts,
      accuracy: getAccuracy(correctAttempts, totalAttempts),
      weakItems: examItems.filter((item) => isWeak(progress, item)).length,
      tagSummaries,
      focusTag: getFocusTag(tagSummaries)
    };
  });
}
