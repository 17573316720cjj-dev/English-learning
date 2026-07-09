import type React from "react";
import { useState } from "react";
import type { ExamLevel, LearningItem, PhraseCategory } from "../domain";
import { examLevelLabels } from "../data/examItems";

const categoryFilters: Array<PhraseCategory | "All"> = ["All", "Basic", "CET", "Speaking", "Writing", "Daily"];
const examFilters: Array<ExamLevel | "All"> = ["All", "CET4", "CET6", "TEM4", "TEM8"];

function getExamFilterLabel(filter: ExamLevel | "All"): string {
  return filter === "All" ? "All" : examLevelLabels[filter];
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
      <p className="eyebrow">Library</p>
      <h2>Phrase library</h2>
      <div className="filter-section">
        <span className="filter-label">Exam</span>
        <div className="filter-row" aria-label="Exam filters">
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
        <span className="filter-label">Category</span>
        <div className="filter-row" aria-label="Category filters">
          {categoryFilters.map((filter) => (
            <button
              key={filter}
              className={activeCategory === filter ? "nav-button active" : "nav-button"}
              onClick={() => setActiveCategory(filter)}
            >
              {filter}
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
            <span className="item-meta">{item.category}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
