"use client";

import Link from "next/link";
import styles from "./styles.module.css";

/**
 * Site navigation. The wordmark alone — the first viewport belongs to the
 * headline and the product.
 */
export function SiteNav() {
  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.wordmark}>
        Hondo
      </Link>
    </header>
  );
}
