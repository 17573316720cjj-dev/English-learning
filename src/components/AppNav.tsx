import type React from "react";

export type FeatureScreen = "Practice" | "Library" | "Add" | "Progress";
export type Screen = "Home" | FeatureScreen;

export function AppNav(): React.JSX.Element {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">英语学习</p>
        <h1>英语短语练习</h1>
      </div>
    </header>
  );
}
