"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { chapters } from "./data";
import { aboutImages } from "./images";
import styles from "./Story.module.css";

// السطر بيسخن لما يعدّي في منتصف الشاشة (IntersectionObserver، من غير scroll listener)
function Line({ text, em }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const live = useInView(ref, { margin: "-40% 0px -40% 0px" });
  return <p ref={ref} className={`${styles.line} ${em ? styles.em : ""} ${live || calm ? styles.on : ""}`}>{text}</p>;
}

function Chapter({ c }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(p, [0, 1], [1.2, 1]);
  const y = useTransform(p, [0, 1], ["-4%", "4%"]);
  const rail = useTransform(p, [0.2, 0.8], [0, 1]);

  return (
    <article ref={ref} className={`${styles.chapter} ${c.flip ? styles.flip : ""}`}>
      <div className={styles.imgCol}>
        <motion.div className={styles.media}
          initial={calm ? false : { clipPath: "inset(12% 8% 12% 8% round 44px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
          viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
          <motion.div className={styles.zoom} style={calm ? undefined : { scale, y }}>
            <Image src={aboutImages[c.id]} alt={c.alt} fill placeholder="blur" quality={85} sizes="(max-width: 900px) 100vw, 50vw" />
          </motion.div>
          <div className={styles.shade} />
        </motion.div>
      </div>

      <div className={`${styles.panel} ${styles[c.tone]}`}>
        {!calm && <motion.i className={styles.rail} style={{ scaleY: rail }} />}
        <div className={styles.inner}>
          {c.title && <h2 className={styles.title}>{c.title}</h2>}
          {c.lines.map((t, i) => <Line key={i} text={t} em={i === c.em} />)}
          {c.cta && (
            <>
              <p className={styles.stop}>{c.cta.text}</p>
              <Link href="/brief" className={styles.btn}>{c.cta.label} →</Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Story() {
  return (
    <section className={styles.wrap} aria-label="Our story">
      {chapters.map((c) => <Chapter key={c.id} c={c} />)}
    </section>
  );
}
