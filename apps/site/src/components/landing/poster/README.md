# Poster

The hondo.wiki landing, laid out like the ©Mamoth type specimen: the swollen
wordmark, one huge sentence, the wordmark again as a boiling outline, a
caption, and small print at the foot.

The page demonstrates the product on itself:

- **Scripted run.** Once the webfont is in, a cursor drags across the ON
  MACOS that ends the big sentence, drawing the purple dev overlay (#C77DFF,
  10px out left and right, 8px top and bottom), and Hondo's pill opens
  centered over it: Inspect · Ask · Annotate · Keep. Same cursor timing as
  `inspect/` (2600ms), pill in at 2380ms. The corner button replays it.
- **Live.** Select any amount of text on the page and the same overlay is
  drawn around all of it, with the pill centered on top (after pointer or key
  release, or once touch handles settle; cleared when the selection collapses
  or the page resizes). The pill's actions can be chosen, which moves the
  highlight; they don't do anything else yet. Doing so retires the scripted
  run.
- **Light / dark.** The pill comes in both, switched from the corner or with
  `?toolbar=light|dark`. Temporary, until one is picked.

On phones the sentence and both wordmarks go flush left and the sentence
fills the width, sized so "and keep, ON MACOS." stays on one line.

The wordmark lives in `../wordmark/HondoWordmark.tsx`: `weight` (8) and
`tracking` (1.5) in wordmark units, `outline` for the line version, `boil` for
the jitter (three noise frames stepped at 420ms; 2400ms under reduced motion).
