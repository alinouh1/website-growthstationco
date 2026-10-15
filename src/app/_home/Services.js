"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { FiTarget, FiStar, FiPenTool, FiSmartphone, FiVideo, FiBarChart2, FiGlobe, FiShoppingCart, FiLayout, FiLayers, FiArrowUpRight } from "react-icons/fi";
import { pics } from "../../assets/images/pages";
import { Reveal } from "./motion";
import { marketing, software } from "./data";
import styles from "./Services.module.css";

const I = { target: FiTarget, star: FiStar, pen: FiPenTool, phone: FiSmartphone, video: FiVideo, chart: FiBarChart2, globe: FiGlobe, cart: FiShoppingCart, layout: FiLayout, layers: FiLayers };
const pic = (i) => pics[i % pics.length]; // نفس ترتيب صور صفحة Service
const GROUPS = [
  { label: "Digital Marketing", items: marketing, base: 0 },
  { label: "Software", items: software, base: marketing.length },
];
const ALL = GROUPS.flatMap((gr) => gr.items.map((_, j) => gr.base + j));
const pad = (n) => String(n).padStart(2, "0");

export default function Services({ children }) {
  const calm = useReducedMotion();
  const [g, setG] = useState(0);
  const [h, setH] = useState(null); // رقم الخدمة اللي الماوس عليها
  const box = useRef(null);
  const mx = useMotionValue(0), my = useMotionValue(0), mr = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 170, damping: 19 });
  const sy = useSpring(my, { stiffness: 170, damping: 19 });
  const sr = useSpring(mr, { stiffness: 120, damping: 10 });

  // الصورة بتتبع الماوس بنعومة وبتميل حسب سرعة الحركة (قيم motion مباشرة، من غير re-render)
  const move = (e) => {
    const r = box.current.getBoundingClientRect();
    mx.set(Math.min(r.width - 270, e.clientX - r.left + 36));
    my.set(e.clientY - r.top - 150);
    mr.set(Math.max(-12, Math.min(12, e.movementX * 0.5)));
  };
  const leave = () => { setH(null); mr.set(0); };

  return (
    <section id="services" className={styles.wrap}>
      <div className={styles.sec}>
        <div className={styles.layout}>
          <Reveal className={styles.side}>
            <p className={styles.kicker}>Our expertise</p>
            <h2>Interactive services</h2>
            <p className={styles.lead}>From brand identity to full-stack software — every service we offer is designed to connect strategy with execution.</p>
            <div className={styles.tabs} role="tablist">
              {GROUPS.map((gr, i) => (
                <button key={gr.label} type="button" role="tab" aria-selected={g === i} className={styles.tab} onClick={() => { setG(i); setH(null); }}>
                  {g === i && <motion.span layoutId="svc-pill" className={styles.pill} transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className={styles.tl}><small>{pad(i + 1)}</small><b>{gr.label}</b><em>{gr.items.length}</em></span>
                </button>
              ))}
            </div>
            <Link href="/service" className={styles.more}>See all services →</Link>
            <div className={styles.big} aria-hidden="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={g} initial={{ y: "70%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-70%", opacity: 0 }} transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}>{pad(g + 1)}</motion.span>
              </AnimatePresence>
            </div>
          </Reveal>

          <div ref={box} className={styles.listBox} onMouseMove={move} onMouseLeave={leave}>
            <AnimatePresence mode="wait">
              <motion.ul key={g} className={styles.list} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {GROUPS[g].items.map(([name, k], j) => {
                  const id = GROUPS[g].base + j, Ic = I[k];
                  return (
                    <motion.li key={name} initial={calm ? false : { y: 38, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.65, delay: 0.05 + j * 0.07, ease: [0.2, 0.8, 0.2, 1] }}>
                      <Link href="/service" className={`${styles.row} ${h === id ? styles.hot : ""}`} onMouseEnter={() => setH(id)} onFocus={() => setH(id)} onBlur={() => setH(null)}>
                        <small>{pad(j + 1)}</small>
                        <span className={styles.name}>{name}</span>
                        <Ic className={styles.ric} />
                        <span className={styles.thumb}><Image src={pic(id)} alt="" fill sizes="64px" quality={70} placeholder="blur" /></span>
                        <i className={styles.arr}><FiArrowUpRight /></i>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>

            {/* معاينة بتتبع الماوس (على الأجهزة اللي فيها ماوس بس) */}
            <motion.div className={`${styles.preview} ${h !== null ? styles.on : ""}`} style={{ x: sx, y: sy, rotate: sr }} aria-hidden="true">
              <div className={styles.pframe}>
                {ALL.map((id) => (
                  <Image key={id} className={id === h ? styles.show : ""} src={pic(id)} alt="" fill sizes="260px" quality={70} placeholder="blur" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
