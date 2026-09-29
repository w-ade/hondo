"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "../../theme/ThemeToggle";
import { HondoWordmark } from "../wordmark/HondoWordmark";
import styles from "./styles.module.css";

/** The phrase the scripted cursor selects (set in caps by .aside). */
const DEMO_PHRASE = "on macOS";
/** The live toolbar keeps at least this far from the viewport's sides. */
const EDGE = 16;
/** Room between the overlay and the text it frames; mirrors --pad-x/--pad-y in styles.module.css. */
const PAD_X = 10;
const PAD_Y = 8;
/** The toolbar's two pages of actions; the chevron slides between them. */
const PAGES = [
  ["Inspect", "Ask", "Keep"],
  ["Annotate", "Source"],
] as const;

/** The visitor's selection: the box around all of it, in page coordinates. */
type LiveSelection = { top: number; left: number; width: number; height: number; text: string };

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

  // Measure the phrase once the webfont is in, then play. Re-measure on
  // resize so a replay after the text reflows still lands on it.
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    let cancelled = false;
    const measure = () => setWidth(target.offsetWidth);
    document.fonts.ready.then(() => {
      if (cancelled) return;
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
  // of it and the toolbar over that. Drawn once the pointer or key is released
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
                style={{ "--target-w": `${width}px` } as React.CSSProperties}
              >
                <span className={styles.selection} aria-hidden="true" />
                <Toolbar className={styles.demoToolbar} />
                <svg
                  className={styles.cursor}
                  width="18"
                  height="22"
                  viewBox="0 0 18 22"
                  fill="none"
                  aria-hidden="true"
                >
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
            style={livePosition(live)}
          />
        </>
      ) : null}

      <ThemeToggle />

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

/** Roughly the toolbar's widest page; for keeping the live one on screen. */
const TOOLBAR_WIDTH = 210;

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
 * Hondo's selection toolbar, after Framer University's text-selection
 * tooltip: a dark segmented bar centered over the selection that fades and
 * scales in. The chevron slides to a second page of actions. Both pages sit
 * side by side on a track inside the clipped bar; the bar animates to the
 * width of the page showing while the track slides by the width of the
 * first, so the content slides and the bar resizes together. Pressing the
 * bar doesn't clear the selection it belongs to. The actions don't do
 * anything yet.
 */
function Toolbar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const [page, setPage] = useState(0);
  const [widths, setWidths] = useState<[number, number] | null>(null);
  const firstRef = useRef<HTMLSpanElement>(null);
  const secondRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const first = firstRef.current;
    const second = secondRef.current;
    if (!first || !second) return;
    const observer = new ResizeObserver(() => setWidths([first.offsetWidth, second.offsetWidth]));
    observer.observe(first);
    observer.observe(second);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      className={`${styles.toolbar} ${className ?? ""}`}
      style={{ ...style, width: widths ? widths[page] : undefined }}
      role="toolbar"
      aria-label="Hondo"
      onPointerDown={(event) => event.preventDefault()}
    >
      <span className={styles.track} style={{ transform: page && widths ? `translateX(${-widths[0]}px)` : undefined }}>
        <span ref={firstRef} className={styles.page} inert={page !== 0}>
          {PAGES[0].map((action) => (
            <button key={action} type="button" className={styles.segment}>
              {action}
            </button>
          ))}
          <button type="button" className={styles.chevron} aria-label="More actions" onClick={() => setPage(1)}>
            <Chevron flip={false} />
          </button>
        </span>
        <span ref={secondRef} className={styles.page} inert={page !== 1}>
          <button type="button" className={styles.chevron} aria-label="Back" onClick={() => setPage(0)}>
            <Chevron flip />
          </button>
          {PAGES[1].map((action) => (
            <button key={action} type="button" className={styles.segment}>
              {action}
            </button>
          ))}
        </span>
      </span>
    </span>
  );
}

function Chevron({ flip }: { flip: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d={flip ? "M7.5 2.5L4 6L7.5 9.5" : "M4.5 2.5L8 6L4.5 9.5"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
