import Link from "next/link";
import styles from "./ServiceCTA.module.css";

export default function ServiceCTA() {
  return (
    <section className={styles.cta}>
      {/* 4 نسخ متطابقة + translateX(-50%) = حركة مالهاش نهاية ومن غير قفزة */}
      <div className={styles.ghost} aria-hidden="true">
        <div className={styles.track}>
          {[0, 1, 2, 3].map((i) => <span key={i}>GROWTH</span>)}
        </div>
      </div>
      <h2>Ready to build something <span className="gradientText">remarkable?</span></h2>
      <p>Let's create something premium, scalable and unforgettable. No fluff, just clarity and results.</p>
      <Link href="/brief" className={styles.btn}>Book appointment →</Link>
    </section>
  );
}