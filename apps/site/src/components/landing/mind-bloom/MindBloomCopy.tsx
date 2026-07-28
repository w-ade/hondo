"use client";

// The narrative copy layers. In the normal path the anime.js timeline drives
// these elements' inline styles (opacity / translate). Under reduced motion
// the timeline never exists and visibility becomes CSS opacity transitions
// keyed off the current stage.

import type { RefObject } from "react";
import styles from "./styles.module.css";

export type RmStage = "dot" | "graph" | "chrome";

interface Props {
  thinkFirstRef: RefObject<HTMLDivElement | null>;
  scrollHintRef: RefObject<HTMLDivElement | null>;
  organizeLaterRef: RefObject<HTMLDivElement | null>;
  oneLinerRef: RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
  rmStage: RmStage;
}

export default function MindBloomCopy({
  thinkFirstRef,
  scrollHintRef,
  organizeLaterRef,
  oneLinerRef,
  reducedMotion,
  rmStage,
}: Props) {
  const rmClass = (visible: boolean) => (reducedMotion && visible ? ` ${styles.rmVisible}` : "");

  return (
    <div className={styles.copy}>
      <div ref={thinkFirstRef} className={styles.thinkFirst + rmClass(rmStage === "dot")}>
        Think first.
      </div>
      <div ref={scrollHintRef} className={styles.scrollHint + rmClass(rmStage === "dot")}>
        Scroll
      </div>
      <div className={styles.closing}>
        <div ref={organizeLaterRef} className={styles.organizeLater + rmClass(rmStage === "graph")}>
          Organize later.
        </div>
        <div ref={oneLinerRef} className={styles.oneLiner + rmClass(rmStage === "graph")}>
          A workspace for notes, tasks, context, and agent collaboration.
        </div>
      </div>
    </div>
  );
}
