import styles from "./Marquee.module.css";

const PHRASES = ["Strategy Before Execution", "Growth Beyond Borders"];

function Group({ hidden }) {
  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {[0, 1, 2].flatMap((n) => PHRASES.map((p) => (
        <span key={`${n}-${p}`} className={styles.item}>{p}<i>✦</i></span>
      )))}
    </div>
  );
}

// شريط متحرك بشعار الشركة (CSS بس، بدون JS)
export default function Marquee() {
  return (
    <div className={styles.wrap} role="presentation">
      <div className={styles.band}>
        <div className={styles.track}><Group /><Group hidden /></div>
      </div>
    </div>
  );
}
