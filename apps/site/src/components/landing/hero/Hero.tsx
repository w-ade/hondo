import styles from "./styles.module.css";
import { HeroCopy } from "./HeroCopy";
import { HeroWorkspace, type RenderMode } from "./HeroWorkspace";

interface Props {
  /** See HeroWorkspace. "figma" today, "live" once DocumentView is real. */
  mode?: RenderMode;
}

/**
 * The landing hero: copy, then the product.
 *
 * This file is deliberately thin. It composes and positions; it holds no
 * workspace state and knows nothing about rendering modes beyond passing the
 * prop through. Replacing the workspace internals never requires touching it.
 */
export function Hero({ mode = "figma" }: Props) {
  return (
    <section className={styles.hero}>
      <HeroCopy />
      <div className={styles.stage}>
        <HeroWorkspace mode={mode} />
      </div>
    </section>
  );
}
