# Mind Bloom

Isolated scroll-driven landing experiment. One small dot — a single unfinished
thought — blooms into Hondo's Context Map as the user scrolls.

**Not integrated into any production landing page.** Preview route:
`/experiments/mind-bloom` (apps/site, `pnpm dev` → http://localhost:3001).

## The idea

> Think first. Organize later.

The first dot is a thought before it has been organized, labeled, filed, or
made useful. The graph that blooms out of it is everything that collects
around a thought over time: notes, tasks, sources, decisions, questions,
concepts, agent activity. The sample data is built around one real thought:
*"How should Hondo protect unfinished ideas?"*

## Architecture

| File | Role |
| --- | --- |
| `MindBloom.tsx` | Orchestrator: pinned section, scroll → timeline seek, interactivity gate, phase-5 chrome (wordmark, filters, zoom, inspector) |
| `BloomGraph.tsx` | force-graph wrapper: shape system, hairline links, scroll-driven force field, camera, hover/select/drag |
| `MindBloomCopy.tsx` | Narrative copy layers ("Think first." / "Organize later." / one-liner) |
| `bloom-data.ts` | 48-node desktop dataset (20 on mobile), deterministic layout targets |
| `bloom-timeline.ts` | anime.js timeline (autoplay off) + `BloomState` + phase thresholds |
| `styles.module.css` | Warm white stage, copy, chrome, inspector |

Division of labor: **anime.js directs, force-graph renders.** The timeline is
scrubbed with `tl.seek(progress × duration)` — never played — so every frame is
a pure function of scroll position and the sequence works identically in both
directions. The timeline animates a plain `BloomState` object; the graph reads
it every frame and derives per-node reveal, the force field, and the camera.
The graph never touches the scroll position.

## Animation phases (scroll progress 0–1)

| Phase | Range | What happens |
| --- | --- | --- |
| 1 — The thought | 0–0.12 | Warm-white viewport, one purple dot with a barely-there breathing motion (sinusoidal radius, ±5.5%). "Think first." fades in below it, then out. |
| 2 — Early context | 0.13–0.34 | Four neighbors (a note, a question, a source, a task) drift out to a tight orbit on hairline links. Tiny uppercase type tags (NOTE, QUESTION…) label them. Slow, controlled — `inOutQuad`. |
| 3 — The bloom | 0.34–0.62 | The threshold. All remaining nodes expand radially from the center (`outExpo` — fast, then precise), staggered by node order. Charge repulsion and link distances scale up with the same state value, the camera pulls back to 0.9×, and labels hold until ~0.50 when the primary movement is nearly done. |
| 4 — Settle | 0.62–0.84 | Velocity decay rises (0.55 → 0.75) and the anchor force tightens, so type neighborhoods calm down. "Organize later." then the one-liner fade in, then clear. |
| 5 — Product transition | 0.85–1.0 | Chrome fades in: Hondo wordmark, type filters, zoom controls, Experiment badge. At 0.97 the graph becomes interactive and the thought node is pre-selected in the right-side inspector. |

## The bloom mechanics (why it reverses cleanly)

Every node exists in the simulation from frame one. Un-revealed nodes are
simply not drawn and are held at the center by a custom **anchor force** whose
target radius is `orbit × spread`, where `spread` comes from the scrubbed
timeline. Scrolling forward grows the force field outward; scrolling backward
shrinks it and the same physics collapses the graph back into the dot. No
nodes are added or removed, so there is nothing to replay or reset.

Determinism: node angles/orbits come from a seeded PRNG in `bloom-data.ts`,
and each node starts 2 units off-center along its final direction, so the
bloom is radial and identical on every run.

## Final interactive state

- Pan (drag background), drag nodes (they drift back into their neighborhood)
- Zoom via buttons or ⌘/ctrl-scroll — plain scroll still moves the page
- Hover shows a label + highlights that node's links
- Click selects; the inspector lists the node's immediate relationships
- Type filters dim everything else to 15%

## Reduced motion

`prefers-reduced-motion: reduce` skips the timeline entirely. Three static
stages (dot → settled graph → chrome) crossfade on opacity only; the layout is
pre-warmed with 300 ticks so the graph appears already settled. No bloom
movement, no breathing, no camera pull.

## Responsive

- **Desktop:** 48 nodes, 520vh scroll distance, full labels + filters + hint.
- **Mobile (<768px):** 20-node subset (concept intact), 380vh scroll, tier-2
  labels never shown, filters hidden, inspector becomes a bottom sheet.

## Screenshots

`shots/` — captured headless at 1440×900 (mobile 390×844):

1. `1-thought.png` — the single thought
2. `2-early-context.png` — early context with type tags
3. `3-peak-bloom.png` — peak bloom, labels still held back
4. `4-settled-map.png` — settled Context Map with chrome + inspector
5. `5-mobile-settled.png` — mobile settled state
6. `6-rm-dot.png` / `7-rm-settled.png` — reduced-motion stages

## Performance / hygiene

- Simulation pauses when the tab is hidden or the section is off-screen
  (visibilitychange + IntersectionObserver).
- Hairlines are drawn at `1 / globalScale` so they stay 1px at every zoom.
- Node shapes by type: thought/concepts filled circles (thought is the one
  purple element), notes/sources outlined circles, tasks rounded squares,
  decisions diamonds, questions hollow rings, agent activity small points.
  Tiny semantic markers: green dot = source, blue dot = task.
