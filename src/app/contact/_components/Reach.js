import { FaEnvelope, FaPhone, FaClock, FaLocationDot, FaFacebookF, FaInstagram, FaTiktok, FaSnapchat, FaBehance, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { CONTACT, SOCIALS } from "@/lib/constants";
import styles from "./Reach.module.css";

const ICONS = { Facebook: FaFacebookF, Instagram: FaInstagram, TikTok: FaTiktok, Snapchat: FaSnapchat, Behance: FaBehance, LinkedIn: FaLinkedinIn, WhatsApp: FaWhatsapp };

// بانر متدرج فوق الفورم: بيانات التواصل في صف واحد بدل كروت منفصلة
export default function Reach() {
  return (
    <div className={styles.banner}>
      <div className={styles.top}>
        <div>
          <span className={styles.kicker}>Contact information</span>
          <h2>We would love to hear from you</h2>
        </div>
        <p>Whether you are planning a campaign, a website or a full growth strategy, our team is ready to help.</p>
      </div>

      <ul className={styles.grid}>
        <li>
          <span className={styles.ic}><FaEnvelope /></span>
          <div><h3>Email</h3><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
        </li>
        <li>
          <span className={styles.ic}><FaPhone /></span>
          <div><h3>Phone</h3><a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a></div>
        </li>
        <li>
          <span className={styles.ic}><FaClock /></span>
          <div><h3>Working hours</h3><p>{CONTACT.hours}</p></div>
        </li>
        <li>
          <span className={styles.ic}><FaLocationDot /></span>
          <div>
            <h3>Location</h3>
            {CONTACT.address.map((l) => <p key={l}>{l}</p>)}
            <a className={styles.map} href={CONTACT.mapLink} target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
          </div>
        </li>
      </ul>

      <div className={styles.social}>
        <span>Follow us</span>
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
