"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiSearch, FiTarget, FiSettings, FiTrendingUp } from "react-icons/fi";
import Chip from "./Chip";
import { Reveal } from "./motion";
import { steps } from "./data";
import { approachImg } from "./images";
import styles from "./Approach.module.css";

const icons = [FiSearch, FiTarget, FiSettings, FiTrendingUp];
const N = steps.length;
const pad = (n) => String(n).padStart(2, "0");

function Figure() {
  const fig = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: fig, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <motion.figure ref={fig} className={styles.fig} initial={calm ? false : { clipPath: "inset(10% 6% 10% 6% round 40px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
      <motion.div className={styles.parallax} style={calm ? undefined : { y: imgY }}>
        <Image src={approachImg} alt="Strategic planning session" fill placeholder="blur" quality={85} sizes="(max-width:1240px) 100vw, 1240px" />
      </motion.div>
    </motion.figure>
  );
}

// الكارت اللي اتغطى بيصغّر شوية وهو بيتغطى بالكارت اللي بعده
function Step({ s, Icon, i, sp, calm }) {
  const scale = useTransform(sp, [(i + 0.5) / N, 1], [1, 1 - 0.04 * (N - 1 - i)]);
  return (
    <motion.div className={styles.cell} style={{ "--i": i, transformOrigin: "50% 0", ...(calm ? null : { scale }) }}>
      <Reveal className={styles.fill}>
        <div className={styles.step} data-t={i}>
          <b className={styles.n} aria-hidden="true">{pad(i + 1)}</b>
          <span className={styles.ico}><Icon /></span>
          <h3>{s.label}</h3>
          <p>{s.text}</p>
        </div>
      </Reveal>
    </motion.div>
  );
}

export default function Approach() {
  const grid = useRef(null);
  const calm = useReducedMotion();
  const [act, setAct] = useState(0);
  const { scrollYProgress: sp } = useScroll({ target: grid, offset: ["start 22%", "end 75%"] });
  const prog = useTransform(sp, [0.04, 0.96], [0, 1]);
  // state بيتغير بس لما رقم الخطوة يتغير
  useMotionValueEvent(sp, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N + 0.1)));
    setAct((p) => (p === i ? p : i));
  });

  return (
    <section className={styles.wrap}>
      <div className={styles.sec}>
        <div className={styles.layout}>
          <div className={styles.side}>
            <Chip>Our approach</Chip>
            <h2>Our Framework</h2>
            <Link href="/framework" className={styles.more}>Explore Framework →</Link>
            <ol className={styles.steps} aria-hidden="true">
              <i className={styles.prog} style={{ scaleY: calm ? 1 : prog }} />
              {steps.map((s, i) => (
                <li key={s.label} className={i <= act ? styles.on : ""}><small>{pad(i + 1)}</small>{s.label}</li>
              ))}
            </ol>
          </div>
          <div ref={grid} className={styles.grid}>
            {steps.map((s, i) => <Step key={s.label} s={s} Icon={icons[i]} i={i} sp={sp} calm={calm} />)}
          </div>
        </div>
        {approachImg && <Figure />}
      </div>
    </section>
  );
}
