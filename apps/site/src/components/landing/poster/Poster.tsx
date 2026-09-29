"use client";

import { useEffect, useRef, useState } from "react";
import { HondoWordmark } from "../wordmark/HondoWordmark";
import styles from "./styles.module.css";

/** The phrase the scripted cursor selects (set in caps by .aside). */
const DEMO_PHRASE = "on macOS";
/** The live toolbar keeps at least this far from the viewport's sides. */
const EDGE = 16;
/** Room between the overlay and the text it frames; mirrors --pad-x/--pad-y in styles.module.css. */
const PAD_X = 10;
const PAD_Y = 8;
const ACTIONS = ["Inspect", "Ask", "Annotate", "Keep"] as const;

/** The visitor's selection: the box around all of it, in page coordinates. */
type LiveSelection = { top: number; left: number; width: number; height: number; text: string };

/**
 * The toolbar's two looks under comparison, switchable from the corner of the
 * page (or ?toolbar=light|dark). Temporary: keep the one that wins.
 */
const THEMES = ["light", "dark"] as const;
type Theme = (typeof THEMES)[number];

/**
 * The landing as a type-specimen poster (after the ©Mamoth sheet): the
 * wordmark, one huge sentence, a boiling outline of the wordmark, and small
 * print in the corners.
 *
 * The page demonstrates the product on itself. On load a cursor comes in and
 * selects the ON MACOS at the end of the big sentence, and Hondo's toolbar
 * opens over it. After that the visitor can select any text on the
 * page and the same toolbar follows their selection.
 */
export function Poster() {
  const mainRef = useRef<HTMLElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const replayIconRef = useRef<SVGSVGElement>(null);
  const replayTurns = useRef(0);
  const [playKey, setPlayKey] = useState(0);
  const [width, setWidth] = useState(0);
  const [live, setLive] = useState<LiveSelection | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");

  // Measure the phrase once the webfont is in, then play. Re-measure on
  // resize so a replay after the text reflows still lands on it.
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    let cancelled = false;
    const measure = () => setWidth(target.offsetWidth);
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const asked = new URLSearchParams(window.location.search).get("toolbar");
      if (asked === "light" || asked === "dark") setTheme(asked);
      measure();
      setPlayKey(1);
    });
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  // The visitor's own selections: however much text, one overlay around all
  // of it and the pill over that. Drawn once the pointer or key is released
  // (or, for touch handles, once the selection has settled), so it doesn't
  // chase the drag; cleared when the selection collapses or the page reflows.
  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    let pointerDown = false;
    let settle = 0;
    const read = () => {
      const selection = document.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) return setLive(null);
      const range = selection.getRangeAt(0);
      const text = selection.toString().replace(/\s+/g, " ").trim();
      if (!text || !root.contains(range.commonAncestorContainer)) return setLive(null);
      const box = range.getBoundingClientRect();
      setLive({
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
        width: box.width,
        height: box.height,
        text,
      });
      setPlayKey(0); // the visitor has taken over; retire the scripted run
    };
    const onPress = () => {
      pointerDown = true;
    };
    const onRelease = () => {
      pointerDown = false;
      requestAnimationFrame(read);
    };
    const onChange = () => {
      const selection = document.getSelection();
      if (!selection || selection.isCollapsed) return setLive(null);
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (!pointerDown) read();
      }, 300);
    };
    const onResize = () => setLive(null);
    document.addEventListener("pointerdown", onPress);
    document.addEventListener("pointerup", onRelease);
    document.addEventListener("keyup", onRelease);
    document.addEventListener("selectionchange", onChange);
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(settle);
      document.removeEventListener("pointerdown", onPress);
      document.removeEventListener("pointerup", onRelease);
      document.removeEventListener("keyup", onRelease);
      document.removeEventListener("selectionchange", onChange);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const choose = (next: Theme) => {
    setTheme(next);
    replay();
  };

  const replay = () => {
    document.getSelection()?.removeAllRanges();
    setLive(null);
    setPlayKey((key) => key + 1);
    replayTurns.current += 1;
    if (replayIconRef.current) {
      replayIconRef.current.style.transform = `rotate(${replayTurns.current * 360}deg)`;
    }
  };

  return (
    <main ref={mainRef} className={styles.poster} data-live={live ? "" : undefined}>
      <h1 className={styles.wordmark}>
        <HondoWordmark className={styles.wordmarkArt} />
      </h1>

      <p className={styles.statement}>
        Hondo turns selected information into something you can inspect, understand, and keep,
        <span className={styles.aside}>
          {" "}
          <span ref={targetRef} className={styles.target}>
            {DEMO_PHRASE}
            {playKey > 0 ? (
              <span
                className={styles.demo}
                key={playKey}
                aria-hidden="true"
                style={{ "--target-w": `${width}px` } as React.CSSProperties}
              >
                <span className={styles.selection} />
                <Toolbar className={styles.demoToolbar} theme={theme} />
                <svg className={styles.cursor} width="18" height="22" viewBox="0 0 18 22" fill="none">
                  <path
                    d="M2 1.5V17.2L6.55 12.9L9.7 20.5L12.85 19.15L9.8 12.15H16L2 1.5Z"
                    fill="#111"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : null}
          </span>
          .
        </span>
      </p>

      <HondoWordmark className={styles.specimen} outline={1.1} boil />

      <p className={styles.caption}>
        <span>(native) macOS app</span>
        <span>©2026</span>
      </p>

      <footer className={styles.footer}>
        <p className={styles.about}>
          (hondo.wiki): A native macOS tool for working with information in context. Select anything. Inspect it,
          ask about it, annotate it, keep it, and preserve where it came from.
          <span className={styles.aside}> Try it on this page.</span>
        </p>
        <p className={styles.credit}>(macOS · 2026)</p>
      </footer>

      {live ? (
        <>
          <span
            key={`${live.top},${live.left},${live.text}`}
            className={styles.liveSelection}
            aria-hidden="true"
            style={{
              top: live.top - PAD_Y,
              left: live.left - PAD_X,
              width: live.width + PAD_X * 2,
              height: live.height + PAD_Y * 2,
            }}
          />
          <Toolbar
            key={`toolbar:${live.top},${live.left},${live.text}`}
            className={styles.liveToolbar}
            theme={theme}
            interactive
            style={livePosition(live)}
          />
        </>
      ) : null}

      <div className={styles.themes} role="group" aria-label="Toolbar theme">
        {THEMES.map((t) => (
          <button key={t} type="button" className={styles.theme} aria-pressed={theme === t} onClick={() => choose(t)}>
            {t === "light" ? "Light" : "Dark"}
          </button>
        ))}
      </div>

      <button type="button" className={styles.replay} aria-label="Replay selection demo" onClick={replay}>
        <svg
          ref={replayIconRef}
          className={styles.replayIcon}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 4V8H15" />
          <path d="M4.98828 20V16H8.98828" />
          <path d="M20 12C20 16.4183 16.4183 20 12 20C9.36378 20 6.96969 18.7249 5.5 16.7578" />
          <path d="M4 12C4 7.58172 7.58172 4 12 4C14.6045 4 16.9726 5.24457 18.4465 7.17142" />
        </svg>
      </button>
    </main>
  );
}

/** Keep in step with .toolbar's width in styles.module.css. */
const TOOLBAR_WIDTH = 248;

/**
 * The live toolbar sits centered over the top of the overlay, slid back
 * inside the page if it would cross an edge.
 */
function livePosition(live: LiveSelection): React.CSSProperties {
  const half = TOOLBAR_WIDTH / 2;
  const pageLeft = window.scrollX;
  const pageRight = pageLeft + document.documentElement.clientWidth;
  const center = live.left + live.width / 2;
  const left = Math.min(Math.max(center, pageLeft + EDGE + half), pageRight - EDGE - half);
  return { left, top: live.top - PAD_Y };
}

/**
 * Hondo's selection toolbar: a pill of the four things you can do with a
 * selection, centered over it. The scripted one is a picture; the live one
 * takes taps, and choosing an action moves the highlight to it. Pressing it
 * doesn't clear the selection it belongs to.
 */
function Toolbar({
  theme,
  interactive = false,
  className,
  style,
}: {
  theme: Theme;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [chosen, setChosen] = useState<(typeof ACTIONS)[number]>("Inspect");
  const pill = `${styles.toolbar} ${className ?? ""}`;

  if (!interactive) {
    return (
      <span className={pill} data-theme={theme} style={style} aria-hidden="true">
        {ACTIONS.map((action) => (
          <span key={action} className={styles.action} data-active={action === chosen ? "" : undefined}>
            {action}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      className={pill}
      data-theme={theme}
      data-interactive=""
      style={style}
      role="toolbar"
      aria-label="Hondo"
      onPointerDown={(event) => event.preventDefault()}
    >
      {ACTIONS.map((action) => (
        <button
          key={action}
          type="button"
          className={styles.action}
          data-active={action === chosen ? "" : undefined}
          aria-pressed={action === chosen}
          onClick={() => setChosen(action)}
        >
          {action}
        </button>
      ))}
    </span>
  );
}
