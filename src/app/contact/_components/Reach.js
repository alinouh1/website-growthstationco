"use client";
import { FaEnvelope, FaPhone, FaClock, FaLocationDot, FaFacebookF, FaInstagram, FaTiktok, FaSnapchat, FaBehance, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { CONTACT, SOCIALS } from "@/lib/constants";
import { useLang } from "@/components/LangScope";
import styles from "./Reach.module.css";

const ICONS = { Facebook: FaFacebookF, Instagram: FaInstagram, TikTok: FaTiktok, Snapchat: FaSnapchat, Behance: FaBehance, LinkedIn: FaLinkedinIn, WhatsApp: FaWhatsapp };

// بانر متدرج فوق الفورم: بيانات التواصل في صف واحد بدل كروت منفصلة
export default function Reach() {
  const { lang, t } = useLang();
  const hours = lang === "ar" ? t("r.hoursVal") : CONTACT.hours;
  const address = lang === "ar" ? t("r.address") : CONTACT.address;
  return (
    <div className={styles.banner}>
      <div className={styles.top}>
        <div>
          <span className={styles.kicker}>{t("r.kicker")}</span>
          <h2>{t("r.title")}</h2>
        </div>
        <p>{t("r.text")}</p>
      </div>

      <ul className={styles.grid}>
        <li>
          <span className={styles.ic}><FaEnvelope /></span>
          <div><h3>{t("r.email")}</h3><a href={`mailto:${CONTACT.email}`} dir="ltr">{CONTACT.email}</a></div>
        </li>
        <li>
          <span className={styles.ic}><FaPhone /></span>
          <div><h3>{t("r.phone")}</h3><a href={`tel:${CONTACT.phoneHref}`} dir="ltr">{CONTACT.phone}</a></div>
        </li>
        <li>
          <span className={styles.ic}><FaClock /></span>
          <div><h3>{t("r.hours")}</h3><p>{hours}</p></div>
        </li>
        <li>
          <span className={styles.ic}><FaLocationDot /></span>
          <div>
            <h3>{t("r.location")}</h3>
            {address.map((l) => <p key={l}>{l}</p>)}
            <a className={styles.map} href={CONTACT.mapLink} target="_blank" rel="noopener noreferrer">{t("r.map")}</a>
          </div>
        </li>
      </ul>

      <div className={styles.social}>
        <span>{t("r.follow")}</span>
        <div className={styles.icons}>
          {SOCIALS.map((s) => {
            const Icon = ICONS[s.name];
            return <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}><Icon /></a>;
          })}
        </div>
      </div>
    </div>
  );
}
