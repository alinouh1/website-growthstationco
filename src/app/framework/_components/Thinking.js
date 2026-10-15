import Reveal from "@/components/Reveal";
import { THINKING } from "./data";
import styles from "./Thinking.module.css";

export default function Thinking() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <Reveal duration={1.2}>
          <span className={styles.eyebrow}>The thinking behind the work</span>
          <h2 className={styles.h2}>What separates us is not what we do — it is <span className="gradientText">how we think</span> before we do anything</h2>
        </Reveal>
      </div>
      <div className={styles.stack}>
        {THINKING.map((t, i) => (
          <article key={t.n} className={`${styles.card} ${styles[`c${i}`]}`} style={{ "--i": i }}>
            <span className={styles.n} aria-hidden="true">{t.n}</span>
            <div>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
