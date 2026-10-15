"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { groups } from "./data";
import { serviceImages } from "./images";
import styles from "./ServiceShowcase.module.css";

export default function ServiceShowcase() {
  const [g, setG] = useState(0);
  const [a, setA] = useState(0);
  const group = groups[g];
  const item = group.items[a];

  const mx = useMotionValue(0), my = useMotionValue(0);
  const spring = { stiffness: 140, damping: 16 };
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), spring);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), spring);
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => { mx.set(0); my.set(0); };

  return (
    <section id="services" className={styles.wrap}>
      <div className={styles.section}>
      <div className={styles.head}>
        <h2>Built to move your business forward.</h2>
        <div className={styles.tabs} role="tablist">
          {groups.map((x, i) => (
            <button key={x.id} role="tab" aria-selected={g === i} className={styles.tab}
              onClick={() => { setG(i); setA(0); }}>
              {g === i && <motion.span layoutId="pill" className={styles.pill} />}
              <span>{x.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        <ul className={styles.list}>
          {group.items.map((s, i) => (
            <li key={s.title}>
              <button className={`${styles.row} ${a === i ? styles.on : ""}`} onMouseEnter={() => setA(i)} onFocus={() => setA(i)} onClick={() => setA(i)}>
                <span className={styles.name}>{s.title}</span>
                <span className={styles.arrow}>→</span>
              </button>
              <AnimatePresence initial={false}>
                {a === i && (
                  <motion.div className={styles.more} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}>
                    <p>{s.text}</p>
                    <ul>{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
                    <Link href="/brief" className={styles.cta}>Start this project →</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <div className={styles.stage} onMouseMove={move} onMouseLeave={leave}>
          <motion.div className={styles.frame} style={{ rotateX: rx, rotateY: ry }}>
            <AnimatePresence initial={false}>
              <motion.div key={group.id + item.title} className={styles.slide}
                initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(100% 0 0 0)" }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
                <motion.div className={styles.imgWrap} initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}>
                  <Image src={serviceImages[item.img]} alt={item.title} fill placeholder="blur" quality={85} sizes="(max-width:900px) 90vw, 520px" />
                </motion.div>
                <div className={styles.shade} />
                <div className={styles.label}><small>{group.label}</small><b>{item.title}</b></div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
}
