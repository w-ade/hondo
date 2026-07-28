"use client";

import styles from "./styles.module.css";
import type { Block } from "./workspace-data";

interface Props {
  blocks: Block[];
  /** Draws the editor caret after the last block. */
  caret?: boolean;
}

/**
 * Live document body. Renders the same type ramp as the Figma export, so a
 * section backed by an export and a section backed by markdown sit at the same
 * scale and weight inside the pane.
 *
 * This is the component the whole hero is built to grow into: replace `blocks`
 * with real markdown and nothing outside this file changes.
 */
export function DocumentView({ blocks, caret = true }: Props) {
  return (
    <article className={styles.doc}>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h1":
            return <h1 key={i} className={styles.docH1}>{b.text}</h1>;
          case "h2":
            return <h2 key={i} className={styles.docH2}>{b.text}</h2>;
          case "p":
            return <p key={i} className={styles.docP}>{b.text}</p>;
          case "struck":
            return <p key={i} className={styles.docStruck}>{b.text}</p>;
          case "revision":
            return (
              <p key={i} className={styles.docRevision}>
                <span className={styles.docRevisionText}>{b.text}</span>
              </p>
            );
          case "list":
            return (
              <ol key={i} className={styles.docList}>
                {b.items.map((it, j) => (
                  <li key={j} className={styles.docLi}>
                    <span className={styles.docLiNum}>{j + 1}.</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ol>
            );
        }
      })}
      {caret && <span className={styles.caret} aria-hidden />}
    </article>
  );
}
