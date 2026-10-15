import { FiTarget, FiBarChart2, FiGlobe, FiLayers } from "react-icons/fi";
import { Reveal, ScrollWords } from "./motion";
import { why } from "./data";
import styles from "./Why.module.css";

const icons = [FiTarget, FiBarChart2, FiGlobe, FiLayers];
const tones = ["forest", "white", "amber", "forest"];
const tilt = [-2.5, 2, -2, 2.5];

export default function Why() {
  return (
    <section className={styles.wrap}>
      <div className={styles.sec}>
        <ScrollWords className={styles.title} rowClass={styles.row}
          parts={[["Most agencies deliver work…", false], ["We deliver growth.", true]]} />
        <p className={styles.lead}>Why Growth Station?</p>
        <div className={styles.grid}>
          {why.map((w, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={w.title} className={`${styles.card} ${styles[tones[i]]}`} delay={i * 0.08} rotate={tilt[i]}>
                <span className={styles.ico}><Icon /></span>
                <div><h3>{w.title}</h3><p>{w.text}</p></div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
