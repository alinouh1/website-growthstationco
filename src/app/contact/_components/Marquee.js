"use client";
import { useLang } from "@/components/LangScope";
import styles from "./Marquee.module.css";

function Group({ hidden, phrases }) {
  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {[0, 1, 2].flatMap((n) => phrases.map((p) => (
        <span key={`${n}-${p}`} className={styles.item}>{p}<i>✦</i></span>
      )))}
    </div>
  );
}

// شريط متحرك بشعار الشركة (CSS بس)
export default function Marquee() {
  const { t } = useLang();
  const phrases = t("c.marquee");
  return (
    <div className={styles.wrap} role="presentation">
      <div className={styles.band}>
        <div className={styles.track}><Group phrases={phrases} /><Group hidden phrases={phrases} /></div>
      </div>
    </div>
  );
}
