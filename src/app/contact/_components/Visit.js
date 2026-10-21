"use client";
import Reveal from "@/components/Reveal";
import { CONTACT } from "@/lib/constants";
import { useLang } from "@/components/LangScope";
import styles from "../page.module.css";

export default function Visit() {
  const { lang, t } = useLang();
  const address = lang === "ar" ? t("r.address") : CONTACT.address;
  return (
    <section className={styles.visit}>
      <Reveal>
        <div className={styles.frame}>
          <iframe src={CONTACT.mapEmbed} title={t("v.iframe")} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <div className={styles.card}>
            <h2>{t("v.title")}</h2>
            {address.map((l) => <p key={l}>{l}</p>)}
            <a href={CONTACT.mapLink} target="_blank" rel="noopener noreferrer">{t("r.map")}</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
