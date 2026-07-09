import type React from "react";
import { useState } from "react";
import type { LearningItem, PhraseCategory } from "../domain";

const filters: Array<PhraseCategory | "All"> = ["All", "Basic", "CET", "Speaking", "Writing", "Daily"];

export function LibraryScreen({ items }: { items: LearningItem[] }): React.JSX.Element {
  const [activeFilter, setActiveFilter] = useState<PhraseCategory | "All">("All");
  const visibleItems = activeFilter === "All" ? items : items.filter((item) => item.category === activeFilter);

  return (
    <section className="practice-card">
      <p className="eyebrow">Library</p>
      <h2>Phrase library</h2>
      <div className="filter-row" aria-label="Category filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? "nav-button active" : "nav-button"}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
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
