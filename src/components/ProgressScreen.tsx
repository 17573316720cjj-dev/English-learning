import type React from "react";
import type { LearningItem, ProgressState } from "../domain";
import { categoryLabels, formatAttemptCount } from "../lib/labels";

export function ProgressScreen({
  progress,
  items
}: {
  progress: ProgressState;
  items: LearningItem[];
}): React.JSX.Element {
  const accuracy =
    progress.totalAttempts === 0 ? 0 : Math.round((progress.correctAttempts / progress.totalAttempts) * 100);
  const recentItems = progress.recentItemIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is LearningItem => Boolean(item));

  return (
    <section className="practice-card">
      <p className="eyebrow">进度</p>
      <h2>学习进度</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span>总练习</span>
          <strong>{formatAttemptCount(progress.totalAttempts)}</strong>
        </div>
        <div className="stat-card">
          <span>正确率</span>
          <strong>{accuracy}%</strong>
        </div>
        <div className="stat-card">
          <span>句子填空</span>
          <strong>{progress.fillBlankAttempts}</strong>
        </div>
        <div className="stat-card">
          <span>短语匹配</span>
          <strong>{progress.phraseMatchAttempts}</strong>
        </div>
      </div>
      <h2 className="section-title">最近练习</h2>
      <div className="item-list">
        {recentItems.length > 0 ? (
          recentItems.map((item) => (
            <article className="library-item" key={item.id}>
              <div>
                <h3>{item.phrase}</h3>
                <p>{item.meaningZh}</p>
              </div>
              <span className="item-meta">{categoryLabels[item.category]}</span>
            </article>
          ))
        ) : (
          <p className="muted">完成一次句子或短语练习后，这里会记录你的进度。</p>
        )}
      </div>
    </section>
  );
}
