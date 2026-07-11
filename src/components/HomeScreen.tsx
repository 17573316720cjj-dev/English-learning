import { BarChart3, BookOpen, PencilLine, Plus } from "lucide-react";
import type React from "react";
import type { FeatureScreen } from "./AppNav";

const navItems: Array<{
  screen: FeatureScreen;
  Icon: React.ComponentType<{ "aria-hidden": true; size: number; strokeWidth: number }>;
}> = [
  { screen: "Practice", Icon: PencilLine },
  { screen: "Library", Icon: BookOpen },
  { screen: "Add", Icon: Plus },
  { screen: "Progress", Icon: BarChart3 }
];

export function HomeScreen({ onNavigate }: { onNavigate(screen: FeatureScreen): void }): React.JSX.Element {
  return (
    <section className="home-screen" aria-labelledby="home-title">
      <div className="home-heading">
        <p className="eyebrow">Navigation</p>
        <h2 id="home-title">Study dashboard</h2>
      </div>

      <div className="home-grid">
        {navItems.map(({ screen, Icon }) => (
          <button className="home-nav-card" key={screen} onClick={() => onNavigate(screen)}>
            <Icon aria-hidden={true} size={22} strokeWidth={2.2} />
            <span>{screen}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
