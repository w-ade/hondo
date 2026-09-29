import { GLYPHS, WORDMARK_HEIGHT, WORDMARK_WIDTH } from "./glyphs";
import styles from "./styles.module.css";

/** The stroke the original file draws: 2.03 outside = 4.06 centered. */
const BASE_WEIGHT = 4.056;
/** How far the boil can push a point, in wordmark units. */
const BOIL_SCALE = 2.2;

type Props = {
  /** Stroke width in wordmark units (the file's letters are ~53 tall). 4.06 is the original cut. */
  weight?: number;
  /** Extra space between letters, in wordmark units, on top of what the weight adds. */
  tracking?: number;
  /**
   * Draw the swollen letters as a line of this width (wordmark units) instead
   * of solid. The inside is knocked out in `--wordmark-knockout`, so set that
   * to the background behind it.
   */
  outline?: number;
  /** Redraw the edge a few times a second with a slight wobble, like a hand-drawn line boiling (slower under reduced motion). */
  boil?: boolean;
  className?: string;
};

/**
 * The HONDO wordmark, swollen. Each glyph is filled and stroked in its own
 * color with round joins, which grows it evenly on every side: the outline
 * rounds off and the counters close toward pinholes. Letters are pushed apart
 * by what they grow so the spacing of the original cut holds.
 */
export function HondoWordmark({ weight = 8, tracking = 1.5, outline = 0, boil = false, className }: Props) {
  const shift = weight - BASE_WEIGHT + tracking;
  const pad = weight / 2 + outline + (boil ? BOIL_SCALE : 0);
  const viewBox = [-pad, -pad, WORDMARK_WIDTH + shift * (GLYPHS.length - 1) + pad * 2, WORDMARK_HEIGHT + pad * 2];

  const glyphs = GLYPHS.map((glyph, i) => (
    <path
      key={i}
      d={glyph.d}
      fillRule={glyph.evenOdd ? "evenodd" : "nonzero"}
      transform={i ? `translate(${i * shift} 0)` : undefined}
    />
  ));

  return (
    <svg className={className} viewBox={viewBox.join(" ")} role="img" aria-label="Hondo">
      {boil ? (
        // Three noise fields, one per frame; styles.boil steps through them.
        // Fixed ids, so one boiling wordmark per page.
        <defs>
          {[0, 1, 2].map((frame) => (
            <filter key={frame} id={`hondo-boil-${frame}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="1" seed={frame * 7 + 3} />
              <feDisplacementMap in="SourceGraphic" scale={BOIL_SCALE} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          ))}
        </defs>
      ) : null}
      <g className={boil ? styles.boil : undefined} strokeLinejoin="round">
        {outline ? (
          <g fill="currentColor" stroke="currentColor" strokeWidth={weight + outline * 2}>
            {glyphs}
          </g>
        ) : null}
        <g
          fill={outline ? "var(--wordmark-knockout, #fafaf9)" : "currentColor"}
          stroke={outline ? "var(--wordmark-knockout, #fafaf9)" : "currentColor"}
          strokeWidth={weight}
        >
          {glyphs}
        </g>
      </g>
    </svg>
  );
}
