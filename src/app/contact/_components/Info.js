import { FaEnvelope, FaPhone, FaClock, FaLocationDot, FaFacebookF, FaInstagram, FaTiktok, FaSnapchat, FaBehance, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { CONTACT, SOCIALS } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import SpotlightCard from "./SpotlightCard";
import styles from "./Info.module.css";

const ICONS = { Facebook: FaFacebookF, Instagram: FaInstagram, TikTok: FaTiktok, Snapchat: FaSnapchat, Behance: FaBehance, LinkedIn: FaLinkedinIn, WhatsApp: FaWhatsapp };

function Row({ icon, label, children, delay }) {
  return (
    <Reveal delay={delay}>
      <SpotlightCard>
        <div className={styles.row}>
          <span className={styles.icon}>{icon}</span>
          <div>
            <h3 className={styles.label}>{label}</h3>
            {children}
          </div>
        </div>
      </SpotlightCard>
    </Reveal>
  );
}

export default function Info() {
  return (
    <div className={styles.list}>
      <Row icon={<FaEnvelope />} label="Email" delay={0}>
        <a className={styles.value} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </Row>
      <Row icon={<FaPhone />} label="Phone" delay={0.08}>
        <a className={styles.value} href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a>
      </Row>
      <Row icon={<FaClock />} label="Working hours" delay={0.16}>
        <p className={styles.text}>{CONTACT.hours}</p>
      </Row>
      <Row icon={<FaLocationDot />} label="Location" delay={0.24}>
        {CONTACT.address.map((l) => <p key={l} className={styles.text}>{l}</p>)}
        <a className={styles.map} href={CONTACT.mapLink} target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
      </Row>
      <Reveal delay={0.32}>
        <SpotlightCard>
          <div className={styles.social}>
            <h3 className={styles.label}>Follow us</h3>
            <div className={styles.icons}>
              {SOCIALS.map((s) => {
                const Icon = ICONS[s.name];
                return (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className={styles.s}>
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </SpotlightCard>
      </Reveal>
    </div>
  );
}
