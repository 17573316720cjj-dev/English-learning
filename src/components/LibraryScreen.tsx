import type React from "react";
import { useState } from "react";
import type { ExamLevel, LearningItem, PhraseCategory } from "../domain";
import { examLevelLabels } from "../data/examItems";
import { categoryLabels } from "../lib/labels";

const categoryFilters: Array<PhraseCategory | "All"> = ["All", "Basic", "CET", "Speaking", "Writing", "Daily"];
const examFilters: Array<ExamLevel | "All"> = ["All", "CET4", "CET6", "TEM4", "TEM8"];
const categoryFilterLabels: Record<PhraseCategory | "All", string> = {
  All: "全部",
  ...categoryLabels
};

function getExamFilterLabel(filter: ExamLevel | "All"): string {
  return filter === "All" ? "全部" : examLevelLabels[filter];
}

export function LibraryScreen({ items }: { items: LearningItem[] }): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<PhraseCategory | "All">("All");
  const [activeExamLevel, setActiveExamLevel] = useState<ExamLevel | "All">("All");
  const visibleItems = items.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesExamLevel = activeExamLevel === "All" || item.examLevel === activeExamLevel;

    return matchesCategory && matchesExamLevel;
  });

  return (
    <section className="practice-card">
      <p className="eyebrow">词库</p>
      <h2>短语词库</h2>
      <div className="filter-section">
        <span className="filter-label">考试</span>
        <div className="filter-row" aria-label="考试筛选">
          {examFilters.map((filter) => (
            <button
              key={filter}
              className={activeExamLevel === filter ? "nav-button active" : "nav-button"}
              onClick={() => setActiveExamLevel(filter)}
            >
              {getExamFilterLabel(filter)}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <span className="filter-label">分类</span>
        <div className="filter-row" aria-label="分类筛选">
          {categoryFilters.map((filter) => (
            <button
              key={filter}
              className={activeCategory === filter ? "nav-button active" : "nav-button"}
              onClick={() => setActiveCategory(filter)}
            >
              {categoryFilterLabels[filter]}
            </button>
          ))}
        </div>
      </div>
      <div className="item-list">
        {visibleItems.map((item) => (
          <article className="library-item" key={item.id}>
            <div>
              <h3>{item.phrase}</h3>
              <p>{item.meaningZh}</p>
              <p className="muted">{item.example}</p>
            </div>
            <span className="item-meta">{categoryLabels[item.category]}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
