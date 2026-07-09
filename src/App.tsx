import type React from "react";
import { useMemo, useState } from "react";
import { AddItemScreen } from "./components/AddItemScreen";
import { AppNav, type Screen } from "./components/AppNav";
import { LibraryScreen } from "./components/LibraryScreen";
import { PracticeScreen } from "./components/PracticeScreen";
import { builtInItems } from "./data/builtInItems";
import type { LearningItem } from "./domain";
import { deleteCustomItem, loadCustomItems, loadProgress, saveCustomItem } from "./lib/storage";

export function App(): React.JSX.Element {
  const [activeScreen, setActiveScreen] = useState<Screen>("Practice");
  const [customItems, setCustomItems] = useState(() => loadCustomItems());
  const [progress, setProgress] = useState(() => loadProgress());

  const allItems = useMemo(() => [...builtInItems, ...customItems], [customItems]);
  const refreshProgress = (): void => setProgress(loadProgress());
  const saveItem = (item: LearningItem): void => setCustomItems(saveCustomItem(item));
  const removeItem = (itemId: string): void => setCustomItems(deleteCustomItem(itemId));

  return (
    <main className="app-shell">
      <AppNav active={activeScreen} onNavigate={setActiveScreen} />
      {activeScreen === "Practice" ? (
        <PracticeScreen items={allItems} onProgressChange={refreshProgress} />
      ) : activeScreen === "Library" ? (
        <LibraryScreen items={allItems} />
      ) : activeScreen === "Add" ? (
        <AddItemScreen items={allItems} onSave={saveItem} onDelete={removeItem} />
      ) : activeScreen === "Progress" ? (
        <section className="practice-card">
          <p className="eyebrow">Progress</p>
          <h2>{progress.totalAttempts === 1 ? "1 attempt" : `${progress.totalAttempts} attempts`}</h2>
          <p>
            {progress.totalAttempts === 0
              ? "0% accuracy"
              : `${Math.round((progress.correctAttempts / progress.totalAttempts) * 100)}% accuracy`}
          </p>
        </section>
      ) : (
        <section className="practice-card">
          <p className="eyebrow">{activeScreen}</p>
          <h2>{activeScreen}</h2>
          <p>Use Practice or Progress while this section is being connected.</p>
        </section>
      )}
    </main>
  );
}
