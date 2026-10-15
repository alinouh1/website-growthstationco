import { POSITIONS } from "./jobs";
import styles from "./RolesMarquee.module.css";

function Row({ items, reverse }) {
  const group = (hidden) => (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {items.map((p, i) => <span key={p} className={`${styles.pill} ${i % 4 === 1 ? styles.fill : ""}`}>{p}</span>)}
    </div>
  );
  return <div className={`${styles.row} ${reverse ? styles.rev : ""}`}>{group(false)}{group(true)}</div>;
}

// شريط الوظايف المتحرك (CSS بس) — ديكور
export default function RolesMarquee() {
  const a = POSITIONS.slice(0, 9);
  const b = POSITIONS.slice(9);
  return (
    <div className={styles.wrap} role="presentation" data-anim style={{ "--i": 6 }}>
      <Row items={a} />
      <Row items={b} reverse />
    </div>
  );
}
