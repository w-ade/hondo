# Inspect

The hondo.wiki landing: Hondo's two paragraphs centered on a #FAFAF9 page, and
a cursor that comes in and selects *inspectable system* under a purple dev
overlay — the page inspecting its own text. It plays once the webfont is
loaded; the corner button replays it.

Recreated from the Hondo card on brianawade.com
(`~/Developer/Projects/wade-site/src/components/hondo/HondoCard.tsx`), which
is 588×441 and scaled as one piece. Here it is a real page: the text column is
`min(360px, 100%)` and nothing is scaled.

## Timing (2600ms, all in `styles.module.css`)

| | |
|---|---|
| 0–50% | cursor glides in from (360, 160), strong ease-out, straightening from −8° |
| 50–64% | press: settles on the phrase's left edge at 0.97 scale |
| 64–86% | drag to the right edge; the selection reveals left-to-right in step (starts 1660ms, 575ms) |
| 86–100% | release, drift down-right, fade |

The drag distance is not hard-coded: `InspectHero` measures the target span and
sets `--target-w`, and the keyframes end at `--target-w + 9px` (the cursor's
hotspot is at (2, 1.5) in its 18×22 box, placed at `left: -8px`). Change the
phrase or the font and the path still lands.

Reduced motion: no cursor; the selection fades in over 200ms.

Moved off the landing to `/experiments/inspect`; the workspace hero before it is at `/experiments/workspace`.
