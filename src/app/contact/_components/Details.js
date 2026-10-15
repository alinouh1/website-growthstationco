import { FaEnvelope, FaPhone, FaClock, FaLocationDot, FaFacebookF, FaInstagram, FaTiktok, FaSnapchat, FaBehance, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { CONTACT, SOCIALS } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import styles from "./Details.module.css";

const ICONS = { Facebook: FaFacebookF, Instagram: FaInstagram, TikTok: FaTiktok, Snapchat: FaSnapchat, Behance: FaBehance, LinkedIn: FaLinkedinIn, WhatsApp: FaWhatsapp };

function Item({ icon, label, delay, children }) {
  return (
    <Reveal delay={delay}>
      <div className={styles.item}>
        <span className={styles.label}>{icon}{label}</span>
        {children}
      </div>
    </Reveal>
  );
}

export default function Details() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <Item icon={<FaEnvelope />} label="Email" delay={0}>
          <a className={styles.value} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </Item>
        <Item icon={<FaPhone />} label="Phone" delay={0.08}>
          <a className={styles.value} href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a>
        </Item>
        <Item icon={<FaClock />} label="Working hours" delay={0.16}>
          <p className={styles.text}>{CONTACT.hours}</p>
        </Item>
        <Item icon={<FaLocationDot />} label="Location" delay={0.24}>
          {CONTACT.address.map((l) => <p key={l} className={styles.text}>{l}</p>)}
        </Item>
      </div>

      <Reveal delay={0.1}>
        <div className={styles.social}>
          <span className={styles.follow}>Follow us</span>
          <div className={styles.icons}>
            {SOCIALS.map((s) => {
              const Icon = ICONS[s.name];
              return <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className={styles.s}><Icon /></a>;
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
