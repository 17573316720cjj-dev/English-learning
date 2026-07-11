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
        <p className="eyebrow">PhrasePractice</p>
        <h1>English Phrase Practice</h1>
      </div>
      {active === "Home" ? null : (
        <nav className="top-nav" aria-label="Main navigation">
          <button
            className="nav-button home-button"
            onClick={() => onNavigate("Home")}
          >
            <Home aria-hidden={true} size={18} strokeWidth={2.2} />
            <span>Home</span>
          </button>
        </nav>
      )}
    </header>
  );
}
