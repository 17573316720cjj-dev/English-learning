import type React from "react";

export type Screen = "Practice" | "Library" | "Add" | "Progress";

const screens: Screen[] = ["Practice", "Library", "Add", "Progress"];

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
      <nav className="top-nav" aria-label="Main navigation">
        {screens.map((screen) => (
          <button
            key={screen}
            className={active === screen ? "nav-button active" : "nav-button"}
            onClick={() => onNavigate(screen)}
          >
            {screen}
          </button>
        ))}
      </nav>
    </header>
  );
}
