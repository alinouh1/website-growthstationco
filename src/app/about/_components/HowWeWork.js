import { FiEye, FiShield, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import Chip from "./Chip";
import { Reveal, Rule } from "./motion";
import { how } from "./data";
import styles from "./HowWeWork.module.css";

const icons = [FiEye, FiShield, FiTrendingUp, FiCheckCircle];

export default function HowWeWork() {
  return (
    <section className={styles.wrap}>
      <div className={styles.sec}>
        <div className={styles.side}>
          <Chip>How we work</Chip>
          <h2>We lead with clarity, not complexity.</h2>
          <p>Every engagement starts with understanding your goals — not our portfolio. We build systems that scale, teams that align, and strategies that hold up under pressure.</p>
        </div>
        <div>
          {how.map((h, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={h.title} className={styles.item} y={30}>
                <Rule className={styles.rule} />
                <span className={styles.ico}><Icon /></span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
