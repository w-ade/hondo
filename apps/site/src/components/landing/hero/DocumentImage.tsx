"use client";

import Image from "next/image";
import styles from "./styles.module.css";

interface Props {
  src: string;
  /** Alt text describes the product state, not the file. */
  alt: string;
  priority?: boolean;
  /** Intrinsic size of this export. Defaults to the desktop crop. */
  width?: number;
  height?: number;
}

/**
 * Development-mode document body: an exported Figma screen.
 *
 * Intrinsic size is the export's own (2398×2669); the pane scales it to its
 * width and scrolls the overflow, so the crop always reads as a real document
 * continuing past the fold rather than a letterboxed picture.
 *
 * Swap this for <DocumentView /> when the live editor lands. The surrounding
 * layout, animation and interaction stay identical either way.
 */
export function DocumentImage({
  src,
  alt,
  priority = false,
  width = 2398,
  height = 2669,
}: Props) {
  return (
    <Image
      className={styles.docImage}
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 767px) 108vw, (max-width: 1199px) 52vw, 42vw"
    />
  );
}
