import type React from "react";
import { useMemo, useState } from "react";
import { AppNav, type Screen } from "./components/AppNav";
import { PracticeScreen } from "./components/PracticeScreen";
import { builtInItems } from "./data/builtInItems";
import { loadCustomItems, loadProgress } from "./lib/storage";

export function App(): React.JSX.Element {
  const [activeScreen, setActiveScreen] = useState<Screen>("Practice");
  const [customItems] = useState(() => loadCustomItems());
  const [progress, setProgress] = useState(() => loadProgress());

  const allItems = useMemo(() => [...builtInItems, ...customItems], [customItems]);
  const refreshProgress = (): void => setProgress(loadProgress());

  return (
    <main className="app-shell">
      <AppNav active={activeScreen} onNavigate={setActiveScreen} />
      {activeScreen === "Practice" ? (
        <PracticeScreen items={allItems} onProgressChange={refreshProgress} />
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
