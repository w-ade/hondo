"use client";

// The visual + physical layer. force-graph renders and simulates; it never
// reads the scroll position. Every frame it reads the BloomState object that
// the anime.js timeline scrubs, and derives from it: per-node reveal, the
// force field (anchor / charge / link / collide), and the camera. Because the
// state is scrubbed deterministically, scrolling backwards collapses the
// bloom the same way it grew.

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type RefObject,
} from "react";
import type ForceGraph from "force-graph";

// force-graph declares ForceFn but doesn't export it from the package entry.
type ForceFn<N> = ((alpha: number) => void) & {
  initialize?: (nodes: N[], ...args: unknown[]) => void;
};
import {
  THOUGHT_ID,
  TYPE_LABELS,
  type BloomLink,
  type BloomNode,
  type NodeType,
} from "./bloom-data";
import type { BloomState } from "./bloom-timeline";
import styles from "./styles.module.css";

export interface BloomGraphHandle {
  zoomIn(): void;
  zoomOut(): void;
  zoomToFit(): void;
  selectNode(id: string | null): void;
}

interface SimNode extends BloomNode {
  /** per-frame computed reveal, 0..1 */
  rev?: number;
}

interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
  phase: 1 | 2 | 3;
  dist: number;
}

interface Props {
  nodes: BloomNode[];
  links: BloomLink[];
  stateRef: RefObject<BloomState>;
  reducedMotion: boolean;
  interactive: boolean;
  filter: NodeType | "all";
  onSelect: (node: BloomNode | null) => void;
}

// Hondo light palette (raw values, mirrored from globals.css for canvas use)
const INK_1 = "#363636";
const INK_2 = "#555555";
const INK_3 = "#888888";
const INK_4 = "#9a9a9a";
const INK_5 = "#b0b0b0";
const CARD = "#ffffff";
const ACCENT = "#7c3aed";
const GREEN = "#71c08e";
const BLUE = "#6caff5";
const LINK_COLOR = "88, 82, 74"; // warm gray, rgb triplet for alpha strings

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : 0 + v);
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function baseRadius(n: SimNode): number {
  switch (n.type) {
    case "thought": return 5.2;
    case "concept": return 3.3;
    case "note": return 3.0;
    case "source": return 2.7;
    case "task": return 2.8;
    case "decision": return 3.0;
    case "question": return 2.9;
    case "agent": return 1.5;
  }
}

/** Pairwise collision keeps neighborhoods editorial instead of overlapping.
 *  N is small (≤48), so O(n²) is cheaper than a quadtree. */
function makeCollide(getPad: () => number): ForceFn<SimNode> {
  let nodes: SimNode[] = [];
  const force = ((alpha: number) => {
    const pad = getPad();
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const ra = (a.rev ?? 0) * baseRadius(a) + pad;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        if ((a.rev ?? 0) < 0.05 && (b.rev ?? 0) < 0.05) continue;
        const rb = (b.rev ?? 0) * baseRadius(b) + pad;
        let dx = (b.x ?? 0) - (a.x ?? 0);
        let dy = (b.y ?? 0) - (a.y ?? 0);
        let d2 = dx * dx + dy * dy;
        const min = ra + rb;
        if (d2 >= min * min) continue;
        if (d2 === 0) { dx = 0.1; dy = 0.1; d2 = 0.02; }
        const d = Math.sqrt(d2);
        const push = ((min - d) / d) * 0.5 * alpha;
        const px = dx * push;
        const py = dy * push;
        if (a.fx == null) { a.vx = (a.vx ?? 0) - px; a.vy = (a.vy ?? 0) - py; }
        if (b.fx == null) { b.vx = (b.vx ?? 0) + px; b.vy = (b.vy ?? 0) + py; }
      }
    }
  }) as ForceFn<SimNode>;
  force.initialize = (n: SimNode[]) => { nodes = n; };
  return force;
}

const BloomGraph = forwardRef<BloomGraphHandle, Props>(function BloomGraph(
  { nodes, links, stateRef, reducedMotion, interactive, filter, onSelect },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraph<SimNode, SimLink> | null>(null);
  const interactiveRef = useRef(interactive);
  const filterRef = useRef(filter);
  const hoverRef = useRef<SimNode | null>(null);
  const selectedRef = useRef<SimNode | null>(null);
  const cameraHoldUntil = useRef(0);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  filterRef.current = filter;

  useImperativeHandle(ref, () => ({
    zoomIn: () => { const g = graphRef.current; if (g) g.zoom(g.zoom() * 1.35, 300); },
    zoomOut: () => { const g = graphRef.current; if (g) g.zoom(g.zoom() / 1.35, 300); },
    zoomToFit: () => graphRef.current?.zoomToFit(400, 70, (n) => (n.rev ?? 0) > 0.5),
    selectNode: (id) => {
      const g = graphRef.current;
      if (!g) return;
      const node = id ? g.graphData().nodes.find((n) => n.id === id) ?? null : null;
      selectedRef.current = node;
      onSelectRef.current(node);
    },
  }));

  // Interaction gating — the graph is a passive stage during the narrative.
  useEffect(() => {
    interactiveRef.current = interactive;
    const g = graphRef.current;
    if (!g) return;
    g.enableNodeDrag(interactive);
    g.enablePanInteraction(interactive);
    // Plain wheel keeps scrolling the page; zoom needs ⌘/ctrl (or pinch).
    g.enableZoomInteraction(
      interactive ? (e: MouseEvent) => e.type !== "wheel" || e.ctrlKey || e.metaKey : false
    );
    if (!interactive) {
      // Returning to the narrative: glide the camera back under timeline control.
      const s = stateRef.current;
      const narrow = containerRef.current && containerRef.current.clientWidth < 768;
      g.zoom(s.zoom * (narrow ? 0.62 : 1), 450);
      g.centerAt(0, 0, 450);
      cameraHoldUntil.current = performance.now() + 470;
      selectedRef.current = null;
      hoverRef.current = null;
      onSelectRef.current(null);
    }
  }, [interactive, stateRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let disposed = false;
    let graph: ForceGraph<SimNode, SimLink> | null = null;
    let resizeObs: ResizeObserver | null = null;
    let intersectObs: IntersectionObserver | null = null;
    let offscreen = false;
    const fontFamily = getComputedStyle(document.body).fontFamily || "Inter, sans-serif";

    import("force-graph").then(({ default: ForceGraphCtor }) => {
      if (disposed || !containerRef.current) return;

      const simNodes: SimNode[] = nodes.map((n) => ({
        ...n,
        // Deterministic start: a whisper off-center along the final direction,
        // so the bloom expands radially instead of scattering.
        x: n.type === "thought" ? 0 : Math.cos(n.angle) * 2,
        y: n.type === "thought" ? 0 : Math.sin(n.angle) * 2,
        fx: n.type === "thought" ? 0 : undefined,
        fy: n.type === "thought" ? 0 : undefined,
      }));
      const simLinks: SimLink[] = links.map((l) => ({
        ...l,
        dist: l.source === THOUGHT_ID ? 62 : 34,
      }));

      const g = new ForceGraphCtor<SimNode, SimLink>(containerRef.current);
      graph = g;
      graphRef.current = g;

      const rm = reducedMotion;

      // --- per-frame derived values -------------------------------------
      const computeReveals = () => {
        const s = stateRef.current;
        const earlyCount = simNodes.filter((n) => n.phase === 2).length;
        let earlyIdx = 0;
        const total = simNodes.length;
        for (const n of simNodes) {
          if (n.phase === 1) { n.rev = 1; continue; }
          if (n.phase === 2) {
            const start = (earlyIdx++ / Math.max(1, earlyCount)) * 0.5;
            n.rev = clamp01((s.early - start) / 0.4);
            continue;
          }
          const start = (n.order / total) * 0.55;
          n.rev = clamp01((s.bloom - start) / 0.3);
        }
      };

      // --- scroll-driven force field ------------------------------------
      // Under reduced motion the force field is permanently the settled one:
      // nodes live at their final positions and only the *drawing* crossfades.
      const physState = () => {
        const s = stateRef.current;
        return rm ? { ...s, early: 1, bloom: 1, settle: 1 } : s;
      };

      const anchor: ForceFn<SimNode> = (alpha: number) => {
        const s = physState();
        const k = 0.05 + 0.05 * s.settle;
        for (const n of simNodes) {
          if (n.fx != null) continue;
          const spread = n.phase === 2 ? clamp01(s.early) * (1 + 0.4 * s.bloom) : outCubic(clamp01(s.bloom));
          const tx = Math.cos(n.angle) * n.orbit * spread;
          const ty = Math.sin(n.angle) * n.orbit * spread;
          n.vx = (n.vx ?? 0) + (tx - (n.x ?? 0)) * k * alpha;
          n.vy = (n.vy ?? 0) + (ty - (n.y ?? 0)) * k * alpha;
        }
      };
      anchor.initialize = () => undefined;

      g.graphData({ nodes: simNodes, links: simLinks })
        .nodeLabel(() => "")
        .backgroundColor("rgba(0,0,0,0)")
        .autoPauseRedraw(false)
        .cooldownTime(Infinity)
        .d3AlphaDecay(rm ? 0.03 : 0)
        .d3VelocityDecay(0.55)
        .warmupTicks(rm ? 300 : 0)
        .enableNodeDrag(false)
        .enablePanInteraction(false)
        .enableZoomInteraction(false)
        .showPointerCursor((obj) => interactiveRef.current && !!obj);

      g.d3Force("center", null);
      g.d3Force("anchor", anchor);
      // more personal space once labels are on screen
      g.d3Force("collide", makeCollide(() => 4.5 + 8 * (rm ? 1 : stateRef.current.labels)));

      // charge + link strengths are cached by d3 at init; re-sync on change
      let lastSync = -1;
      const syncForces = () => {
        const s = physState();
        const key = Math.round(s.bloom * 33) + Math.round(s.early * 33) * 100 + Math.round(s.settle * 20) * 10000;
        if (key === lastSync) return;
        lastSync = key;
        const charge = g.d3Force("charge");
        if (charge && "strength" in charge) {
          (charge as ForceFn<SimNode> & { strength: (v: number) => void }).strength(
            -(6 + 84 * s.bloom + 40 * s.settle)
          );
        }
        const linkForce = g.d3Force("link");
        if (linkForce && "distance" in linkForce) {
          const lf = linkForce as ForceFn<SimNode> & {
            distance: (fn: (l: SimLink) => number) => void;
            strength: (fn: (l: SimLink) => number) => void;
          };
          lf.distance((l: SimLink) => l.dist * (0.3 + 0.7 * s.bloom));
          lf.strength((l: SimLink) => {
            if (rm) return 0.25; // layout is always fully settled under reduced motion
            const a = typeof l.source === "object" ? l.source.rev ?? 0 : 0;
            const b = typeof l.target === "object" ? l.target.rev ?? 0 : 0;
            return 0.25 * Math.min(a, b);
          });
        }
        g.d3VelocityDecay(lerp(0.55, 0.75, s.settle));
      };

      if (rm) {
        // Reduced motion: the graph exists fully settled; visibility is a crossfade.
        for (const n of simNodes) {
          if (n.type === "thought") continue;
          n.x = Math.cos(n.angle) * n.orbit;
          n.y = Math.sin(n.angle) * n.orbit;
        }
      }

      // Sync the force field before the engine's first tick — otherwise the
      // warmup runs on d3's default link/charge forces and tangles the layout.
      computeReveals();
      syncForces();

      // --- camera + per-frame sync --------------------------------------
      // Narrow viewports get the same narrative at a smaller camera scale so
      // the settled graph fits the screen.
      const fitK = () =>
        containerRef.current && containerRef.current.clientWidth < 768 ? 0.62 : 1;
      let lastZoom = -1;
      g.onRenderFramePre(() => {
        computeReveals();
        syncForces();
        const s = stateRef.current;
        if (!interactiveRef.current && performance.now() > cameraHoldUntil.current) {
          const k = s.zoom * fitK();
          if (Math.abs(k - lastZoom) > 0.001) {
            lastZoom = k;
            g.zoom(k);
            g.centerAt(0, 0);
          }
        } else {
          lastZoom = -1;
        }
      });

      // --- links: hairlines, revealed with their endpoints ---------------
      g.linkCanvasObjectMode(() => "replace").linkCanvasObject((l, ctx, scale) => {
        const s = stateRef.current;
        const a = typeof l.source === "object" ? l.source : null;
        const b = typeof l.target === "object" ? l.target : null;
        if (!a || !b) return;
        let alpha = Math.min(a.rev ?? 0, b.rev ?? 0);
        if (alpha <= 0.02) return;
        const f = filterRef.current;
        if (f !== "all" && a.type !== f && b.type !== f && a.type !== "thought" && b.type !== "thought") {
          alpha *= 0.15;
        }
        const focus = hoverRef.current ?? selectedRef.current;
        const isFocus = focus && (a.id === focus.id || b.id === focus.id);
        ctx.beginPath();
        ctx.moveTo(a.x ?? 0, a.y ?? 0);
        ctx.lineTo(b.x ?? 0, b.y ?? 0);
        if (isFocus) {
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.5 * alpha})`;
          ctx.lineWidth = 1.4 / scale;
        } else {
          const dim = focus ? 0.45 : 1;
          ctx.strokeStyle = `rgba(${LINK_COLOR}, ${0.4 * alpha * dim + 0.12 * s.settle * alpha * dim})`;
          ctx.lineWidth = 1 / scale;
        }
        ctx.stroke();
      });

      // --- nodes: the shape system ---------------------------------------
      g.nodeCanvasObjectMode(() => "replace").nodeCanvasObject((n, ctx, scale) => {
        const s = stateRef.current;
        const rev = n.rev ?? 0;
        if (rev <= 0.01) return;
        const x = n.x ?? 0;
        const y = n.y ?? 0;
        let r = baseRadius(n) * outCubic(rev);
        const f = filterRef.current;
        const dimmed = f !== "all" && n.type !== f && n.type !== "thought";
        const alpha = (dimmed ? 0.15 : 1) * Math.min(1, rev * 1.6);
        const hair = 1 / scale;

        if (n.type === "thought" && !rm) {
          // barely-there breathing; strongest while the thought is alone
          const calm = 1 - 0.75 * s.bloom;
          r *= 1 + 0.055 * calm * Math.sin(performance.now() / 950);
        }

        ctx.globalAlpha = alpha;
        ctx.lineWidth = hair;

        switch (n.type) {
          case "thought":
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fillStyle = ACCENT;
            ctx.fill();
            break;
          case "concept":
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fillStyle = INK_1;
            ctx.fill();
            break;
          case "note":
          case "source": {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fillStyle = CARD;
            ctx.fill();
            ctx.strokeStyle = n.type === "note" ? INK_2 : INK_4;
            ctx.stroke();
            if (n.type === "source") {
              ctx.beginPath();
              ctx.arc(x + r * 0.85, y - r * 0.85, 0.9, 0, 2 * Math.PI);
              ctx.fillStyle = GREEN;
              ctx.fill();
            }
            break;
          }
          case "task": {
            const side = r * 1.7;
            const corner = r * 0.4;
            ctx.beginPath();
            ctx.roundRect(x - side / 2, y - side / 2, side, side, corner);
            ctx.fillStyle = CARD;
            ctx.fill();
            ctx.strokeStyle = INK_2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x + side / 2 * 0.85, y - side / 2 * 0.85, 0.9, 0, 2 * Math.PI);
            ctx.fillStyle = BLUE;
            ctx.fill();
            break;
          }
          case "decision":
            ctx.beginPath();
            ctx.moveTo(x, y - r * 1.15);
            ctx.lineTo(x + r * 1.15, y);
            ctx.lineTo(x, y + r * 1.15);
            ctx.lineTo(x - r * 1.15, y);
            ctx.closePath();
            ctx.fillStyle = INK_2;
            ctx.fill();
            break;
          case "question":
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.strokeStyle = INK_3;
            ctx.lineWidth = 1.5 / scale;
            ctx.stroke();
            break;
          case "agent":
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fillStyle = INK_5;
            ctx.fill();
            break;
        }

        // rings for selection / hover
        const focus = selectedRef.current;
        if (focus && focus.id === n.id) {
          ctx.beginPath();
          ctx.arc(x, y, r + 2.4, 0, 2 * Math.PI);
          ctx.strokeStyle = ACCENT;
          ctx.lineWidth = hair;
          ctx.stroke();
        } else if (hoverRef.current && hoverRef.current.id === n.id) {
          ctx.beginPath();
          ctx.arc(x, y, r + 2, 0, 2 * Math.PI);
          ctx.strokeStyle = INK_4;
          ctx.lineWidth = hair;
          ctx.stroke();
        }

        // --- labels, progressively disclosed ------------------------------
        const isFocused =
          (hoverRef.current?.id === n.id || selectedRef.current?.id === n.id) && interactiveRef.current;
        // type tags belong to the quiet phase; they clear as soon as the bloom fires
        const earlyTagAlpha =
          n.phase === 2 ? rev * (1 - clamp01(s.bloom * 2.5)) * (1 - clamp01(s.labels * 2)) : 0;
        let labelAlpha = s.labels * rev * (dimmed ? 0.25 : 1);
        if (n.labelTier === 2 && scale < 1.35) labelAlpha = 0;
        if (isFocused) labelAlpha = 1;

        if (earlyTagAlpha > 0.02) {
          ctx.globalAlpha = earlyTagAlpha * 0.9;
          ctx.font = `500 ${8.5 / scale}px ${fontFamily}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = INK_4;
          ctx.fillText(TYPE_LABELS[n.type].toUpperCase(), x, y + r + 3 / scale);
        } else if (labelAlpha > 0.02) {
          ctx.globalAlpha = labelAlpha;
          ctx.font = `${(n.type === "thought" ? 10.5 : 9.5) / scale}px ${fontFamily}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = n.type === "thought" ? INK_1 : n.type === "agent" ? INK_4 : INK_2;
          const label = n.label;
          if (label.length > 24) {
            const mid = label.lastIndexOf(" ", Math.ceil(label.length / 2));
            const l1 = mid > 0 ? label.slice(0, mid) : label;
            const l2 = mid > 0 ? label.slice(mid + 1) : "";
            ctx.fillText(l1, x, y + r + 3.5 / scale);
            if (l2) ctx.fillText(l2, x, y + r + 3.5 / scale + 11.5 / scale);
          } else {
            ctx.fillText(label, x, y + r + 3.5 / scale);
          }
        }
        ctx.globalAlpha = 1;
      });

      g.nodePointerAreaPaint((n, color, ctx) => {
        if (!interactiveRef.current || (n.rev ?? 0) < 0.8) return;
        ctx.beginPath();
        ctx.arc(n.x ?? 0, n.y ?? 0, baseRadius(n) + 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      });

      g.onNodeHover((n) => { hoverRef.current = n ?? null; });
      g.onNodeClick((n) => {
        selectedRef.current = n;
        onSelectRef.current(n);
      });
      g.onBackgroundClick(() => {
        selectedRef.current = null;
        onSelectRef.current(null);
      });
      g.onNodeDragEnd((n) => {
        // let dragged nodes drift back into their neighborhood
        if (n.type !== "thought") { n.fx = undefined; n.fy = undefined; }
      });

      // --- sizing + initial camera ---------------------------------------
      const size = () => {
        if (!containerRef.current) return;
        g.width(containerRef.current.clientWidth);
        g.height(containerRef.current.clientHeight);
      };
      size();
      resizeObs = new ResizeObserver(size);
      resizeObs.observe(el);
      g.zoom(stateRef.current.zoom * fitK());
      g.centerAt(0, 0);

      // --- pause when hidden or off-screen -------------------------------
      const syncPause = () => {
        if (!graph) return;
        if (document.hidden || offscreen) graph.pauseAnimation();
        else graph.resumeAnimation();
      };
      document.addEventListener("visibilitychange", syncPause);
      intersectObs = new IntersectionObserver((entries) => {
        offscreen = !entries[0].isIntersecting;
        syncPause();
      });
      intersectObs.observe(el);

      (g as unknown as { __cleanupExtras?: () => void }).__cleanupExtras = () => {
        document.removeEventListener("visibilitychange", syncPause);
      };
    });

    return () => {
      disposed = true;
      resizeObs?.disconnect();
      intersectObs?.disconnect();
      if (graph) {
        (graph as unknown as { __cleanupExtras?: () => void }).__cleanupExtras?.();
        graph._destructor();
      }
      graphRef.current = null;
    };
    // The graph is built once per dataset / motion mode; live values flow
    // through refs, not re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={interactive ? styles.graph : `${styles.graph} ${styles.graphPassive}`}
      aria-hidden={!interactive}
    />
  );
});

export default BloomGraph;
