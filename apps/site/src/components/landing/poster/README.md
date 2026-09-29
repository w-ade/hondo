# Poster

The hondo.wiki landing, laid out like the ©Mamoth type specimen: the swollen
wordmark, one huge sentence, the wordmark again as a boiling outline, a
caption, and small print at the foot.

The page demonstrates the product on itself:

- **Scripted run.** Once the webfont is in, a cursor selects *selected
  information* in the big sentence under the purple dev overlay (#C77DFF), and
  Hondo's toolbar opens under it: Inspect · Ask · Annotate · Keep, with the
  selection and its source. Same cursor timing as `inspect/` (2600ms), toolbar
  in at 2380ms. The corner button replays it.
- **Live.** Select any text on the page and the same toolbar opens under your
  selection (on pointer or key release; it closes when the selection
  collapses). Doing so retires the scripted run. The toolbar is a picture of
  the app's, not a working one.

The wordmark lives in `../wordmark/HondoWordmark.tsx`: `weight` (8) and
`tracking` (1.5) in wordmark units, `outline` for the line version, `boil` for
the jitter (three noise frames stepped at 420ms; still under reduced motion).
