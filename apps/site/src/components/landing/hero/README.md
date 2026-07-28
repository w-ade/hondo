# Hero

The hondo.wiki landing hero. Wordmark and copy, then a large interactive Hondo
window.

Source of truth: Figma `400 CONNECT → Landing`, node `221:411` — a 1440×1024
frame. Geometry is transcribed at the top of `styles.module.css`. There is no
site navigation and there are no calls to action in this frame.

The wordmark is the exported vector from node `221:798`, stored at
`public/hondo-wordmark.svg`. Never redraw it. Its designed box is
305.27 × 51.79 and the artwork overflows that box (−0.33% x, −1.96% y), so
`.wordmark` and `.wordmarkArt` are sized separately to preserve the geometry.

Two deliberate deviations from the frame, both for legibility: the headline is
20px (frame ≈16px) and the supporting line 13px (frame ≈8px). Everything else —
margins, column width, pane proportions, the bottom crop — is 1:1.

The window is not a screenshot section — it is a product demonstration, and it is
the beginning of the application itself. Every decision here is made so that
replacing a part with a real application component is a swap, not a rewrite.

## Composition

```
Hero                    layout only — holds no state
├── HeroCopy            wordmark · headline · supporting line
└── HeroWorkspace       owns the selected section; branches desktop vs phone
    ├── WorkspaceChrome    traffic lights · title bar · breadcrumb
    ├── WorkspaceSidebar   DOCUMENT · CONTEXT · HISTORY          (desktop)
    │   └── SectionRail    horizontal chip rail                  (phone)
    ├── WorkspaceContent   editor toolbar + arbitrary children
    │   └── DocumentImage | DocumentView
    ├── WorkspaceAgent     Chat / Review / Sources + composer
    └── WorkspaceFooter    word count · context timeline
```

Every component takes props and renders; none reaches outside itself. The only
lifted state is the active section, which lives in `HeroWorkspace` because the
sidebar, breadcrumb, footer and document pane all follow it.

## Rendering modes

`HeroWorkspace` accepts `mode`:

- **`"figma"`** (current) — the document body is the exported Figma screen for the
  active section.
- **`"live"`** — the document body is `<DocumentView />`, live React.

Everything else is identical between modes: layout, chrome, animation,
responsive behaviour, interaction. Switching is one word in `page.tsx`.

`WorkspaceContent` takes arbitrary children, so this already works today:

```tsx
<WorkspaceContent><DocumentImage src="/hero/document.png" … /></WorkspaceContent>
<WorkspaceContent><DocumentView blocks={…} /></WorkspaceContent>
```

Neither `Hero.tsx` nor anything above it knows the difference.

## Adding a new exported screen

1. Export the section from Figma (`300 SCREENS` → `1000 · Workspace`).
2. Crop it to the document pane and drop it in `public/hero/`.
3. Add `image: "/hero/<name>.png"` to that section in `workspace-data.ts`.

Nothing else changes. Sections without an `image` fall back to `DocumentView`,
so the sidebar never points at a dead pane.

`public/hero/window.png` is the untouched full-window export, kept as the visual
reference the React shell is matched against.

## The Figma is the product

`workspace-data.ts` mirrors the export — section names, group counts, concept
cards, agent thread, timeline ticks. It is a transcription, not a redesign. When
the Figma changes, update that file and the exports; do not reinterpret the
interface here.

## Responsive

Three purpose-built trees, not one layout scaled three ways.

| | Structure |
|---|---|
| **Desktop** ≥1200px | Sidebar + document + agent. One flush-left column at 71.27% width (the frame's 1026 of 1440); the copy hangs on the window's left edge. The window keeps its drawn 1026 : 754 proportion and runs off the bottom of the first viewport. |
| **Tablet** 768–1199px | Editor toolbar and agent panel drop. Sidebar + document keep the hierarchy; squeezing all three columns turns the product into a thumbnail. |
| **Phone** ≤767px | **The whole app, entire, scaled down.** The window is laid out at its designed 1026.24 × 754 and scaled by `transform` to fit a plate; nothing is re-flowed, cropped, or hidden. One screen, no page scroll. |

### The phone miniature

`useFitScale` measures the plate and returns `containerWidth / 1026.24`.
`HeroWorkspace` renders the window at full size inside `.fitInner` and applies
`transform: scale(...)`, with `.fit`'s height set inline to the scaled height so
the plate wraps it exactly.

Two things that will bite:

- It must be a **callback ref**, not `useRef` + `useEffect`. The host only mounts
  once the viewport is known to be a phone, which is *after* the component's
  mount effect has run — a plain effect measures `null` and never fires again,
  so the window renders full-size and blows out of the plate.
- **Nothing in the phone media query may override a style inside the window.**
  Changing `.doc`, `.docP`, `.footer` etc. under `max-width: 767px` distorts the
  miniature, because it is the real desktop tree.

Phone overflow is a regression risk — verify `scrollHeight === clientHeight` at
375×667 (the tightest phone) after any change to phone copy or spacing.

On phone the frame bleeds past the device but the **reading column does not** —
`.doc` is capped at the visible width so every line finishes on screen. The crop
is intrigue; unreadable text is just broken.

Phones typeset live rather than scaling the desktop export down. A shrunken
desktop screenshot is the one thing the phone hero must not be. When the Figma
`6000 · Mobile` screens are exported, set `imageMobile` on the section and the
phone will use them instead.

## Motion

`motion.ts` holds the whole vocabulary. Every spring is critically damped —
it settles, it never overshoots. 150–300ms. Nothing floats, bounces, tilts, or
fakes perspective.

The window never moves. Only the software inside it does: selection pills travel
between sidebar rows, groups and concept cards expand, agent tabs slide their
rule, the document cross-fades between sections, the composer caret blinks.

`prefers-reduced-motion` drops travel and keeps cross-fades; phones skip the
hover choreography and layout animation entirely.

## Verifying

The dev server is `pnpm dev` in `apps/site` (port 3001). Screenshot headless at
1440, 900 and 390 and look at all three before calling a change good.
