"use client";

import { motion } from "framer-motion";
import styles from "./styles.module.css";
import { fade } from "./motion";
import {
  IconBookmark,
  IconDots,
  IconHome,
  IconStar,
} from "./icons";

interface Props {
  /** Document title in the breadcrumb, follows the selected section. */
  title: string;
  /** Phones drop the breadcrumb row and shrink the title bar. */
  compact?: boolean;
}

/**
 * Mac window chrome: traffic lights + title bar, then the breadcrumb row.
 * Purely presentational — it holds no workspace state, so it can be swapped
 * for real application chrome without touching anything around it.
 */
export function WorkspaceChrome({ title, compact = false }: Props) {
  return (
    <div className={styles.chrome}>
      <div className={compact ? styles.titlebarCompact : styles.titlebar}>
        <span className={styles.lights} aria-hidden>
          <i data-light="close" />
          <i data-light="min" />
          <i data-light="max" />
        </span>
        <span className={styles.windowTitle}>Hondo</span>
      </div>

      {!compact && (
        <div className={styles.breadcrumb}>
          <div className={styles.crumbLeft}>
            <IconHome size={15} className={styles.crumbHome} />
            <span className={styles.crumbMuted}>Workspace</span>
            <span className={styles.crumbSlash}>/</span>
            <motion.span
              key={title}
              className={styles.crumbCurrent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={fade}
            >
              {title}
            </motion.span>
            <button className={styles.crumbIcon} tabIndex={-1} aria-label="Favourite">
              <IconStar size={15} />
            </button>
            <button className={styles.crumbIcon} tabIndex={-1} aria-label="More">
              <IconDots size={15} />
            </button>
          </div>

          <div className={styles.crumbRight}>
            <button className={styles.shareBtn} tabIndex={-1}>
              Share
            </button>
            <button className={styles.crumbIcon} tabIndex={-1} aria-label="Bookmark">
              <IconBookmark size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
