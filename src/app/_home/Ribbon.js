import styles from "./Ribbon.module.css";

const phrases = ["Strategy Before Execution", "Growth Beyond Borders"];
const items = Array.from({ length: 8 }, (_, i) => phrases[i % 2]);

function Row({ rev, outline }) {
  return (
    <div className={`${styles.row} ${outline ? styles.outline : ""}`}>
      <div className={`${styles.track} ${rev ? styles.rev : ""}`}>
        {[...items, ...items].map((t, i) => <span key={i}>{t}<em>✦</em></span>)}
      </div>
    </div>
  );
}

export default function Ribbon() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.tilt}><Row /><Row rev outline /></div>
    </div>
  );
}
