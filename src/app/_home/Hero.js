"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Chip from "./Chip";
import { HERO } from "./paths";
import styles from "./Hero.module.css";

const Word = ({ w, i, cls }) => (
  <span className={styles.mask}>
    <motion.span className={cls} style={{ display: "inline-block" }} initial={{ y: "110%" }} animate={{ y: 0 }}
      transition={{ duration: 0.85, delay: 0.1 + i * 0.09, ease: [0.2, 0.8, 0.2, 1] }}>{w}&nbsp;</motion.span>
  </span>
);
const draw = (delay) => ({ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 2.2, delay, ease: [0.65, 0, 0.35, 1] } });
const PIN_DELAY = [0.8, 1.3, 1.8, 2.3];

export default function Hero() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(p, [0, 1], [0, 120]);
  const copyO = useTransform(p, [0, 0.7], [1, 0]);
  const sceneY = useTransform(p, [0, 1], [0, -70]);
  const [dx, dy] = HERO.dest;

  return (
   <section ref={ref} className={styles.hero}>
  {/* Background Image */}
  <div className={styles.background} aria-hidden="true" />

  {/* Dark Overlay */}
  <div className={styles.overlay} aria-hidden="true" />

  {/* Content */}
  <div className={styles.grid}>
    <motion.div
      className={styles.copy}
      style={calm ? undefined : { y: copyY, opacity: copyO }}
    >
      <Chip>Egypt &amp; GCC</Chip>

      <h1 className={styles.title}>
        <span className={styles.line}>
          <Word w="We" i={0} />
          <Word w="Build" i={1} />
        </span>

        <span className={styles.line}>
          <Word w="Growth." i={2} cls="gradientText" />
        </span>
      </h1>

      <motion.p
        className={styles.lead}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
      >
        We partner with{" "}
        <b className="gradientText">ambitious businesses</b>{" "}
        across Egypt &amp; the GCC to build powerful brands
        and drive measurable growth.
      </motion.p>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
      >
        <Link href="/brief" className={styles.primary}>
          <span>Get Started</span>
          <span className={styles.arrow}>↗</span>
        </Link>

        <Link href="/service" className={styles.ghost}>
          Explore Services
          <span className={styles.arrow}>→</span>
        </Link>
      </motion.div>
    </motion.div>

    {/* Keep your existing scene here if you still need it */}
  </div>
</section>
  );
}
