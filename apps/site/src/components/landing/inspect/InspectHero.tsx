"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

/**
 * The landing: Hondo's two paragraphs, centered, and a cursor that comes in
 * and selects a phrase under a dev overlay — the page inspecting itself.
 *
 * Recreated from the Hondo card on brianawade.com
 * (wade-site/src/components/hondo/HondoCard.tsx). The card's cursor path was
 * hard-coded pixels for its font; here the drag is measured from the target,
 * so the phrase and the typeface can change without retuning the keyframes.
 */
export function InspectHero() {
  const targetRef = useRef<HTMLSpanElement>(null);
  const replayIconRef = useRef<SVGSVGElement>(null);
  const replayTurns = useRef(0);
  const [playKey, setPlayKey] = useState(0);
  const [width, setWidth] = useState(0);

  // Measure once the webfont is in, then play. Re-measure on resize so a
  // replay after the text reflows still lands on the phrase.
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

  const replay = () => {
    setPlayKey((key) => key + 1);
    replayTurns.current += 1;
    if (replayIconRef.current) {
      replayIconRef.current.style.transform = `rotate(${replayTurns.current * 360}deg)`;
    }
  };

  return (
    <main className={styles.stage}>
      <div className={styles.text}>
        <h1 className={styles.wordmark}>
          <Image
            className={styles.wordmarkArt}
            src="/hondo-wordmark.svg"
            alt="Hondo"
            width={307}
            height={54}
            priority
            unoptimized
          />
        </h1>
        <p>
          Turns conversations, decisions, references, and project context into structured knowledge that can be
          retrieved, inspected, and reused across long-running AI work.
        </p>
        <p>
          AI workflows drift when important context is trapped inside conversations or repeatedly reconstructed from
          memory. Hondo explores persistent context as an{" "}
          <span ref={targetRef} className={styles.target}>
            inspectable system
            {playKey > 0 ? (
              <span
                className={styles.animation}
                key={playKey}
                aria-hidden="true"
                style={{ "--target-w": `${width}px` } as React.CSSProperties}
              >
                <span className={styles.selection} />
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
          —separating working state from durable knowledge while preserving sources, decisions, and provenance.
        </p>
      </div>
      <button type="button" className={styles.replay} aria-label="Replay dev overlay animation" onClick={replay}>
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
