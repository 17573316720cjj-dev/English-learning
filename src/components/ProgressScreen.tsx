import type React from "react";
import type { LearningItem, ProgressState } from "../domain";

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}

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
      <p className="eyebrow">Progress</p>
      <h2>Learning progress</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total practice</span>
          <strong>{pluralize(progress.totalAttempts, "attempt", "attempts")}</strong>
        </div>
        <div className="stat-card">
          <span>Accuracy</span>
          <strong>{accuracy}% accuracy</strong>
        </div>
        <div className="stat-card">
          <span>Fill-in attempts</span>
          <strong>{progress.fillBlankAttempts}</strong>
        </div>
        <div className="stat-card">
          <span>Match attempts</span>
          <strong>{progress.phraseMatchAttempts}</strong>
        </div>
      </div>
      <h2 className="section-title">Recently practiced</h2>
      <div className="item-list">
        {recentItems.length > 0 ? (
          recentItems.map((item) => (
            <article className="library-item" key={item.id}>
              <div>
                <h3>{item.phrase}</h3>
                <p>{item.meaningZh}</p>
              </div>
              <span className="item-meta">{item.category}</span>
            </article>
          ))
        ) : (
          <p className="muted">Practice a sentence or phrase to start your local progress record.</p>
        )}
      </div>
    </section>
  );
}
