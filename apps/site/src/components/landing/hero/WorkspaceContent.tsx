"use client";

import type { ReactNode } from "react";
import styles from "./styles.module.css";
import {
  IconBold,
  IconChevron,
  IconCode,
  IconImage,
  IconIndent,
  IconInsert,
  IconItalic,
  IconLink,
  IconListBullet,
  IconListNumber,
  IconOutdent,
  IconRedo,
  IconStrike,
  IconUnderline,
  IconUndo,
} from "./icons";

interface Props {
  /**
   * The document body. Today this is <DocumentImage /> (an exported Figma
   * screen); tomorrow it is <DocumentView /> with live markdown. Nothing
   * outside this component needs to know which.
   */
  children: ReactNode;
  /** Phones hide the editor toolbar and widen the reading column. */
  compact?: boolean;
}

/**
 * The centre pane: editor toolbar over a scrolling document body.
 *
 * The body is an arbitrary-children slot on purpose — swapping rendering modes
 * or dropping in a real editor must never require an edit to Hero.tsx.
 */
export function WorkspaceContent({ children, compact = false }: Props) {
  return (
    <section className={styles.content}>
      {!compact && <EditorToolbar />}
      <div className={compact ? styles.docScrollCompact : styles.docScroll}>
        {children}
      </div>
    </section>
  );
}

function EditorToolbar() {
  return (
    <div className={styles.toolbar} aria-hidden>
      <button className={styles.toolStyle} tabIndex={-1}>
        <span className={styles.toolT}>T</span>
        <IconChevron size={13} className={styles.toolCaret} />
      </button>
      <span className={styles.toolSep} />
      <ToolGroup>
        <Tool><IconBold size={17} /></Tool>
        <Tool><IconItalic size={17} /></Tool>
        <Tool><IconStrike size={17} /></Tool>
        <Tool><IconUnderline size={17} /></Tool>
        <Tool><IconCode size={17} /></Tool>
        <Tool><span className={styles.toolFx}>fx</span></Tool>
      </ToolGroup>
      <span className={styles.toolSep} />
      <ToolGroup>
        <Tool><IconLink size={17} /></Tool>
        <Tool><IconImage size={17} /></Tool>
      </ToolGroup>
      <span className={styles.toolSep} />
      <ToolGroup>
        <Tool><IconListBullet size={17} /></Tool>
        <Tool><IconListNumber size={17} /></Tool>
        <Tool><IconIndent size={17} /></Tool>
        <Tool><IconOutdent size={17} /></Tool>
      </ToolGroup>
      <span className={styles.toolSep} />
      <ToolGroup>
        <Tool><IconUndo size={17} /></Tool>
        <Tool><IconRedo size={17} /></Tool>
      </ToolGroup>
      <span className={styles.toolSep} />
      <Tool><IconInsert size={17} /></Tool>
    </div>
  );
}

const ToolGroup = ({ children }: { children: ReactNode }) => (
  <span className={styles.toolGroup}>{children}</span>
);

const Tool = ({ children }: { children: ReactNode }) => (
  <button className={styles.tool} tabIndex={-1}>
    {children}
  </button>
);
