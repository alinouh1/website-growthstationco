import Link from "next/link";
import Reveal from "@/components/Reveal";
import StepsStage from "./_components/StepsStage";
import Thinking from "./_components/Thinking";
import { STEPS } from "./_components/data";
import styles from "./page.module.css";

export const metadata = {
  title: "Framework",
  description: "We do not build random campaigns. Every move is connected to a system designed for long-term growth: Discover, Position, Build, Scale.",
};

const LINES = [["Strategy", "before"], ["Execution"]];

export default function Framework() {
  let k = 0;
  return (
    <>
      <section className={styles.hero}>
        <span className={`${styles.ring} ${styles.r1}`} />
        <span className={`${styles.ring} ${styles.r2}`} />
        <span className={`${styles.blob} ${styles.b1}`} />
        <span className={`${styles.blob} ${styles.b2}`} />
        <div className={styles.inner}>
          <span className={styles.eyebrow} data-anim style={{ "--i": 0 }}><i className={styles.dot} /> Our framework</span>
          <h1 className={styles.title}>
            {LINES.map((line, li) => (
              <span key={li} className={`${styles.line} ${li === 1 ? styles.big : ""}`}>
                {line.map((w) => {
                  const i = ++k;
                  return (
                    <span key={w} className={styles.word}>
                      <span data-anim style={{ "--i": i }} className={li === 1 ? "gradientText" : ""}>{w}</span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>
          <p className={styles.lead} data-anim style={{ "--i": 4 }}>We do not build random campaigns. Every move is connected to a system designed for long-term growth.</p>
          <ol className={styles.road}>
            {STEPS.map((s, i) => (
              <li key={s.n} data-anim style={{ "--i": i }}>
                <Link href="#steps"><span>{s.n}</span>{s.title}</Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <StepsStage steps={STEPS} />
      <Thinking />

      <section className={styles.ctaWrap}>
        <Reveal duration={1.1}>
          <div className={styles.cta}>
            <h2>Ready to build a system that grows?</h2>
            <p>Tell us about your business and we will show you where the framework starts.</p>
            <div className={styles.btns}>
              <Link href="/brief" className={styles.primary}>Start a brief</Link>
              <Link href="/contact" className={styles.ghost}>Talk to us</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
