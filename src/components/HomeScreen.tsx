import { BarChart3, BookOpen, CalendarCheck, PencilLine, Plus, RotateCcw, Target } from "lucide-react";
import type React from "react";
import type { LearningItem } from "../domain";
import { filterLearningItems, type StudyPlanPreset, studyPlanPresets } from "../lib/studyPlans";
import type { FeatureScreen } from "./AppNav";

const navItems: Array<{
  screen: FeatureScreen;
  label: string;
  Icon: React.ComponentType<{ "aria-hidden": true; size: number; strokeWidth: number }>;
}> = [
  { screen: "Practice", label: "练习", Icon: PencilLine },
  { screen: "Review", label: "错题复习", Icon: RotateCcw },
  { screen: "Library", label: "词库", Icon: BookOpen },
  { screen: "Add", label: "添加", Icon: Plus },
  { screen: "Progress", label: "进度", Icon: BarChart3 }
];

export function HomeScreen({
  items,
  todayItemCount,
  onNavigate,
  onStartStudyPlan,
  onStartTodayPractice
}: {
  items: LearningItem[];
  todayItemCount: number;
  onNavigate(screen: FeatureScreen): void;
  onStartStudyPlan(preset: StudyPlanPreset): void;
  onStartTodayPractice(): void;
}): React.JSX.Element {
  return (
    <section className="home-screen" aria-labelledby="home-title">
      <div className="home-heading">
        <p className="eyebrow">导航</p>
        <h2 id="home-title">学习首页</h2>
      </div>

      <section className="home-section" aria-labelledby="today-practice-title">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Daily</p>
            <h2 id="today-practice-title">今日练习</h2>
          </div>
          <span className="home-section-meta">{todayItemCount} 题</span>
        </div>
        <button className="daily-practice-card" onClick={onStartTodayPractice}>
          <CalendarCheck aria-hidden={true} size={24} strokeWidth={2.2} />
          <span>开始今日练习</span>
          <small>错题优先 · 高频补充</small>
        </button>
      </section>

      <section className="home-section" aria-labelledby="study-plan-title">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Exam</p>
            <h2 id="study-plan-title">备考入口</h2>
          </div>
        </div>
        <div className="study-plan-grid">
          {studyPlanPresets.map((preset) => (
            <button className="study-plan-card" key={preset.id} onClick={() => onStartStudyPlan(preset)}>
              <Target aria-hidden={true} size={22} strokeWidth={2.2} />
              <span>{preset.title}</span>
              <small>
                {preset.subtitle} · {filterLearningItems(items, preset.filters).length} 题
              </small>
            </button>
          ))}
        </div>
      </section>

      <div className="home-grid">
        {navItems.map(({ screen, label, Icon }) => (
          <button className="home-nav-card" key={screen} onClick={() => onNavigate(screen)}>
            <Icon aria-hidden={true} size={22} strokeWidth={2.2} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
