import type React from "react";

export function FilterSummary({
  activeFilters,
  itemCount,
  onReset
}: {
  activeFilters: string[];
  itemCount: number;
  onReset(): void;
}): React.JSX.Element {
  return (
    <div className="filter-summary" aria-label="筛选状态">
      <div>
        <strong>当前 {itemCount} 条内容</strong>
        {activeFilters.length > 0 ? <p className="muted">{activeFilters.join(" · ")}</p> : null}
      </div>
      {activeFilters.length > 0 ? (
        <button className="nav-button" onClick={onReset}>
          重置筛选
        </button>
      ) : null}
    </div>
  );
}
