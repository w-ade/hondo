"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styles from "./styles.module.css";
import { enter, enterReduced, spring } from "./motion";
import { useFitScale, useIsMobile, useReducedMotion } from "./use-viewport";
import { WorkspaceChrome } from "./WorkspaceChrome";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { WorkspaceContent } from "./WorkspaceContent";
import { WorkspaceAgent } from "./WorkspaceAgent";
import { WorkspaceFooter } from "./WorkspaceFooter";
import { DocumentImage } from "./DocumentImage";
import { DocumentView } from "./DocumentView";
import { SECTIONS, type SectionId } from "./workspace-data";

/**
 * How the document body is produced.
 *
 *   "figma" — render the exported screen for the active section, falling back
 *             to the live view for sections that have no export yet.
 *   "live"  — always render live React components.
 *
 * Everything else — layout, chrome, sidebar, agent, footer, animation,
 * responsive behaviour — is identical in both modes. Switching is a one-word
 * change here and nowhere else.
 */
export type RenderMode = "figma" | "live";

/** The window's designed size, from Figma 221:412. */
const DESIGN_W = 1026.24;
const DESIGN_H = 754;

interface Props {
  mode?: RenderMode;
}

export function HeroWorkspace({ mode = "figma" }: Props) {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [active, setActive] = useState<SectionId>("overview");

  // Phones show the real window, whole, laid out at its true size and scaled
  // down to fit. Nothing is re-flowed or hidden — it is the actual app, small.
  const { ref: fitRef, scale } = useFitScale(DESIGN_W);

  const section = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  // Expensive interaction is desktop-only. At phone scale a sidebar row is a
  // few pixels tall, so the miniature is presentational.
  const interactive = isMobile === false && !reduced;
  const variants = reduced ? enterReduced : enter;

  const body =
    mode === "figma" && section.image ? (
      <DocumentImage
        src={section.image}
        alt={`Hondo workspace — ${section.label}`}
        priority
      />
    ) : (
      <DocumentView blocks={section.blocks} caret={interactive} />
    );

  const documentPane = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={active}
        className={styles.docSwap}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={interactive ? spring : { duration: 0 }}
      >
        {body}
      </motion.div>
    </AnimatePresence>
  );

  const window = (
    <div className={styles.window}>
      <WorkspaceChrome title={section.label} />
      <div className={styles.panes}>
        <WorkspaceSidebar active={active} onSelect={setActive} interactive={interactive} />
        <WorkspaceContent>{documentPane}</WorkspaceContent>
        <WorkspaceAgent interactive={interactive} reducedMotion={reduced} />
      </div>
      <WorkspaceFooter words={section.words} />
    </div>
  );

  if (isMobile) {
    return (
      <div ref={fitRef} className={styles.fit} style={{ height: DESIGN_H * scale }}>
        {scale > 0 && (
          <div
            className={styles.fitInner}
            style={{
              width: DESIGN_W,
              height: DESIGN_H,
              transform: `scale(${scale})`,
            }}
            // The miniature is a picture of the product, not a control surface.
            aria-hidden
          >
            {window}
          </div>
        )}
      </div>
    );
  }

  return window;
}
