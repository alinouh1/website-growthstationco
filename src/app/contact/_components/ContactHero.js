"use client";
import Image from "next/image";
import bg from "@/assets/images/intro/bg.webp";
import { useLang } from "@/components/LangScope";
import LangToggle from "@/components/LangToggle";
import styles from "../page.module.css";

export default function ContactHero() {
  const { t } = useLang();
  const title = t("c.title");
  return (
    <section className={styles.hero}>
      <Image src={bg} alt="" fill priority sizes="100vw" className={styles.bg} />
      <div className={styles.fade} />
      <span className={`${styles.blob} ${styles.b1}`} />
      <span className={`${styles.blob} ${styles.b2}`} />
      <div className={styles.lang}><LangToggle /></div>
      <div className={styles.heroInner}>
        <span className={styles.eyebrow} data-anim style={{ "--i": 0 }}><i className={styles.dot} /> {t("c.eyebrow")}</span>
        <h1 className={styles.title}>
          {title.map((w, i) => (
            <span key={w} className={styles.word}>
              <span data-anim style={{ "--i": i + 1 }} className={i === title.length - 1 ? "gradientText" : ""}>{w}</span>
            </span>
          ))}
        </h1>
        <p className={styles.lead} data-anim style={{ "--i": 4 }}>{t("c.lead")}</p>
      </div>
    </section>
  );
}
