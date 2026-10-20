import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchat, FaBehance, FaLinkedinIn, FaWhatsapp, FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6";
import { CONTACT, SOCIALS } from "@/lib/constants";
import logo from "@/assets/images/logo/logo-white.svg";
import styles from "./Footer.module.css";

const ICONS = { Facebook: FaFacebookF, Instagram: FaInstagram, TikTok: FaTiktok, Snapchat: FaSnapchat, Behance: FaBehance, LinkedIn: FaLinkedinIn, WhatsApp: FaWhatsapp };

const PAGES = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Careers", "/careers"],
  ["Brief", "/brief"],
  ["Framework", "/framework"],
  ["Contact", "/contact"],
];

// كلهم بيودّوا لصفحة الخدمات (غيّر الروابط لو عندك صفحات منفصلة)
const SERVICES = ["Performance Marketing", "Brand Strategy", "Web Development", "UI/UX Design", "AI Solutions"];

const LEGAL_HREF = "https://growthstationco.com/#";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" aria-label="Growth Station home">
              <Image src={logo} alt="Growth Station" className={styles.logo} />
            </Link>
            <p>We partner with ambitious businesses across Egypt &amp; the GCC to build powerful brands and drive measurable growth.</p>
          </div>

          <nav className={styles.col} aria-label="Footer navigation">
            <h2>Navigation</h2>
            <ul>
              {PAGES.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
            </ul>
          </nav>


          <div className={`${styles.col} ${styles.touch}`}>
            <h2>Get in touch</h2>
            <ul>
              <li><a href={CONTACT.mapLink} target="_blank" rel="noopener noreferrer"><FaLocationDot aria-hidden="true" />Cairo, Egypt</a></li>
              <li><a href={`tel:${CONTACT.phoneHref}`}><FaPhone aria-hidden="true" />{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}><FaEnvelope aria-hidden="true" />{CONTACT.email}</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.social}>
          {SOCIALS.map((s) => {
            const Icon = ICONS[s.name];
            return Icon ? (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}><Icon /></a>
            ) : null;
          })}
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Growth Station. All Rights Reserved.</p>
          <div className={styles.legal}>
            <a href={LEGAL_HREF}>Privacy Policy</a>
            <a href={LEGAL_HREF}>Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}