import { allItems } from "./data";
import styles from "./Ribbon.module.css";

export default function Ribbon() {
  const row = [...allItems, ...allItems];
  return (
    <div className={styles.ribbon} aria-hidden="true">
      <div className={styles.track}>
        {row.map((s, i) => <span key={i}>{s.title}<em>✦</em></span>)}
      </div>
    </div>
  );
}
