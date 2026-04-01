// src/app/page.js
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.logo}>
          Job<span className={styles.logoAccent}>Core</span>
        </h1>
        <p className={styles.tagline}>Your crew's job tracker.</p>
        <div className={styles.divider} />
        <div className={styles.ctas}>
          <Link href="/login" className={styles.primaryBtn}>
            Sign In
          </Link>
          <Link href="/register" className={styles.secondaryBtn}>
            Sign Up
          </Link>
        </div>
      </div>
      <footer className={styles.footer}>Chavez Concrete</footer>
    </div>
  );
}
