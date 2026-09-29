"use client";

import { useEffect, useRef, useState } from "react";
import { HondoWordmark } from "../wordmark/HondoWordmark";
import styles from "./styles.module.css";

/** The phrase the scripted cursor selects. */
const DEMO_PHRASE = "selected information";

type LiveSelection = { x: number; y: number; text: string };

/**
 * The landing as a type-specimen poster (after the ©Mamoth sheet): the
 * wordmark, one huge sentence, a boiling outline of the wordmark, and small
 * print in the corners.
 *
 * The page demonstrates the product on itself. On load a cursor comes in and
 * selects a phrase of the big sentence, and Hondo's toolbar opens under it
 * with the source kept. After that the visitor can select any text on the
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

  // The visitor's own selections. Shown once the pointer or key is released,
  // so the toolbar doesn't chase the drag; hidden when the selection collapses.
  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const read = () => {
      const selection = document.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) return setLive(null);
      const range = selection.getRangeAt(0);
      const text = selection.toString().replace(/\s+/g, " ").trim();
      if (!text || !root.contains(range.commonAncestorContainer)) return setLive(null);
      const rects = range.getClientRects();
      const first = rects[0] ?? range.getBoundingClientRect();
      const last = rects[rects.length - 1] ?? first;
      const x = Math.min(Math.max(first.left, 16), window.innerWidth - TOOLBAR_WIDTH - 16);
      setLive({ x: x + window.scrollX, y: last.bottom + window.scrollY, text });
      setPlayKey(0); // the visitor has taken over; retire the scripted run
    };
    const onRelease = () => requestAnimationFrame(read);
    const onChange = () => {
      const selection = document.getSelection();
      if (!selection || selection.isCollapsed) setLive(null);
    };
    document.addEventListener("pointerup", onRelease);
    document.addEventListener("keyup", onRelease);
    document.addEventListener("selectionchange", onChange);
    return () => {
      document.removeEventListener("pointerup", onRelease);
      document.removeEventListener("keyup", onRelease);
      document.removeEventListener("selectionchange", onChange);
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
    <main ref={mainRef} className={styles.poster}>
      <h1 className={styles.wordmark}>
        <HondoWordmark className={styles.wordmarkArt} />
      </h1>

      <p className={styles.statement}>
        Hondo turns{" "}
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
              <Toolbar className={styles.demoToolbar} text={DEMO_PHRASE} />
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
        </span>{" "}
        into something you can inspect, understand, and keep,<span className={styles.aside}> on macOS.</span>
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
        <Toolbar
          key={`${live.x},${live.y}`}
          className={styles.liveToolbar}
          text={live.text}
          style={{ left: live.x, top: live.y }}
        />
      ) : null}

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
const TOOLBAR_WIDTH = 288;

/**
 * Hondo's selection toolbar: the four things you can do with a selection, and
 * the selection itself with where it came from. A picture of the app's
 * toolbar, not a working one, so it takes no pointer events.
 */
function Toolbar({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`${styles.toolbar} ${className ?? ""}`} style={style} aria-hidden="true">
      <span className={styles.actions}>
        <span className={styles.action} data-active="">
          Inspect
        </span>
        <span className={styles.action}>Ask</span>
        <span className={styles.action}>Annotate</span>
        <span className={styles.action}>Keep</span>
      </span>
      <span className={styles.source}>
        <span className={styles.quote}>“{text}”</span>
        <span className={styles.origin}>hondo.wiki · just now</span>
      </span>
    </span>
  );
}
