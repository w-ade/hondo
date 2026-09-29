# Poster

The hondo.wiki landing, laid out like the ©Mamoth type specimen: the swollen
wordmark, one huge sentence, the wordmark again as a boiling outline, a
caption, and small print at the foot.

The page demonstrates the product on itself:

- **Scripted run.** Once the webfont is in, a cursor drags across the ON
  MACOS that ends the big sentence, drawing the purple dev overlay (#C77DFF,
  10px out left and right, 8px top and bottom), and Hondo's toolbar fades and
  scales in centered over it. Same cursor timing as `inspect/` (2600ms),
  toolbar in at 2380ms. The corner button replays it.
- **Toolbar.** After Framer University's text-selection tooltip: a segmented
  bar with hairline dividers, `Inspect | Ask | Keep | ›`. The chevron slides
  to `‹ | Annotate | Source`: both pages ride a track in the clipped bar, the
  track slides by the first page's width while the bar animates to the
  other's (420ms, cubic-bezier(0.32, 0.72, 0, 1)). It matches the page:
  #FAFAF9 on the light page, #2a2a2a on the dark one. The actions don't do
  anything yet.
- **Live.** Select any amount of text on the page and the same overlay is
  drawn around all of it, with the toolbar centered on top (after pointer or
  key release, or once touch handles settle; cleared when the selection
  collapses or the page resizes). Doing so retires the scripted run.
- **Light / dark.** The poster follows the device's theme until the circle
  in the top-right corner (`../../theme/ThemeToggle.tsx`, ported from
  Portbrowser) flips it; the choice is remembered and applied before paint by
  the script in `app/layout.tsx`.

On phones the sentence and both wordmarks go flush left and the sentence
fills the width, sized so "and keep, ON MACOS." stays on one line.

The wordmark lives in `../wordmark/HondoWordmark.tsx`: `weight` (8) and
`tracking` (1.5) in wordmark units, `outline` for the line version, `boil` for
the jitter (three noise frames stepped at 420ms; 2400ms under reduced motion).
