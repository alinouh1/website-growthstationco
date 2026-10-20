"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Chip from "./Chip";
import heroImage from "@/assets/images/home/hero1.jpeg";
import styles from "./Hero.module.css";

// الحركات بتبدأ بعد ما شاشة البداية (Intro) تخلص، مش وراها
function useReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.documentElement.classList.contains("ready")) { setReady(true); return; }
    const on = () => setReady(true);
    window.addEventListener("gs-ready", on, { once: true });
    return () => window.removeEventListener("gs-ready", on);
  }, []);
  return ready;
}

const Word = ({ w, i, cls, ready }) => (
  <span className={styles.mask}>
    <motion.span className={cls} style={{ display: "inline-block" }} initial={{ y: "110%" }} animate={{ y: ready ? 0 : "110%" }}
      transition={{ duration: 0.85, delay: 0.1 + i * 0.09, ease: [0.2, 0.8, 0.2, 1] }}>{w}&nbsp;</motion.span>
  </span>
);
const rise = (ready, delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: ready ? 1 : 0, y: ready ? 0 : 20 },
  transition: { delay, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
});

export default function Hero() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const ready = useReady();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(p, [0, 1], [0, 120]);
  const copyO = useTransform(p, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className={styles.hero}>
      <Image src={heroImage} alt="" fill priority placeholder="blur" quality={80} sizes="100vw" className={styles.background} />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.fade} aria-hidden="true" />

      <div className={styles.grid}>
        <motion.div className={styles.copy} style={calm ? undefined : { y: copyY, opacity: copyO }}>
          <motion.div {...rise(ready, 0)}><Chip>Egypt &amp; GCC</Chip></motion.div>

          <h1 className={styles.title}>
            <span className={styles.line}><Word w="We" i={0} ready={ready} /><Word w="Build" i={1} ready={ready} /></span>
            <span className={styles.line}><Word w="Growth." i={2} cls="gradientText" ready={ready} /></span>
          </h1>

          <motion.p className={styles.lead} {...rise(ready, 0.8)}>
            We partner with <b className="gradientText">ambitious businesses</b> across Egypt &amp; the GCC to build powerful brands and drive measurable growth.
          </motion.p>

          <motion.div className={styles.actions} {...rise(ready, 1)}>
            <Link href="/brief" className={styles.primary}><span>Get Started</span><span className={styles.arrow}>↗</span></Link>
            <Link href="/services" className={styles.ghost}>Explore Services<span className={styles.arrow}>→</span></Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
