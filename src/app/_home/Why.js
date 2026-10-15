import { ScrollWords } from "./motion";
import WhyCards from "./WhyCards";
import styles from "./Why.module.css";

export default function Why() {
  return (
    <section className={styles.wrap}>
      <div className={styles.sec}>
        <p className={styles.kicker}>Why brands choose Growth Station</p>
        <ScrollWords className={styles.title} rowClass={styles.row} parts={[["Most agencies deliver work.", false], ["We deliver growth.", true]]} />
        <WhyCards />
      </div>
    </section>
  );
}
