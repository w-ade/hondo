"use client";

// Orchestrator. Owns the pinned scroll section, maps scroll progress
// deterministically onto the anime.js timeline, gates interactivity, and
// renders the phase-5 product chrome (wordmark, filters, zoom controls,
// inspector). The graph itself lives in BloomGraph.

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, type Timeline } from "animejs";
import BloomGraph, { type BloomGraphHandle } from "./BloomGraph";
import MindBloomCopy, { type RmStage } from "./MindBloomCopy";
import {
  getDataset,
  THOUGHT_ID,
  TYPE_LABELS,
  type BloomNode,
  type NodeType,
} from "./bloom-data";
import {
  buildTimeline,
  createBloomState,
  DURATION,
  PHASES,
  type BloomState,
} from "./bloom-timeline";
import styles from "./styles.module.css";

const FILTERS: Array<NodeType | "all"> = [
  "all",
  "note",
  "task",
  "source",
  "decision",
  "question",
  "agent",
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function MindBloom() {
  const sectionRef = useRef<HTMLElement>(null);
  const graphHandle = useRef<BloomGraphHandle>(null);
  const stateRef = useRef<BloomState>(createBloomState());
  const tlRef = useRef<Timeline | null>(null);
  const rmStageRef = useRef<RmStage>("dot");

  const thinkFirst = useRef<HTMLDivElement>(null);
  const scrollHint = useRef<HTMLDivElement>(null);
  const organizeLater = useRef<HTMLDivElement>(null);
  const oneLiner = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [rmStage, setRmStage] = useState<RmStage>("dot");
  const [filter, setFilter] = useState<NodeType | "all">("all");
  const [selected, setSelected] = useState<BloomNode | null>(null);

  const dataset = useMemo(() => getDataset(isMobile), [isMobile]);

  // environment: breakpoint + motion preference
  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMobile = () => setIsMobile(mqMobile.matches);
    const syncMotion = () => setReducedMotion(mqMotion.matches);
    syncMobile();
    syncMotion();
    mqMobile.addEventListener("change", syncMobile);
    mqMotion.addEventListener("change", syncMotion);
    return () => {
      mqMobile.removeEventListener("change", syncMobile);
      mqMotion.removeEventListener("change", syncMotion);
    };
  }, []);

  // the scroll-linked timeline (normal-motion path only)
  useEffect(() => {
    if (reducedMotion) {
      stateRef.current.zoom = 1.1;
      return;
    }
    const tl = buildTimeline(stateRef.current, {
      thinkFirst: thinkFirst.current,
      scrollHint: scrollHint.current,
      organizeLater: organizeLater.current,
      oneLiner: oneLiner.current,
      chrome: chromeRef.current,
    });
    tlRef.current = tl;
    return () => {
      tlRef.current = null;
      tl.revert();
    };
  }, [reducedMotion]);

  // scroll → progress → timeline seek (deterministic, direction-agnostic)
  useEffect(() => {
    let raf = 0;
    let queued = false;

    const update = () => {
      queued = false;
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const span = sec.offsetHeight - window.innerHeight;
      const p = span > 0 ? clamp01(-rect.top / span) : 1;

      if (reducedMotion) {
        // Crossfades between three static stages; no bloom movement.
        const stage: RmStage = p < PHASES.BLOOM ? "dot" : p < PHASES.CHROME ? "graph" : "chrome";
        if (stage !== rmStageRef.current) {
          rmStageRef.current = stage;
          setRmStage(stage);
          const on = stage !== "dot" ? 1 : 0;
          animate(stateRef.current, {
            early: on,
            bloom: on,
            settle: on,
            labels: on,
            duration: 400,
            ease: "linear",
          });
        }
      } else {
        tlRef.current?.seek(p * DURATION);
      }

      // interactivity gate with hysteresis, so the boundary doesn't flicker
      setInteractive((prev) =>
        prev ? p >= PHASES.INTERACTIVE - 0.03 : p >= PHASES.INTERACTIVE
      );
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  // entering the product state: the thought is pre-selected in the inspector
  useEffect(() => {
    if (interactive) graphHandle.current?.selectNode(THOUGHT_ID);
  }, [interactive]);

  const neighbors = useMemo(() => {
    if (!selected) return [];
    const related: BloomNode[] = [];
    for (const l of dataset.links) {
      const other =
        l.source === selected.id ? l.target : l.target === selected.id ? l.source : null;
      if (!other) continue;
      const node = dataset.nodes.find((n) => n.id === other);
      if (node) related.push(node);
    }
    return related;
  }, [selected, dataset]);

  return (
    <section
      ref={sectionRef}
      className={styles.stage}
      style={{ height: isMobile ? "380vh" : "520vh" }}
    >
      <div className={styles.sticky}>
        <BloomGraph
          ref={graphHandle}
          nodes={dataset.nodes}
          links={dataset.links}
          stateRef={stateRef}
          reducedMotion={reducedMotion}
          interactive={interactive}
          filter={filter}
          onSelect={setSelected}
        />

        <MindBloomCopy
          thinkFirstRef={thinkFirst}
          scrollHintRef={scrollHint}
          organizeLaterRef={organizeLater}
          oneLinerRef={oneLiner}
          reducedMotion={reducedMotion}
          rmStage={rmStage}
        />

        {/* phase 5 — restrained product chrome */}
        <div
          ref={chromeRef}
          className={
            styles.chrome +
            (interactive ? ` ${styles.chromeOn}` : "") +
            (reducedMotion && rmStage === "chrome" ? ` ${styles.rmVisible}` : "")
          }
        >
          <header className={styles.topbar}>
            <div className={styles.wordmark}>
              Hondo <span className={styles.wordmarkSub}>Context Map</span>
            </div>
            {!isMobile && (
              <div className={styles.filters} role="group" aria-label="Filter by type">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    className={styles.pill + (filter === f ? ` ${styles.pillOn}` : "")}
                    onClick={() => setFilter(f)}
                  >
                    {f === "all" ? "All" : `${TYPE_LABELS[f]}s`}
                  </button>
                ))}
              </div>
            )}
            <div className={styles.badge}>Experiment</div>
          </header>

          <div className={styles.zoomCtls}>
            <button aria-label="Zoom in" onClick={() => graphHandle.current?.zoomIn()}>+</button>
            <button aria-label="Zoom out" onClick={() => graphHandle.current?.zoomOut()}>−</button>
            <button aria-label="Zoom to fit" onClick={() => graphHandle.current?.zoomToFit()}>⤢</button>
          </div>

          {!isMobile && (
            <div className={styles.hintLine}>Drag nodes · ⌘ scroll to zoom</div>
          )}

          {selected && (
            <aside className={styles.inspector}>
              <div className={styles.inspectorType}>{TYPE_LABELS[selected.type]}</div>
              <h3 className={styles.inspectorTitle}>{selected.label}</h3>
              <div className={styles.inspectorSection}>
                Relationships <span className={styles.count}>{neighbors.length}</span>
              </div>
              <ul className={styles.relations}>
                {neighbors.map((n) => (
                  <li key={n.id}>
                    <button onClick={() => graphHandle.current?.selectNode(String(n.id))}>
                      <span className={styles.relType}>{TYPE_LABELS[n.type]}</span>
                      <span className={styles.relLabel}>{n.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
