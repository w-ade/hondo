"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styles from "./styles.module.css";
import { enter, enterReduced, spring, springSnappy, stagger } from "./motion";
import {
  IconArrowUp,
  IconChevronUp,
  IconCopy,
  IconDotsV,
  IconMessage,
  IconPlus,
  IconRefresh,
  IconThumbDown,
  IconThumbUp,
  IconTrash,
} from "./icons";
import { AGENT_THREAD, type AgentMessage, type AgentTab } from "./workspace-data";

interface Props {
  interactive?: boolean;
  reducedMotion?: boolean;
}

const TABS: { id: AgentTab; label: string }[] = [
  { id: "chat", label: "Chat" },
  { id: "review", label: "Review" },
  { id: "sources", label: "Sources" },
];

/**
 * The Agent panel. Tabs swap the thread; the answer block reveals in sequence
 * so the panel reads as a response arriving rather than a static screenshot.
 */
export function WorkspaceAgent({ interactive = true, reducedMotion = false }: Props) {
  const [tab, setTab] = useState<AgentTab>("chat");
  const variants = reducedMotion ? enterReduced : enter;

  return (
    <aside className={styles.agent}>
      <header className={styles.agentHead}>
        <IconMessage size={16} className={styles.agentHeadIcon} />
        <span className={styles.agentTitle}>Agent</span>
        <button className={styles.agentMore} tabIndex={-1} aria-label="Agent options">
          <IconDotsV size={16} />
        </button>
      </header>

      <div className={styles.agentTabs} role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? styles.agentTabOn : styles.agentTab}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="agent-tab-rule"
                className={styles.agentTabRule}
                transition={interactive ? springSnappy : { duration: 0 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className={styles.agentScroll}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={interactive ? spring : { duration: 0 }}
          >
            {tab === "chat" && (
              <div className={styles.thread}>
                {AGENT_THREAD.map((m, i) => (
                  <Message key={i} msg={m} index={i} interactive={interactive} />
                ))}
              </div>
            )}

            {tab === "review" && (
              <div className={styles.agentEmpty}>
                <p className={styles.agentEmptyTitle}>2 revisions awaiting review</p>
                <p className={styles.agentEmptyBody}>
                  Proposed changes appear here before they touch the document.
                </p>
              </div>
            )}

            {tab === "sources" && (
              <div className={styles.agentEmpty}>
                <p className={styles.agentEmptyTitle}>3 sources attached</p>
                <p className={styles.agentEmptyBody}>
                  Every answer keeps a trail back to the passage that supports it.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.sourcesBar}>
        <span>Sources · 3</span>
        <IconChevronUp size={16} className={styles.sourcesCaret} />
      </div>

      <div className={styles.composer}>
        <p className={styles.composerPlaceholder}>
          Ask about the work, revise the document, or attach a source
          <motion.span
            className={styles.composerCaret}
            animate={interactive ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
            transition={
              interactive
                ? { duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }
                : { duration: 0 }
            }
            aria-hidden
          />
        </p>
        <div className={styles.composerRow}>
          <button className={styles.composerAdd} tabIndex={-1} aria-label="Attach">
            <IconPlus size={17} />
          </button>
          <button className={styles.composerSend} tabIndex={-1} aria-label="Send">
            <IconArrowUp size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function Message({
  msg,
  index,
  interactive,
}: {
  msg: AgentMessage;
  index: number;
  interactive: boolean;
}) {
  if (msg.kind === "instruction") {
    return (
      <motion.p
        className={styles.instruction}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={interactive ? stagger(index) : { duration: 0 }}
      >
        {msg.paragraphs[0]}
      </motion.p>
    );
  }

  return (
    <motion.div
      className={msg.kind === "answer" ? styles.answerCard : styles.noteCard}
      initial={{ opacity: 0, y: interactive ? 4 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={interactive ? stagger(index) : { duration: 0 }}
    >
      {msg.kind === "answer" && (
        <div className={styles.answerBar}>
          <span className={styles.answerGrip} aria-hidden />
          <span className={styles.answerTools} aria-hidden>
            <IconCopy size={15} />
          </span>
          <span className={styles.answerLabel}>Answer</span>
        </div>
      )}

      {msg.paragraphs.map((p, i) => (
        <p key={i} className={styles.msgP}>
          {p}
        </p>
      ))}

      <div className={styles.msgActions} aria-hidden>
        <IconThumbUp size={15} />
        <IconThumbDown size={15} />
        <IconCopy size={15} />
        <IconRefresh size={15} />
        <IconTrash size={15} />
      </div>

      {msg.sources !== undefined && (
        <span className={styles.sourcesPill}>{msg.sources} sources</span>
      )}
    </motion.div>
  );
}
