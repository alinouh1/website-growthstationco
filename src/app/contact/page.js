import Reveal from "@/components/Reveal";
import LangScope from "@/components/LangScope";
import ContactHero from "./_components/ContactHero";
import ContactForm from "./_components/ContactForm";
import Reach from "./_components/Reach";
import Marquee from "./_components/Marquee";
import Visit from "./_components/Visit";
import { DICT } from "./_components/dict";
import styles from "./page.module.css";

export const metadata = {
  title: "Contact Us",
  description: "Talk to Growth Station. Tell us about your project and our team will contact you soon.",
};

export default function Contact() {
  return (
    <LangScope dict={DICT}>
      <ContactHero />
      <Marquee />

      {/* بانر متدرج بالبيانات + فورم أبيض رسمي بيطلع فوقه */}
      <section className={styles.compose} id="form">
        <div className={styles.composeIn}>
          <Reveal><Reach /></Reveal>
          <Reveal delay={0.12}><ContactForm /></Reveal>
        </div>
      </section>

      <Visit />
    </LangScope>
  );
}
