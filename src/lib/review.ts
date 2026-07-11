import type { LearningItem, ProgressState } from "../domain";

function getCounts(progress: ProgressState, itemId: string): { correct: number; incorrect: number } {
  return progress.perItem[itemId] ?? { correct: 0, incorrect: 0 };
}

export function getItemReviewCounts(progress: ProgressState, itemId: string): { correct: number; incorrect: number } {
  return getCounts(progress, itemId);
}

function compareByWeakness(progress: ProgressState, left: LearningItem, right: LearningItem): number {
  const leftCounts = getCounts(progress, left.id);
  const rightCounts = getCounts(progress, right.id);

  return (
    rightCounts.incorrect - leftCounts.incorrect ||
    leftCounts.correct - rightCounts.correct ||
    left.phrase.localeCompare(right.phrase)
  );
}

export function getWrongLearningItems(items: LearningItem[], progress: ProgressState): LearningItem[] {
  const itemById = new Map(items.map((item) => [item.id, item]));
  const recentWrongItems = progress.recentItemIds
    .map((id) => itemById.get(id))
    .filter((item): item is LearningItem => Boolean(item && getCounts(progress, item.id).incorrect > 0));
  const remainingWrongItems = items
    .filter((item) => getCounts(progress, item.id).incorrect > 0)
    .filter((item) => !recentWrongItems.some((recentItem) => recentItem.id === item.id))
    .sort((left, right) => compareByWeakness(progress, left, right));

  return [...recentWrongItems, ...remainingWrongItems];
}

export function getWeakLearningItems(items: LearningItem[], progress: ProgressState): LearningItem[] {
  return items
    .filter((item) => {
      const counts = getCounts(progress, item.id);
      return counts.incorrect > 0 && counts.incorrect >= counts.correct;
    })
    .sort((left, right) => compareByWeakness(progress, left, right));
}
