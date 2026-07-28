// Graph data for the Mind Bloom experiment. One original thought, surrounded by
// the notes, tasks, sources, decisions, questions, concepts, and agent activity
// that collect around it over time. Layout targets (angle/orbit) are assigned
// deterministically so the bloom is identical on every run.

export type NodeType =
  | "thought"
  | "concept"
  | "note"
  | "task"
  | "source"
  | "decision"
  | "question"
  | "agent";

export interface BloomNode {
  id: string;
  label: string;
  type: NodeType;
  /** 1 = the thought, 2 = early context, 3 = the bloom */
  phase: 1 | 2 | 3;
  /** stagger order within the bloom */
  order: number;
  /** included in the reduced mobile dataset */
  mobile: boolean;
  /** 1 = labelled once labels disclose, 2 = labelled only at high zoom on desktop */
  labelTier: 1 | 2;
  /** layout target, polar around the thought (radians / graph units) */
  angle: number;
  orbit: number;
  // simulation fields (d3 mutates these in place)
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

export interface BloomLink {
  source: string;
  target: string;
  /** link appears when its latest endpoint's phase is revealed */
  phase: 1 | 2 | 3;
}

export const THOUGHT_ID = "thought";
export const THOUGHT_LABEL = "How should Hondo protect unfinished ideas?";

/** Human name for each type, used for early tags, filters, and the inspector. */
export const TYPE_LABELS: Record<NodeType, string> = {
  thought: "Thought",
  concept: "Concept",
  note: "Note",
  task: "Task",
  source: "Source",
  decision: "Decision",
  question: "Question",
  agent: "Agent",
};

// ---------------------------------------------------------------------------
// Raw nodes. angle/orbit are filled in below.

type Seed = Omit<BloomNode, "angle" | "orbit" | "order"> & { early?: boolean };

const seeds: Seed[] = [
  {
    id: THOUGHT_ID,
    label: THOUGHT_LABEL,
    type: "thought",
    phase: 1,
    mobile: true,
    labelTier: 1,
  },

  // --- early context (phase 2): one note, question, source, task -----------
  { id: "n-daily", label: "Daily note", type: "note", phase: 2, mobile: true, labelTier: 1, early: true },
  { id: "q-half", label: "Where does a half-thought live?", type: "question", phase: 2, mobile: true, labelTier: 1, early: true },
  { id: "s-concept02", label: "Concept v0.2", type: "source", phase: 2, mobile: true, labelTier: 1, early: true },
  { id: "t-mobile", label: "Mobile capture", type: "task", phase: 2, mobile: true, labelTier: 1, early: true },

  // --- concepts ------------------------------------------------------------
  { id: "c-tagline", label: "Think first. Organize later.", type: "concept", phase: 3, mobile: true, labelTier: 1 },
  { id: "c-capture", label: "Capture without classification", type: "concept", phase: 3, mobile: true, labelTier: 1 },
  { id: "c-living", label: "Living context", type: "concept", phase: 3, mobile: false, labelTier: 1 },
  { id: "c-continuity", label: "Context continuity", type: "concept", phase: 3, mobile: false, labelTier: 2 },
  { id: "c-truth", label: "Source of truth", type: "concept", phase: 3, mobile: true, labelTier: 1 },
  { id: "c-control", label: "User control", type: "concept", phase: 3, mobile: false, labelTier: 1 },
  { id: "c-philosophy", label: "Product philosophy", type: "concept", phase: 3, mobile: false, labelTier: 2 },
  { id: "c-map", label: "Context Map", type: "concept", phase: 3, mobile: true, labelTier: 1 },

  // --- notes ---------------------------------------------------------------
  { id: "n-unfinished", label: "Unfinished ≠ unimportant", type: "note", phase: 3, mobile: true, labelTier: 1 },
  { id: "n-decay", label: "Ideas decay when filed too early", type: "note", phase: 3, mobile: false, labelTier: 2 },
  { id: "n-friction", label: "Capture friction kills thoughts", type: "note", phase: 3, mobile: true, labelTier: 1 },
  { id: "n-walks", label: "Half-thoughts from walks", type: "note", phase: 3, mobile: false, labelTier: 2 },
  { id: "n-modes", label: "Draft: protection modes", type: "note", phase: 3, mobile: false, labelTier: 2 },
  { id: "n-protect", label: "What “protect” actually means", type: "note", phase: 3, mobile: true, labelTier: 1 },
  { id: "n-garden", label: "Notes on gardening metaphors", type: "note", phase: 3, mobile: false, labelTier: 2 },
  { id: "n-labels", label: "First principle: no premature labels", type: "note", phase: 3, mobile: false, labelTier: 2 },

  // --- tasks ---------------------------------------------------------------
  { id: "t-inbox", label: "Design capture inbox", type: "task", phase: 3, mobile: true, labelTier: 1 },
  { id: "t-quiet", label: "Prototype quiet mode", type: "task", phase: 3, mobile: false, labelTier: 2 },
  { id: "t-suggest", label: "Test agent suggestions", type: "task", phase: 3, mobile: true, labelTier: 1 },
  { id: "t-onboard", label: "Write onboarding copy", type: "task", phase: 3, mobile: false, labelTier: 2 },
  { id: "t-sync", label: "Audit cloud sync conflicts", type: "task", phase: 3, mobile: false, labelTier: 1 },

  // --- sources -------------------------------------------------------------
  { id: "s-zettel", label: "Zettelkasten notes", type: "source", phase: 3, mobile: false, labelTier: 1 },
  { id: "s-gtd", label: "GTD capture chapter", type: "source", phase: 3, mobile: false, labelTier: 2 },
  { id: "s-evergreen", label: "Evergreen notes essay", type: "source", phase: 3, mobile: true, labelTier: 1 },
  { id: "s-alexander", label: "Christopher Alexander", type: "source", phase: 3, mobile: false, labelTier: 2 },
  { id: "s-field", label: "Field study: capture habits", type: "source", phase: 3, mobile: false, labelTier: 2 },

  // --- decisions -----------------------------------------------------------
  { id: "d-suggest", label: "Agents suggest, never file", type: "decision", phase: 3, mobile: true, labelTier: 1 },
  { id: "d-gesture", label: "Capture is one gesture", type: "decision", phase: 3, mobile: false, labelTier: 1 },
  { id: "d-private", label: "Unfinished ideas stay private", type: "decision", phase: 3, mobile: true, labelTier: 1 },
  { id: "d-review", label: "Review before applying", type: "decision", phase: 3, mobile: true, labelTier: 1 },
  { id: "d-database", label: "Hondo database holds the map", type: "decision", phase: 3, mobile: false, labelTier: 2 },

  // --- open questions ------------------------------------------------------
  { id: "q-ready", label: "When is an idea “ready”?", type: "question", phase: 3, mobile: true, labelTier: 1 },
  { id: "q-drafts", label: "Should agents see drafts?", type: "question", phase: 3, mobile: true, labelTier: 1 },
  { id: "q-howlong", label: "How long is “unfinished”?", type: "question", phase: 3, mobile: false, labelTier: 2 },
  { id: "q-auto", label: "Is organizing ever automatic?", type: "question", phase: 3, mobile: false, labelTier: 2 },
  { id: "q-cost", label: "What does protection cost?", type: "question", phase: 3, mobile: false, labelTier: 2 },
  { id: "q-unresolved", label: "Unresolved questions", type: "question", phase: 3, mobile: false, labelTier: 2 },

  // --- agent activity ------------------------------------------------------
  { id: "a-links", label: "Suggested 3 links", type: "agent", phase: 3, mobile: true, labelTier: 2 },
  { id: "a-summary", label: "Drafted summary", type: "agent", phase: 3, mobile: false, labelTier: 2 },
  { id: "a-stale", label: "Flagged stale note", type: "agent", phase: 3, mobile: false, labelTier: 2 },
  { id: "a-queue", label: "Queued review", type: "agent", phase: 3, mobile: true, labelTier: 2 },
  { id: "a-source", label: "Found related source", type: "agent", phase: 3, mobile: false, labelTier: 2 },
  { id: "a-merge", label: "Merged duplicates", type: "agent", phase: 3, mobile: false, labelTier: 2 },
];

// ---------------------------------------------------------------------------
// Deterministic layout targets: each type owns an angular sector around the
// thought; members spread inside it at staggered orbits.

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SECTOR: Record<Exclude<NodeType, "thought">, number> = {
  concept: -0.35,
  note: 0.55,
  source: 1.45,
  question: 2.35,
  agent: 3.25,
  decision: 4.15,
  task: 5.05,
};

const rand = mulberry32(19530807); // Hondo's release date

// Early-context nodes get explicit, well-separated placements so their type
// tags never collide in the quiet phase-2 composition.
const EARLY_LAYOUT: Record<string, { angle: number; orbit: number }> = {
  "n-daily": { angle: 0.3, orbit: 74 },
  "s-concept02": { angle: 1.55, orbit: 68 },
  "q-half": { angle: 2.85, orbit: 76 },
  "t-mobile": { angle: 4.75, orbit: 70 },
};

const byType = new Map<NodeType, Seed[]>();
for (const s of seeds) {
  const list = byType.get(s.type) ?? [];
  list.push(s);
  byType.set(s.type, list);
}

let order = 0;
export const NODES: BloomNode[] = seeds.map((s) => {
  if (s.type === "thought") {
    return { ...s, order: 0, angle: 0, orbit: 0 };
  }
  if (s.early && EARLY_LAYOUT[s.id]) {
    return { ...s, order: ++order, ...EARLY_LAYOUT[s.id] };
  }
  const group = byType.get(s.type)!;
  const i = group.indexOf(s);
  const spread = 0.8; // radians of sector width
  const angle =
    SECTOR[s.type] + (group.length === 1 ? 0 : (i / (group.length - 1) - 0.5) * spread) + (rand() - 0.5) * 0.18;
  const orbit = s.early ? 52 + rand() * 10 : 88 + (i % 3) * 26 + rand() * 18;
  return { ...s, order: ++order, angle, orbit };
});

export const LINKS: BloomLink[] = [
  // early context
  { source: THOUGHT_ID, target: "n-daily", phase: 2 },
  { source: THOUGHT_ID, target: "q-half", phase: 2 },
  { source: THOUGHT_ID, target: "s-concept02", phase: 2 },
  { source: THOUGHT_ID, target: "t-mobile", phase: 2 },

  // spine: thought → cluster anchors
  { source: THOUGHT_ID, target: "c-capture", phase: 3 },
  { source: THOUGHT_ID, target: "c-tagline", phase: 3 },
  { source: THOUGHT_ID, target: "n-protect", phase: 3 },
  { source: THOUGHT_ID, target: "d-private", phase: 3 },
  { source: THOUGHT_ID, target: "q-ready", phase: 3 },
  { source: THOUGHT_ID, target: "c-map", phase: 3 },

  // concepts
  { source: "c-tagline", target: "c-philosophy", phase: 3 },
  { source: "c-capture", target: "c-tagline", phase: 3 },
  { source: "c-capture", target: "n-labels", phase: 3 },
  { source: "c-living", target: "c-map", phase: 3 },
  { source: "c-living", target: "c-continuity", phase: 3 },
  { source: "c-truth", target: "c-map", phase: 3 },
  { source: "c-truth", target: "d-database", phase: 3 },
  { source: "c-control", target: "c-philosophy", phase: 3 },
  { source: "c-control", target: "d-review", phase: 3 },

  // notes
  { source: "n-daily", target: "n-walks", phase: 3 },
  { source: "n-daily", target: "t-inbox", phase: 3 },
  { source: "n-unfinished", target: "n-protect", phase: 3 },
  { source: "n-unfinished", target: "c-tagline", phase: 3 },
  { source: "n-decay", target: "n-labels", phase: 3 },
  { source: "n-decay", target: "s-zettel", phase: 3 },
  { source: "n-friction", target: "t-mobile", phase: 3 },
  { source: "n-friction", target: "d-gesture", phase: 3 },
  { source: "n-walks", target: "t-mobile", phase: 3 },
  { source: "n-modes", target: "n-protect", phase: 3 },
  { source: "n-modes", target: "q-cost", phase: 3 },
  { source: "n-garden", target: "s-evergreen", phase: 3 },
  { source: "n-garden", target: "n-decay", phase: 3 },
  { source: "n-labels", target: "q-half", phase: 3 },

  // sources
  { source: "s-concept02", target: "c-philosophy", phase: 3 },
  { source: "s-zettel", target: "s-evergreen", phase: 3 },
  { source: "s-gtd", target: "t-inbox", phase: 3 },
  { source: "s-gtd", target: "s-field", phase: 3 },
  { source: "s-evergreen", target: "n-unfinished", phase: 3 },
  { source: "s-alexander", target: "c-living", phase: 3 },
  { source: "s-field", target: "q-howlong", phase: 3 },

  // decisions
  { source: "d-suggest", target: "q-drafts", phase: 3 },
  { source: "d-suggest", target: "a-links", phase: 3 },
  { source: "d-gesture", target: "t-inbox", phase: 3 },
  { source: "d-private", target: "d-suggest", phase: 3 },
  { source: "d-private", target: "q-drafts", phase: 3 },
  { source: "d-review", target: "d-suggest", phase: 3 },
  { source: "d-review", target: "a-queue", phase: 3 },
  { source: "d-database", target: "t-sync", phase: 3 },

  // questions
  { source: "q-half", target: "q-howlong", phase: 3 },
  { source: "q-ready", target: "q-auto", phase: 3 },
  { source: "q-ready", target: "n-unfinished", phase: 3 },
  { source: "q-drafts", target: "q-cost", phase: 3 },
  { source: "q-auto", target: "c-control", phase: 3 },
  { source: "q-unresolved", target: "q-cost", phase: 3 },
  { source: "q-unresolved", target: "c-philosophy", phase: 3 },

  // tasks
  { source: "t-inbox", target: "t-quiet", phase: 3 },
  { source: "t-quiet", target: "n-modes", phase: 3 },
  { source: "t-suggest", target: "d-suggest", phase: 3 },
  { source: "t-suggest", target: "a-summary", phase: 3 },
  { source: "t-onboard", target: "c-tagline", phase: 3 },
  { source: "t-sync", target: "t-mobile", phase: 3 },

  // agent activity
  { source: "a-links", target: "c-map", phase: 3 },
  { source: "a-summary", target: "n-daily", phase: 3 },
  { source: "a-stale", target: "n-garden", phase: 3 },
  { source: "a-stale", target: "a-queue", phase: 3 },
  { source: "a-source", target: "s-field", phase: 3 },
  { source: "a-source", target: "s-evergreen", phase: 3 },
  { source: "a-merge", target: "n-walks", phase: 3 },
];

/** Dataset trimmed for a given breakpoint. Mobile keeps the concept intact
 *  with ~20 nodes and only the links between them. */
export function getDataset(isMobile: boolean): { nodes: BloomNode[]; links: BloomLink[] } {
  if (!isMobile) return { nodes: NODES, links: LINKS };
  const nodes = NODES.filter((n) => n.mobile);
  const ids = new Set(nodes.map((n) => n.id));
  const links = LINKS.filter((l) => ids.has(l.source) && ids.has(l.target));
  return { nodes, links };
}
