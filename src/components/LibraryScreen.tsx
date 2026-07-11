import type React from "react";
import { useState } from "react";
import type { ExamLevel, LearningItem, PhraseCategory, PhraseDifficulty, PhraseTag } from "../domain";
import { examLevelLabels } from "../data/examItems";
import { categoryLabels, difficultyLabels } from "../lib/labels";
import { getItemTags, phraseTagLabels } from "../lib/tags";
import { FilterSummary } from "./FilterSummary";

const categoryFilters: Array<PhraseCategory | "All"> = ["All", "Basic", "CET", "Speaking", "Writing", "Daily"];
const examFilters: Array<ExamLevel | "All"> = ["All", "CET4", "CET6", "TEM4", "TEM8"];
const tagFilters: Array<PhraseTag | "All"> = ["All", "HighFrequency", "Writing", "Reading", "Translation", "Speaking"];
const difficultyFilters: Array<PhraseDifficulty | "All"> = ["All", "Basic", "Intermediate", "Advanced"];
const categoryFilterLabels: Record<PhraseCategory | "All", string> = {
  All: "全部",
  ...categoryLabels
};
const tagFilterLabels: Record<PhraseTag | "All", string> = {
  All: "全部",
  ...phraseTagLabels
};
const difficultyFilterLabels: Record<PhraseDifficulty | "All", string> = {
  All: "全部",
  ...difficultyLabels
};

function getExamFilterLabel(filter: ExamLevel | "All"): string {
  return filter === "All" ? "全部" : examLevelLabels[filter];
}

export function LibraryScreen({ items }: { items: LearningItem[] }): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<PhraseCategory | "All">("All");
  const [activeExamLevel, setActiveExamLevel] = useState<ExamLevel | "All">("All");
  const [activeTag, setActiveTag] = useState<PhraseTag | "All">("All");
  const [activeDifficulty, setActiveDifficulty] = useState<PhraseDifficulty | "All">("All");
  const visibleItems = items.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesExamLevel = activeExamLevel === "All" || item.examLevel === activeExamLevel;
    const matchesTag = activeTag === "All" || getItemTags(item).includes(activeTag);
    const matchesDifficulty = activeDifficulty === "All" || item.difficulty === activeDifficulty;

    return matchesCategory && matchesExamLevel && matchesTag && matchesDifficulty;
  });
  const activeFilterLabels = [
    activeExamLevel === "All" ? null : getExamFilterLabel(activeExamLevel),
    activeCategory === "All" ? null : categoryFilterLabels[activeCategory],
    activeTag === "All" ? null : tagFilterLabels[activeTag],
    activeDifficulty === "All" ? null : difficultyFilterLabels[activeDifficulty]
  ].filter((label): label is string => Boolean(label));

  const resetFilters = (): void => {
    setActiveCategory("All");
    setActiveExamLevel("All");
    setActiveTag("All");
    setActiveDifficulty("All");
  };

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
      <div className="filter-section">
        <span className="filter-label">标签</span>
        <div className="filter-row" aria-label="标签筛选">
          {tagFilters.map((filter) => (
            <button
              key={filter}
              className={activeTag === filter ? "nav-button active" : "nav-button"}
              onClick={() => setActiveTag(filter)}
            >
              {tagFilterLabels[filter]}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <span className="filter-label">难度</span>
        <div className="filter-row" aria-label="难度筛选">
          {difficultyFilters.map((filter) => (
            <button
              key={filter}
              className={activeDifficulty === filter ? "nav-button active" : "nav-button"}
              onClick={() => setActiveDifficulty(filter)}
            >
              {difficultyFilterLabels[filter]}
            </button>
          ))}
        </div>
      </div>
      <FilterSummary activeFilters={activeFilterLabels} itemCount={visibleItems.length} onReset={resetFilters} />
      <div className="item-list">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <article className="library-item" key={item.id}>
              <div>
                <h3>{item.phrase}</h3>
                <p>{item.meaningZh}</p>
                <p className="muted">{item.example}</p>
              </div>
              <div className="item-meta-list">
                <span className="item-meta">{categoryLabels[item.category]}</span>
                <span className="item-meta">{difficultyLabels[item.difficulty]}</span>
                {getItemTags(item).map((tag) => (
                  <span className="item-meta" key={tag}>
                    {phraseTagLabels[tag]}
                  </span>
                ))}
              </div>
            </article>
          ))
        ) : (
          <p className="muted">当前筛选下暂无内容，可重置筛选或选择其他标签。</p>
        )}
      </div>
    </section>
  );
}
