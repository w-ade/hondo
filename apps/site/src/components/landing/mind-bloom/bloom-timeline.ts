// The scroll-linked narrative timeline. Anime.js directs the sequence; the
// timeline is built once with autoplay off and scrubbed deterministically via
// tl.seek(progress * tl.duration), so it works in both scroll directions with
// no replay glitches. The graph never reads the scroll position directly — it
// reads the BloomState object this timeline animates.

import { createTimeline, type Timeline } from "animejs";

/** Scroll-progress thresholds (fraction of the pinned section). */
export const PHASES = {
  /** end of the lone-thought hold */
  P1_END: 0.12,
  /** the bloom threshold — the signature moment */
  BLOOM: 0.34,
  /** bloom movement complete */
  P3_END: 0.62,
  /** settle complete */
  P4_END: 0.84,
  /** product chrome begins */
  CHROME: 0.85,
  /** graph becomes interactive */
  INTERACTIVE: 0.97,
} as const;

/** Continuous values the graph renderer reads every frame. */
export interface BloomState {
  /** phase 2: early context reveal, 0..1 */
  early: number;
  /** phase 3: bloom spread + reveal, 0..1 */
  bloom: number;
  /** phase 4: simulation calming / neighborhood tightening, 0..1 */
  settle: number;
  /** progressive label disclosure, 0..1 */
  labels: number;
  /** camera zoom level applied while the narrative drives the camera */
  zoom: number;
}

export function createBloomState(): BloomState {
  return { early: 0, bloom: 0, settle: 0, labels: 0, zoom: 1.7 };
}

export interface CopyEls {
  thinkFirst: HTMLElement | null;
  scrollHint: HTMLElement | null;
  organizeLater: HTMLElement | null;
  oneLiner: HTMLElement | null;
  chrome: HTMLElement | null;
}

// Timeline positions, in ms-units. Scroll progress p maps to p * DURATION.
export const DURATION = 1000;
const at = (p: number) => p * DURATION;

export function buildTimeline(state: BloomState, els: CopyEls): Timeline {
  const tl = createTimeline({ autoplay: false, defaults: { ease: "outQuad" } });

  // --- phase 1 — the thought ----------------------------------------------
  if (els.thinkFirst) {
    tl.add(els.thinkFirst, { opacity: [0, 1], translateY: [8, 0], duration: at(0.05) }, at(0.01));
    tl.add(els.thinkFirst, { opacity: 0, translateY: -6, duration: at(0.05), ease: "inOutQuad" }, at(0.11));
  }
  if (els.scrollHint) {
    tl.add(els.scrollHint, { opacity: [0, 0.6], duration: at(0.04) }, at(0.04));
    tl.add(els.scrollHint, { opacity: 0, duration: at(0.03), ease: "inOutQuad" }, at(0.1));
  }

  // --- phase 2 — early context (slow, controlled) --------------------------
  tl.add(state, { early: [0, 1], duration: at(PHASES.BLOOM - 0.13), ease: "inOutQuad" }, at(0.13));
  tl.add(state, { zoom: 1.45, duration: at(0.18), ease: "inOutQuad" }, at(0.14));

  // --- phase 3 — the bloom -------------------------------------------------
  // outExpo front-loads the movement: fast, powerful, then precise.
  tl.add(state, { bloom: [0, 1], duration: at(PHASES.P3_END - PHASES.BLOOM), ease: "outExpo" }, at(PHASES.BLOOM));
  // camera pulls back slightly after the expansion starts, revealing scale
  tl.add(state, { zoom: 0.9, duration: at(0.24), ease: "inOutCubic" }, at(PHASES.BLOOM + 0.03));
  // labels wait until the primary movement is nearly complete
  tl.add(state, { labels: [0, 1], duration: at(0.14), ease: "inOutQuad" }, at(0.5));

  // --- phase 4 — settle ----------------------------------------------------
  tl.add(state, { settle: [0, 1], duration: at(PHASES.P4_END - PHASES.P3_END), ease: "inOutQuad" }, at(PHASES.P3_END));
  tl.add(state, { zoom: 1.0, duration: at(0.18), ease: "inOutQuad" }, at(PHASES.P3_END + 0.02));

  if (els.organizeLater) {
    tl.add(els.organizeLater, { opacity: [0, 1], translateY: [10, 0], duration: at(0.06), ease: "outCubic" }, at(0.64));
    tl.add(els.organizeLater, { opacity: 0, translateY: -6, duration: at(0.05), ease: "inOutQuad" }, at(0.8));
  }
  if (els.oneLiner) {
    tl.add(els.oneLiner, { opacity: [0, 1], translateY: [10, 0], duration: at(0.06), ease: "outCubic" }, at(0.72));
    tl.add(els.oneLiner, { opacity: 0, translateY: -6, duration: at(0.05), ease: "inOutQuad" }, at(0.8));
  }

  // --- phase 5 — product transition ---------------------------------------
  if (els.chrome) {
    tl.add(els.chrome, { opacity: [0, 1], duration: at(0.1), ease: "outQuad" }, at(PHASES.CHROME));
  }

  // pad the timeline to exactly DURATION so seek(p * DURATION) spans the section
  tl.add(state, { labels: 1, duration: 1 }, DURATION - 1);

  return tl;
}
