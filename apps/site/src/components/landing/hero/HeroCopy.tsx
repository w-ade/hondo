"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { spring } from "./motion";
import { useReducedMotion } from "./use-viewport";
import styles from "./styles.module.css";

/**
 * Wordmark, headline, supporting line. Flush left against the same edge the
 * workspace window starts on.
 *
 * Matches Figma `400 CONNECT → Landing` (221:411). The wordmark is the exported
 * vector from node 221:798 — never redrawn. Its designed box is 305.27 × 51.79
 * and the artwork overflows that box slightly (−0.33% x, −1.96% y), so the box
 * and the leaf are sized separately to preserve the drawn geometry.
 *
 * One entrance on load, then still. There are no calls to action in this frame.
 */
export function HeroCopy() {
  const reduced = useReducedMotion();

  const rise = (i: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { ...spring, delay: 0.05 * i },
        };

  return (
    <div className={styles.copy}>
      <motion.div className={styles.wordmark} {...rise(0)}>
        <Image
          className={styles.wordmarkArt}
          src="/hondo-wordmark.svg"
          alt="Hondo"
          width={307}
          height={54}
          priority
          // Served as-authored: the optimizer refuses SVG without
          // dangerouslyAllowSVG, and a vector has nothing to optimize.
          unoptimized
        />
      </motion.div>

      <motion.h1 className={styles.headline} {...rise(1)}>
        The Think First, Organize Later Workspace.
      </motion.h1>

      <motion.p className={styles.sub} {...rise(2)}>
        Notes, tasks, context, and AI—where every thought is allowed to exist before it
        needs to be organized.
      </motion.p>
    </div>
  );
}
