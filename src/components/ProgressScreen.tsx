import type React from "react";
import type { LearningItem, ProgressState } from "../domain";
import { examLevelLabels } from "../data/examItems";
import { categoryLabels, formatAttemptCount } from "../lib/labels";
import { getExamProgressSummaries, type ExamProgressSummary } from "../lib/progressStats";
import { phraseTagLabels } from "../lib/tags";

function ExamProgressCard({ summary }: { summary: ExamProgressSummary }): React.JSX.Element {
  const examLabel = examLevelLabels[summary.examLevel];

  return (
    <article className="exam-progress-card" aria-label={`${examLabel} 进度`}>
      <div className="exam-progress-card-header">
        <h3>{examLabel}</h3>
        <span className="item-meta">{summary.totalAttempts > 0 ? `正确率 ${summary.accuracy}%` : "尚未开始"}</span>
      </div>
      <div className="exam-progress-metrics">
        <span>已练 {summary.practicedItems} / {summary.totalItems}</span>
        <span>练习 {formatAttemptCount(summary.totalAttempts)}</span>
        <span>薄弱 {summary.weakItems}</span>
      </div>
      <div className="tag-progress-row">
        {summary.tagSummaries
          .filter((tagSummary) => tagSummary.totalItems > 0)
          .map((tagSummary) => (
            <span className="item-meta" key={tagSummary.tag}>
              {phraseTagLabels[tagSummary.tag]} {tagSummary.totalAttempts > 0 ? `${tagSummary.accuracy}%` : "未练"}
            </span>
          ))}
      </div>
      <p className="muted">
        {summary.focusTag ? `重点补：${phraseTagLabels[summary.focusTag.tag]}` : "暂无考试内容"}
      </p>
    </article>
  );
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
  const examProgressSummaries = getExamProgressSummaries(items, progress);

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
      <h2 className="section-title">考试目标进度</h2>
      <div className="exam-progress-grid">
        {examProgressSummaries.map((summary) => (
          <ExamProgressCard key={summary.examLevel} summary={summary} />
        ))}
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
