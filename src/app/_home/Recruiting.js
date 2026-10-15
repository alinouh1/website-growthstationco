import Link from "next/link";
import Chip from "./Chip";
import { Reveal } from "./motion";
import { roles } from "./data";
import styles from "./Recruiting.module.css";

const rows = [roles.slice(0, 9), roles.slice(9)];

export default function Recruiting() {
  return (
    <section className={styles.wrap}>
      <Reveal className={styles.inner}>
        <Chip>Now recruiting</Chip>
        <h2>We are building a team <span className="gradientText">that moves fast.</span></h2>
        <p>We are not looking for employees. We are looking for builders, creators, and operators who want to grow with us across Egypt and the GCC.</p>
        <Link href="/careers" className={styles.btn}>Join Growth Station →</Link>
      </Reveal>
      <div className={styles.pills} aria-hidden="true">
        {rows.map((r, i) => (
          <div key={i} className={styles.lane}>
            <div className={`${styles.track} ${i ? styles.rev : ""}`}>
              {[...r, ...r, ...r, ...r].map((t, j) => <span key={j}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
