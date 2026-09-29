"use client";

import { useState } from "react";
import styles from "./ThemeToggle.module.css";

// Ported from Portbrowser (site/app/ThemeToggle.tsx). A half-filled circle in
// the top-right corner. The page follows the device until this is clicked;
// then it flips to the other theme and remembers the choice (localStorage
// "theme"). The saved choice is applied before paint by the inline script in
// app/layout.tsx, so there is no flash on load.
//
// Each tap spins the circle half a turn, so the filled half swings to the
// other side, with a little overshoot to settle; the button dips while pressed.
// Reduced motion keeps the swap and drops the spin.

const KEY = "theme";

function current(): "light" | "dark" {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  // half-turns taken; only ever grows, so every tap spins the same way
  const [turns, setTurns] = useState(0);
  const flip = () => {
    setTurns((t) => t + 1);
    const next = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode: still flips, just isn't remembered */
    }
  };

  return (
    <button type="button" onClick={flip} aria-label="Toggle dark mode" className={styles.toggle}>
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
        className={styles.icon}
        style={{ transform: `rotate(${turns * 180}deg)` }}
      >
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
      </svg>
    </button>
  );
}
