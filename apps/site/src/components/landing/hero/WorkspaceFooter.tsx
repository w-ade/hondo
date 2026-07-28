"use client";

import { motion } from "framer-motion";
import styles from "./styles.module.css";
import { fade } from "./motion";
import { IconChevronUp } from "./icons";
import { TIMELINE_TICKS } from "./workspace-data";

interface Props {
  words: string;
  compact?: boolean;
}

/** Status bar: word count, the context timeline, and its disclosure. */
export function WorkspaceFooter({ words, compact = false }: Props) {
  return (
    <footer className={compact ? styles.footerCompact : styles.footer}>
      <motion.span
        key={words}
        className={styles.footerCount}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={fade}
      >
        {words} words · Saved
      </motion.span>

      {!compact && (
        <>
          <span className={styles.timeline} aria-hidden>
            {TIMELINE_TICKS.map((tone, i) => (
              <i key={i} data-tone={tone} />
            ))}
          </span>

          <span className={styles.footerRight}>
            Context Timeline
            <IconChevronUp size={15} />
          </span>
        </>
      )}
    </footer>
  );
}
