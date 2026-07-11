import type React from "react";
import { useState } from "react";
import type { LearningItem, ProgressState } from "../domain";
import { categoryLabels, formatAttemptCount } from "../lib/labels";
import { getItemReviewCounts, getWeakLearningItems, getWrongLearningItems } from "../lib/review";
import { PracticeScreen } from "./PracticeScreen";

function ReviewItemCard({
  item,
  progress
}: {
  item: LearningItem;
  progress: ProgressState;
}): React.JSX.Element {
  const counts = getItemReviewCounts(progress, item.id);

  return (
    <article className="library-item">
      <div>
        <h3>{item.phrase}</h3>
        <p>{item.meaningZh}</p>
        <p className="muted">
          错误 {formatAttemptCount(counts.incorrect)} · 正确 {formatAttemptCount(counts.correct)}
        </p>
      </div>
      <span className="item-meta">{categoryLabels[item.category]}</span>
    </article>
  );
}

export function ReviewScreen({
  items,
  progress,
  onProgressChange
}: {
  items: LearningItem[];
  progress: ProgressState;
  onProgressChange(): void;
}): React.JSX.Element {
  const [isReviewing, setIsReviewing] = useState(false);
  const wrongItems = getWrongLearningItems(items, progress);
  const weakItems = getWeakLearningItems(items, progress);

  if (isReviewing) {
    return (
      <section className="screen-grid">
        <div className="practice-card">
          <p className="eyebrow">错题复习</p>
          <h2>薄弱短语复习</h2>
          <p className="muted">本轮只练习当前仍然薄弱的短语。</p>
          <button className="nav-button" onClick={() => setIsReviewing(false)}>
            查看错题本
          </button>
        </div>
        <PracticeScreen items={weakItems} onProgressChange={onProgressChange} />
      </section>
    );
  }

  return (
    <section className="practice-card">
      <p className="eyebrow">错题复习</p>
      <h2>错题复习</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <span>错题本</span>
          <strong>{wrongItems.length}</strong>
        </div>
        <div className="stat-card">
          <span>薄弱短语</span>
          <strong>{weakItems.length}</strong>
        </div>
      </div>

      {weakItems.length > 0 ? (
        <button className="primary-button" onClick={() => setIsReviewing(true)}>
          开始复习
        </button>
      ) : null}

      <h2 className="section-title">薄弱短语</h2>
      <div className="item-list">
        {weakItems.length > 0 ? (
          weakItems.map((item) => <ReviewItemCard item={item} key={item.id} progress={progress} />)
        ) : (
          <p className="muted">还没有错题</p>
        )}
      </div>

      <h2 className="section-title">错题本</h2>
      <div className="item-list">
        {wrongItems.length > 0 ? (
          wrongItems.map((item) => <ReviewItemCard item={item} key={item.id} progress={progress} />)
        ) : (
          <p className="muted">完成一次练习后，这里会记录需要复习的短语。</p>
        )}
      </div>
    </section>
  );
}
