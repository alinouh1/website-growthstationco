"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { serviceImages } from "./images";
import styles from "./ServiceHero.module.css";

const line1 = "Everything your brand needs.".split(" ");
const line2 = "Nothing it doesn't.".split(" ");
const Word = ({ w, i, cls }) => (
  <span className={styles.mask}>
    <motion.span className={cls} style={{ display: "inline-block" }} initial={{ y: "110%" }} animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}>{w}&nbsp;</motion.span>
  </span>
);
const cards = [
  { img: "strategy", rot: -7, cls: "c1", d: 0 },
  { img: "web", rot: 5, cls: "c2", d: 0.6 },
  { img: "media", rot: -3, cls: "c3", d: 1.2 },
];

export default function ServiceHero() {
  return (
    <section className={styles.wrap}>
      <div className={styles.hero}>
      <div className={styles.copy}>
        <span className={styles.chip}><i /> What we do</span>
        <h1 className={styles.title}>
          <span className={styles.line}>{line1.map((w, i) => <Word key={i} w={w} i={i} />)}</span>
          <span className={styles.line}>{line2.map((w, i) => <Word key={i} w={w} i={i + 4} cls="gradientText" />)}</span>
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className={styles.lead}>
          We craft digital products, scalable systems and premium experiences that move ambitious businesses forward.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className={styles.actions}>
          <a href="#services" className={styles.primary}>Explore services ↓</a>
          <Link href="/brief" className={styles.ghost}>Book a session</Link>
        </motion.div>
      </div>
      <div className={styles.stack} aria-hidden="true">
        {cards.map((c, i) => (
          <motion.div key={c.img} className={`${styles.card} ${styles[c.cls]}`}
            initial={{ opacity: 0, y: 80, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: c.rot }}
            transition={{ delay: 0.5 + i * 0.15, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>
            <motion.div className={styles.float} animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, delay: c.d, ease: "easeInOut" }}>
              <Image src={serviceImages[c.img]} alt="" fill placeholder="blur" quality={80} sizes="300px" />
            </motion.div>
          </motion.div>
        ))}
        <div className={styles.stat}><b>+340%</b><span>Growth delivered</span></div>
      </div>
      </div>
    </section>
  );
}
