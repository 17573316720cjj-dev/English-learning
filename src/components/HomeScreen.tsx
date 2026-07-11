import { BarChart3, BookOpen, PencilLine, Plus } from "lucide-react";
import type React from "react";
import type { FeatureScreen } from "./AppNav";

const navItems: Array<{
  screen: FeatureScreen;
  label: string;
  Icon: React.ComponentType<{ "aria-hidden": true; size: number; strokeWidth: number }>;
}> = [
  { screen: "Practice", label: "练习", Icon: PencilLine },
  { screen: "Library", label: "词库", Icon: BookOpen },
  { screen: "Add", label: "添加", Icon: Plus },
  { screen: "Progress", label: "进度", Icon: BarChart3 }
];

export function HomeScreen({ onNavigate }: { onNavigate(screen: FeatureScreen): void }): React.JSX.Element {
  return (
    <section className="home-screen" aria-labelledby="home-title">
      <div className="home-heading">
        <p className="eyebrow">导航</p>
        <h2 id="home-title">学习首页</h2>
      </div>

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
