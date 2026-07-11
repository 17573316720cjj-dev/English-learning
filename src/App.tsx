import type React from "react";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AddItemScreen } from "./components/AddItemScreen";
import { AppNav, type Screen } from "./components/AppNav";
import { HomeScreen } from "./components/HomeScreen";
import { LibraryScreen } from "./components/LibraryScreen";
import { PracticeScreen } from "./components/PracticeScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import { builtInItems } from "./data/builtInItems";
import type { LearningItem } from "./domain";
import { deleteCustomItem, loadCustomItems, loadProgress, saveCustomItem } from "./lib/storage";

export function App(): React.JSX.Element {
  const [activeScreen, setActiveScreen] = useState<Screen>("Home");
  const [customItems, setCustomItems] = useState(() => loadCustomItems());
  const [progress, setProgress] = useState(() => loadProgress());

  const allItems = useMemo(() => [...builtInItems, ...customItems], [customItems]);
  const refreshProgress = (): void => setProgress(loadProgress());
  const saveItem = (item: LearningItem): void => setCustomItems(saveCustomItem(item));
  const removeItem = (itemId: string): void => setCustomItems(deleteCustomItem(itemId));

  return (
    <main className="app-shell">
      <AppNav />
      {activeScreen === "Home" ? null : (
        <button className="back-home-button" onClick={() => setActiveScreen("Home")}>
          <ArrowLeft aria-hidden={true} size={18} strokeWidth={2.1} />
          <span>返回首页</span>
        </button>
      )}
      {activeScreen === "Home" ? (
        <HomeScreen onNavigate={setActiveScreen} />
      ) : activeScreen === "Practice" ? (
        <PracticeScreen items={allItems} onProgressChange={refreshProgress} />
      ) : activeScreen === "Library" ? (
        <LibraryScreen items={allItems} />
      ) : activeScreen === "Add" ? (
        <AddItemScreen items={allItems} onSave={saveItem} onDelete={removeItem} />
      ) : activeScreen === "Progress" ? (
        <ProgressScreen progress={progress} items={allItems} />
      ) : null}
    </main>
  );
}
