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
      <div className={styles.grid}>
        <motion.div className={styles.copy} style={calm ? undefined : { y: copyY, opacity: copyO }}>
          <Chip>Egypt &amp; GCC</Chip>
          <h1 className={styles.title}>
            <span className={styles.line}><Word w="We" i={0} /><Word w="Build" i={1} /></span>
            <span className={styles.line}><Word w="Growth." i={2} cls="gradientText" /></span>
          </h1>
          <motion.p className={styles.lead} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            We partner with <b className="gradientText">ambitious businesses</b> across Egypt &amp; the GCC to build powerful brands and drive measurable growth.
          </motion.p>
          <motion.div className={styles.actions} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <Link href="/brief" className={styles.primary}>Get Started</Link>
            <Link href="/service" className={styles.ghost}>Explore Services</Link>
          </motion.div>
        </motion.div>

        <motion.div className={styles.scene} style={calm ? undefined : { y: sceneY }} aria-hidden="true">
          <svg viewBox="0 0 560 640" className={styles.svg}>
            <motion.path d={HERO.d} className={styles.shadow} {...draw(0.3)} />
            <motion.path d={HERO.d} className={styles.edge} {...draw(0.3)} />
            <motion.path d={HERO.d} className={styles.road} {...draw(0.3)} />
            <motion.path d={HERO.d} className={styles.dash} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.8 }} />
          </svg>
          {HERO.pins.map(([x, y], i) => (
            <div key={i} className={styles.pinPos} style={{ left: `${x / 5.6}%`, top: `${y / 6.4}%` }}>
              <motion.div className={styles.pin} initial={{ opacity: 0, y: -46, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: PIN_DELAY[i] }}>
                <svg viewBox="0 0 36 46"><path d="M18 45C18 45 3 29 3 17a15 15 0 0 1 30 0c0 12-15 28-15 28Z" fill="#f2b84b" stroke="rgba(255,255,255,.4)" /><circle cx="18" cy="17" r="6" fill="#0a3206" /><circle cx="18" cy="17" r="2.6" fill="#f2b84b" /></svg>
              </motion.div>
              <i className={styles.pulse} style={{ animationDelay: `${PIN_DELAY[i] + 0.4}s` }} />
            </div>
          ))}
          <motion.div className={styles.dest} style={{ left: `${dx / 5.6}%`, top: `${dy / 6.4}%` }} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.4, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}>
            <i className={styles.d1} /><i className={styles.d2} /><i className={styles.core} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
