"use client";
import { useLang } from "./LangScope";
import styles from "./LangToggle.module.css";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className={styles.toggle} role="group" aria-label="Language / اللغة" dir="ltr">
      <button type="button" lang="en" aria-pressed={lang === "en"} className={lang === "en" ? styles.on : ""} onClick={() => setLang("en")}>EN</button>
      <button type="button" lang="ar" aria-pressed={lang === "ar"} className={lang === "ar" ? styles.on : ""} onClick={() => setLang("ar")}>ع</button>
    </div>
  );
}
