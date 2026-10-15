import Image from "next/image";
import Reveal from "@/components/Reveal";
import { CONTACT } from "@/lib/constants";
import bg from "@/assets/images/intro/bg.webp";
import ContactForm from "./_components/ContactForm";
import Reach from "./_components/Reach";
import Marquee from "./_components/Marquee";
import styles from "./page.module.css";

export const metadata = {
  title: "Contact",
  description: "Talk to Growth Station. Tell us about your project and our team will get back to you within 24 hours.",
};

const TITLE = ["Talk", "to", "us."];

export default function Contact() {
  return (
    <>
      <section className={styles.hero}>
        <Image src={bg} alt="" fill priority sizes="100vw" className={styles.bg} />
        <div className={styles.fade} />
        <span className={`${styles.blob} ${styles.b1}`} />
        <span className={`${styles.blob} ${styles.b2}`} />
        <div className={styles.heroInner}>
          <span className={styles.eyebrow} data-anim style={{ "--i": 0 }}><i className={styles.dot} /> Contact</span>
          <h1 className={styles.title}>
            {TITLE.map((w, i) => (
              <span key={w} className={styles.word}>
                <span data-anim style={{ "--i": i + 1 }} className={w === "us." ? "gradientText" : ""}>{w}</span>
              </span>
            ))}
          </h1>
          <p className={styles.lead} data-anim style={{ "--i": 4 }}>Do you have a project? Let&apos;s discuss how we can help you bring your ideas to life.</p>
        </div>
      </section>

      <Marquee />

      {/* بانر متدرج بالبيانات + فورم أبيض رسمي بيطلع فوقه */}
      <section className={styles.compose} id="form">
        <div className={styles.composeIn}>
          <Reveal><Reach /></Reveal>
          <Reveal delay={0.12}><ContactForm /></Reveal>
        </div>
      </section>

      <section className={styles.visit}>
        <Reveal>
          <div className={styles.frame}>
            <iframe src={CONTACT.mapEmbed} title="Growth Station location on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            <div className={styles.card}>
              <h2>Visit us</h2>
              {CONTACT.address.map((l) => <p key={l}>{l}</p>)}
              <a href={CONTACT.mapLink} target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
