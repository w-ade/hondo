import type { Transition } from "framer-motion";

/**
 * Motion vocabulary for the hero. Every spring here is critically damped —
 * it settles, it never overshoots. Durations land in the 150–300ms band.
 *
 * Nothing floats, nothing bounces, nothing tilts. The window is furniture;
 * only the software inside it moves.
 */

/** Panel swaps, expands — the workhorse. ~260ms to settle, no overshoot. */
export const spring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 42,
  mass: 0.7,
};

/** Selection pills and tab underlines. Slightly quicker. */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 560,
  damping: 46,
  mass: 0.6,
};

/** Hover and opacity-only changes. A spring here would be noise. */
export const fade: Transition = { duration: 0.16, ease: [0.4, 0, 0.2, 1] };

/** Content entering the document pane or the agent thread. */
export const enter = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

/** Reduced motion: cross-fade only, no travel. */
export const enterReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const stagger = (i: number) => ({ ...spring, delay: 0.04 * i });
