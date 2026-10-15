"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Chip from "./Chip";
import { hero } from "./data";
import styles from "./AboutHero.module.css";

const total = hero.parts.reduce((n, [t]) => n + t.length, 0);

export default function AboutHero() {
  const calm = useReducedMotion();
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(p, [0, 1], [0, 140]);
  const o = useTransform(p, [0, 0.75], [1, 0]);

  // كتابة الجملة حرف حرف بإيقاع شبه بشري
  useEffect(() => {
    if (calm) { setN(total); return; }
    let i = 0, t;
    const tick = () => { setN(++i); if (i < total) t = setTimeout(tick, 45 + Math.random() * 55); };
    t = setTimeout(tick, 650);
    return () => clearTimeout(t);
  }, [calm]);

  let left = n;
  const last = hero.parts.length - 1;
  const text = hero.parts.map(([t, g], k) => {
    const before = left;
    left -= t.length;
    const shown = t.slice(0, Math.max(0, before));
    const caret = (before >= 0 && before < t.length) || (k === last && before >= t.length);
    return (
      <span key={k} className={g ? "gradientText" : undefined}>
        {shown}{caret && <i className={styles.caret} />}<span className={styles.rest}>{t.slice(shown.length)}</span>
      </span>
    );
  });

  return (
    <section ref={ref} className={styles.hero}>
      <div className={styles.orbits} aria-hidden="true"><i className={`${styles.ring} ${styles.r1}`} /><i className={`${styles.ring} ${styles.r2}`} /></div>
      <motion.div className={styles.inner} style={calm ? undefined : { y, opacity: o }}>
        <Chip>Our story</Chip>
        <h1 className={styles.title} aria-label="Why did Growth Station exist?"><span aria-hidden="true">{text}</span></h1>
      </motion.div>
      <span className={styles.cue} aria-hidden="true" />
    </section>
  );
}
