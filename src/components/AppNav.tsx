import { Home } from "lucide-react";
import type React from "react";

export type FeatureScreen = "Practice" | "Library" | "Add" | "Progress";
export type Screen = "Home" | FeatureScreen;

export function AppNav({
  active,
  onNavigate
}: {
  active: Screen;
  onNavigate(screen: Screen): void;
}): React.JSX.Element {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">英语学习</p>
        <h1>英语短语练习</h1>
      </div>
      {active === "Home" ? null : (
        <nav className="top-nav" aria-label="主导航">
          <button
            className="nav-button home-button"
            onClick={() => onNavigate("Home")}
          >
            <Home aria-hidden={true} size={18} strokeWidth={2.2} />
            <span>首页</span>
          </button>
        </nav>
      )}
    </header>
  );
}
