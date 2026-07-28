/**
 * Workspace content, transcribed from the Figma export (300 SCREENS →
 * 1000 · Workspace). The export is the source of truth for the product; this
 * file only mirrors it so the shell can be interactive.
 *
 * When the Figma changes, update this file and drop the new export into
 * public/hero/. Nothing else in the hero needs to change.
 */

export type SectionId =
  | "overview"
  | "philosophy"
  | "core-loop"
  | "principles"
  | "agent-behavior"
  | "initial-scope"
  | "open-questions";

export type Block =
  | { kind: "h1"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "struck"; text: string }
  | { kind: "revision"; text: string };

export interface Section {
  id: SectionId;
  label: string;
  /** Exported Figma screen for this section, if one exists yet. */
  image?: string;
  /**
   * Phone export: a narrower column off the same screen, so the type lands at
   * a readable size instead of shrinking the desktop layout to fit.
   */
  imageMobile?: string;
  /** Live fallback, used until an export exists. Same type ramp either way. */
  blocks: Block[];
  words: string;
}

export const SECTIONS: Section[] = [
  {
    id: "overview",
    label: "Overview",
    image: "/hero/document.png",
    words: "2,840",
    // Mirrors the exported screen, so the phone shows the same document in the
    // same states rather than a shrunken picture of the desktop one.
    blocks: [
      { kind: "h1", text: "Hondo" },
      { kind: "h2", text: "Product definition" },
      {
        kind: "p",
        text: "Hondo is a workspace for notes, tasks, context, and agent collaboration.",
      },
      {
        kind: "p",
        text: "It gives unfinished thoughts a place to exist before they are organized, labeled, filed, or made useful.",
      },
      {
        kind: "p",
        text: "Most work begins messily. Ideas appear in conversation, notes, screenshots, tasks, references, and half-finished documents. Hondo keeps those materials connected so the user and their agents can continue from the same context.",
      },
      {
        kind: "p",
        text: "The workspace remains the durable center of the work. Notes capture the thinking. Tasks preserve intent. Context explains why decisions were made. Agents help organize, connect, revise, and move the work forward.",
      },
      { kind: "struck", text: "Hondo is not a system that requires structure before thought." },
      {
        kind: "revision",
        text: "Hondo lets you think first and organize later, while the workspace and its agents preserve the context that makes the thought useful.",
      },
      { kind: "h2", text: "Problem" },
      { kind: "p", text: "Important work rarely begins in a clean or complete form." },
      {
        kind: "list",
        items: [
          "Useful thoughts disappear inside chat history.",
          "Notes become disconnected from the tasks they created.",
          "Decisions lose the reasoning and references behind them.",
          "Agents repeatedly ask for context the user has already provided.",
          "Organizing too early interrupts the act of thinking.",
        ],
      },
    ],
  },
  {
    id: "philosophy",
    label: "Product philosophy",
    words: "1,204",
    blocks: [
      { kind: "h1", text: "Product philosophy" },
      { kind: "h2", text: "Ethos" },
      {
        kind: "p",
        text: "A thought deserves to exist before it is organized or made useful.",
      },
      { kind: "h2", text: "Product principle" },
      { kind: "p", text: "Protect the thought. Do not interrupt it." },
      { kind: "h2", text: "Brand expression" },
      { kind: "p", text: "Think first. Organize later." },
      {
        kind: "p",
        text: "This is not merely branding. Branding is how it gets expressed. The deeper thing is the product philosophy.",
      },
    ],
  },
  {
    id: "core-loop",
    label: "Core loop",
    words: "986",
    blocks: [
      { kind: "h1", text: "Core loop" },
      {
        kind: "p",
        text: "The workflow the whole product is built to protect.",
      },
      {
        kind: "list",
        items: [
          "Capture — get the thought, file, link, or source into Hondo.",
          "Extract — pull out concepts, decisions, quotes, and questions.",
          "Connect — relate new material to existing notes and sources.",
          "Cite — preserve the exact passage or document location.",
          "Ask — query the workspace.",
          "Revise — correct what Hondo remembers.",
          "Remember — update the durable workspace.",
        ],
      },
    ],
  },
  {
    id: "principles",
    label: "Product principles",
    words: "1,517",
    blocks: [
      { kind: "h1", text: "Product principles" },
      { kind: "h2", text: "The user captures. Hondo restores order." },
      {
        kind: "p",
        text: "The user should not have to maintain the system religiously. Messy dumping, inconsistent capture, and returning after several days away are all supported states, not failure states.",
      },
      { kind: "struck", text: "Structure is required before a thought is admitted." },
      {
        kind: "revision",
        text: "Structure emerges from the work, and the workspace maintains it.",
      },
    ],
  },
  {
    id: "agent-behavior",
    label: "Agent behavior",
    words: "1,342",
    blocks: [
      { kind: "h1", text: "Agent behavior" },
      {
        kind: "p",
        text: "Agents propose. The user decides. Every change arrives as a visible, reversible revision rather than a silent rewrite.",
      },
      {
        kind: "list",
        items: [
          "Cite the passage that supports the claim.",
          "Never rewrite the document without review.",
          "Ask once. Do not re-request context already given.",
          "Surface stale or contradictory context rather than guessing.",
        ],
      },
    ],
  },
  {
    id: "initial-scope",
    label: "Initial scope",
    words: "744",
    blocks: [
      { kind: "h1", text: "Initial scope" },
      { kind: "h2", text: "In" },
      {
        kind: "list",
        items: [
          "Desktop note workspace",
          "Mobile capture",
          "PDF import, extraction, and highlight",
          "Annotation storage, separate from the file",
          "Source-backed answers with page citations",
        ],
      },
      { kind: "h2", text: "Out, for now" },
      {
        kind: "list",
        items: ["Team collaboration", "Public sharing", "Full citation manager"],
      },
    ],
  },
  {
    id: "open-questions",
    label: "Open questions",
    words: "612",
    blocks: [
      { kind: "h1", text: "Open questions" },
      {
        kind: "list",
        items: [
          "Local-first desktop with a mobile companion, or cloud-first with local-first behavior?",
          "Does the mobile scaffold start in Expo or SwiftUI?",
          "Should PDF text extraction happen locally first?",
          "What is the minimum source trail that feels trustworthy?",
          "What is the first PDF demo use case?",
        ],
      },
    ],
  },
];

export interface ContextGroup {
  id: string;
  label: string;
  count: number;
  /** Cards revealed when the group is expanded. */
  cards?: { title: string; body?: string; meta?: string }[];
}

export const CONTEXT_GROUPS: ContextGroup[] = [
  {
    id: "concepts",
    label: "Concepts",
    count: 3,
    cards: [
      {
        title: "Unstructured Capture",
        body: "A low-friction space for thoughts, notes, tasks, references, and unfinished ideas.",
        meta: "4 sources · updated 2h ago",
      },
      { title: "Living Context" },
      { title: "Agent Collaboration" },
    ],
  },
  {
    id: "decisions",
    label: "Decisions",
    count: 6,
    cards: [
      {
        title: "Hondo is the main mobile track",
        body: "The iOS effort moves off Browser Jot and onto Hondo, effective immediately.",
        meta: "2 sources · decided 2026-07-27",
      },
      { title: "PDF import is core scope" },
      { title: "Annotations stored beside the file" },
    ],
  },
  {
    id: "tasks",
    label: "Tasks",
    count: 14,
    cards: [
      {
        title: "Choose the mobile scaffold",
        body: "Expo or SwiftUI. Blocks the first Hondo iOS build.",
        meta: "Open · no owner",
      },
      { title: "Define the first PDF demo" },
      { title: "Draft the AI processing disclosure" },
    ],
  },
  {
    id: "sources",
    label: "Sources",
    count: 9,
    cards: [
      {
        title: "Zotero — annotations in database",
        body: "Why annotations sync faster when they live outside the PDF.",
        meta: "zotero.org · added 4d ago",
      },
      { title: "U.S. Copyright Office — Fair Use FAQ" },
      { title: "17 U.S.C. Chapter 12" },
    ],
  },
  {
    id: "open-questions",
    label: "Open Questions",
    count: 5,
    cards: [
      {
        title: "Local-first or cloud-first?",
        body: "Desktop with a mobile companion, or cloud sync with local-first behavior.",
        meta: "Unresolved · affects 3 decisions",
      },
      { title: "Where does PDF extraction run?" },
      { title: "What is the minimum source trail?" },
    ],
  },
];

export const HISTORY_GROUPS: ContextGroup[] = [
  {
    id: "activity",
    label: "Activity",
    count: 23,
    cards: [
      {
        title: "Revision accepted",
        body: "“Hondo lets you think first and organize later…” replaced the previous opening.",
        meta: "2h ago · Overview",
      },
      { title: "Concept added — Living Context" },
      { title: "4 sources attached to Unstructured Capture" },
    ],
  },
];

export type AgentTab = "chat" | "review" | "sources";

export interface AgentMessage {
  kind: "note" | "instruction" | "answer";
  paragraphs: string[];
  sources?: number;
}

export const AGENT_THREAD: AgentMessage[] = [
  {
    kind: "note",
    paragraphs: [
      "You think before everything is organized. Hondo protects the thought. The workspace and its agents help structure it later.",
      "That makes the relationship between capture, context, and agent collaboration easier to understand before introducing individual features.",
    ],
    sources: 2,
  },
  {
    kind: "instruction",
    paragraphs: [
      "Make the opening feel more direct. Emphasize that Hondo removes the need to organize before thinking.",
    ],
  },
  {
    kind: "answer",
    paragraphs: [
      "Hondo gives you and your agents one shared place to think, organize, and continue the work.",
      "Notes hold the ideas. Tasks preserve what needs to happen. Context keeps the reasoning, sources, and decisions attached. Agents help connect those parts without forcing the user to structure everything upfront.",
      "As the work evolves, Hondo updates the workspace instead of burying progress inside isolated conversations.",
    ],
    sources: 3,
  },
];

/** Coloured ticks along the footer's context timeline, left to right. */
export const TIMELINE_TICKS = [
  "ink", "ink", "accent", "ink", "blue", "ink", "ink", "orange", "ink",
  "accent", "ink", "ink", "blue", "ink", "green", "ink", "ink", "blue",
  "ink", "orange", "ink", "ink", "accent", "ink", "ink",
] as const;
