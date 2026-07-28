"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styles from "./styles.module.css";
import { spring, springSnappy } from "./motion";
import { IconChevron, IconClose, IconDots, IconLayers, IconPlus } from "./icons";
import {
  CONTEXT_GROUPS,
  HISTORY_GROUPS,
  SECTIONS,
  type ContextGroup,
  type SectionId,
} from "./workspace-data";

interface Props {
  active: SectionId;
  onSelect: (id: SectionId) => void;
  /** Phones and reduced-motion get static states, no hover choreography. */
  interactive?: boolean;
}

/**
 * The Workspace panel: DOCUMENT sections, CONTEXT groups, HISTORY.
 * Owns only its own disclosure state; the selected section is lifted to
 * HeroWorkspace so the document pane can follow it.
 */
export function WorkspaceSidebar({ active, onSelect, interactive = true }: Props) {
  const [openGroup, setOpenGroup] = useState<string | null>("concepts");
  const [openCard, setOpenCard] = useState<string | null>("Unstructured Capture");

  const toggleGroup = (id: string) =>
    setOpenGroup((cur) => (cur === id ? null : id));

  return (
    <aside className={styles.sidebar}>
      <header className={styles.sidebarHead}>
        <IconLayers size={16} className={styles.sidebarHeadIcon} />
        <span className={styles.sidebarTitle}>Workspace</span>
        <span className={styles.versionPill}>Concept v0.2</span>
        <button className={styles.sidebarClose} tabIndex={-1} aria-label="Close panel">
          <IconClose size={15} />
        </button>
      </header>

      <div className={styles.sidebarScroll}>
        <p className={styles.groupLabel}>Document</p>
        <ul className={styles.sectionList}>
          {SECTIONS.map((s) => {
            const on = s.id === active;
            return (
              <li key={s.id}>
                <button
                  className={on ? styles.sectionItemOn : styles.sectionItem}
                  onClick={() => onSelect(s.id)}
                  aria-current={on ? "page" : undefined}
                >
                  {on && (
                    <motion.span
                      layoutId="section-pill"
                      className={styles.sectionPill}
                      transition={interactive ? springSnappy : { duration: 0 }}
                    />
                  )}
                  <span className={styles.sectionLabel}>{s.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className={styles.groupLabel}>Context</p>
        <ul className={styles.groupList}>
          {CONTEXT_GROUPS.map((g) => (
            <ContextRow
              key={g.id}
              group={g}
              open={openGroup === g.id}
              onToggle={() => toggleGroup(g.id)}
              openCard={openCard}
              onToggleCard={(t) => setOpenCard((c) => (c === t ? null : t))}
              interactive={interactive}
            />
          ))}
        </ul>

        <p className={styles.groupLabel}>History</p>
        <ul className={styles.groupList}>
          {HISTORY_GROUPS.map((g) => (
            <ContextRow
              key={g.id}
              group={g}
              open={openGroup === g.id}
              onToggle={() => toggleGroup(g.id)}
              openCard={openCard}
              onToggleCard={(t) => setOpenCard((c) => (c === t ? null : t))}
              interactive={interactive}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}

function ContextRow({
  group,
  open,
  onToggle,
  openCard,
  onToggleCard,
  interactive,
}: {
  group: ContextGroup;
  open: boolean;
  onToggle: () => void;
  openCard: string | null;
  onToggleCard: (title: string) => void;
  interactive: boolean;
}) {
  return (
    <li className={styles.groupRow}>
      <div className={styles.groupHead}>
        <button className={styles.groupToggle} onClick={onToggle} aria-expanded={open}>
          <motion.span
            className={styles.groupChevron}
            animate={{ rotate: open ? 90 : 0 }}
            transition={interactive ? spring : { duration: 0 }}
          >
            <IconChevron size={14} />
          </motion.span>
          <span className={styles.groupName}>{group.label}</span>
          <span className={styles.groupCount}>{group.count}</span>
        </button>
        <button className={styles.groupAdd} tabIndex={-1} aria-label={`Add to ${group.label}`}>
          <IconPlus size={14} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && group.cards && (
          <motion.ul
            className={styles.cardList}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={interactive ? spring : { duration: 0 }}
            style={{ overflow: "hidden" }}
          >
            {group.cards.map((card) => {
              const expanded = openCard === card.title && Boolean(card.body);
              return (
                <li key={card.title}>
                  <div className={expanded ? styles.conceptCardOpen : styles.conceptCard}>
                    <button
                      className={styles.conceptHead}
                      onClick={() => card.body && onToggleCard(card.title)}
                      aria-expanded={expanded}
                    >
                      <motion.span
                        className={styles.groupChevron}
                        animate={{ rotate: expanded ? 90 : 0 }}
                        transition={interactive ? spring : { duration: 0 }}
                      >
                        <IconChevron size={13} />
                      </motion.span>
                      <span className={styles.conceptTitle}>{card.title}</span>
                      <IconDots size={14} className={styles.conceptDots} />
                    </button>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={interactive ? spring : { duration: 0 }}
                          style={{ overflow: "hidden" }}
                        >
                          <p className={styles.conceptBody}>{card.body}</p>
                          <p className={styles.conceptMeta}>{card.meta}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
