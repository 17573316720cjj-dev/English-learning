import type React from "react";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AddItemScreen } from "./components/AddItemScreen";
import { AppNav, type Screen } from "./components/AppNav";
import { HomeScreen } from "./components/HomeScreen";
import { LibraryScreen } from "./components/LibraryScreen";
import { PracticeScreen } from "./components/PracticeScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import { ReviewScreen } from "./components/ReviewScreen";
import { builtInItems } from "./data/builtInItems";
import type { LearningItem } from "./domain";
import { deleteCustomItem, loadCustomItems, loadProgress, loadUserSeed, saveCustomItem } from "./lib/storage";
import {
  type PracticeLaunchConfig,
  type StudyPlanPreset,
  getTodayPracticeDateKey,
  getTodayPracticeItems
} from "./lib/studyPlans";

export function App(): React.JSX.Element {
  const [activeScreen, setActiveScreen] = useState<Screen>("Home");
  const [customItems, setCustomItems] = useState(() => loadCustomItems());
  const [progress, setProgress] = useState(() => loadProgress());
  const [practiceLaunch, setPracticeLaunch] = useState<PracticeLaunchConfig | null>(null);

  const allItems = useMemo(() => [...builtInItems, ...customItems], [customItems]);
  const todayDateKey = getTodayPracticeDateKey();
  const todayPracticeItems = useMemo(
    () => getTodayPracticeItems(allItems, progress, loadUserSeed(), todayDateKey),
    [allItems, progress, todayDateKey]
  );
  const refreshProgress = (): void => setProgress(loadProgress());
  const saveItem = (item: LearningItem): void => setCustomItems(saveCustomItem(item));
  const removeItem = (itemId: string): void => setCustomItems(deleteCustomItem(itemId));
  const navigateToFeature = (screen: Screen): void => {
    if (screen === "Practice") {
      setPracticeLaunch(null);
    }
    setActiveScreen(screen);
  };
  const startStudyPlan = (preset: StudyPlanPreset): void => {
    setPracticeLaunch({
      title: preset.title,
      description: preset.subtitle,
      filters: preset.filters
    });
    setActiveScreen("Practice");
  };
  const startTodayPractice = (): void => {
    setPracticeLaunch({
      title: "今日练习",
      description: "错题优先，补充高频新短语",
      itemIds: todayPracticeItems.map((item) => item.id),
      scopeId: `Today:${todayDateKey}`
    });
    setActiveScreen("Practice");
  };

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
        <HomeScreen
          items={allItems}
          todayItemCount={todayPracticeItems.length}
          onNavigate={navigateToFeature}
          onStartStudyPlan={startStudyPlan}
          onStartTodayPractice={startTodayPractice}
        />
      ) : activeScreen === "Practice" ? (
        <PracticeScreen items={allItems} launchConfig={practiceLaunch} onProgressChange={refreshProgress} />
      ) : activeScreen === "Review" ? (
        <ReviewScreen items={allItems} progress={progress} onProgressChange={refreshProgress} />
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
