"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiSearch, FiTarget, FiPenTool, FiCode, FiSend, FiTrendingUp } from "react-icons/fi";
import Chip from "./Chip";
import { DESK, LANES_DESK, ST_DESK, TR_DESK, MOB, LANES_MOB, ST_MOB, TR_MOB } from "./paths";
import { processBg } from "./bg";
import styles from "./Process.module.css";

const STAGES = [
  { title: "Discovery", desc: "Brand, audience & goals", Icon: FiSearch },
  { title: "Strategy", desc: "Roadmap & positioning", Icon: FiTarget },
  { title: "Design", desc: "Experience that converts", Icon: FiPenTool },
  { title: "Development", desc: "Scalable implementation", Icon: FiCode },
  { title: "Launch", desc: "Go live with confidence", Icon: FiSend },
  { title: "Growth", desc: "Optimize and scale", Icon: FiTrendingUp },
];
// ديسكتوب: نفس مسار الموقع القديم (2000×900) أفقي ومثبّت. موبايل (≤1024px): طريق عمودي طويل (600×2200) من غير تثبيت
const MODES = {
  desk: { key: "desk", w: 2000, h: 900, d: DESK, lanes: LANES_DESK, st: ST_DESK, tr: TR_DESK, axis: "x", sides: ["above", "below", "above", "below", "above", "below"] },
  mob: { key: "mob", w: 600, h: 2200, d: MOB, lanes: LANES_MOB, st: ST_MOB, tr: TR_MOB, axis: "y", sides: Array(6).fill("right") },
};
for (const m of Object.values(MODES)) {
  m.ts = m.tr.x.map((_, i) => i / (m.tr.x.length - 1));
  m.rv = (m.axis === "x" ? m.tr.x : m.tr.y).map((v) => (v / (m.axis === "x" ? m.w : m.h)) * 100);
}
const F = ST_DESK.map((s) => s[2]); // نفس نقاط الوقوف في الوضعين: 5% 24% 43% 62% 81% 100%

// السكرول -> مسافة على الطريق: وقفة عند كل محطة، والقطر بيخلص الرحلة قبل نهاية القسم (زي القديم)
const DWELL = 0.04, HOLD = 0.08;
const KEYS = (() => {
  const travel = 1 - DWELL * F.length - HOLD;
  const ins = [0], outs = [0];
  let x = 0, prev = 0;
  F.forEach((f) => { x += (f - prev) * travel; ins.push(x); outs.push(f); x += DWELL; ins.push(x); outs.push(f); prev = f; });
  ins.push(1); outs.push(1);
  return { ins, outs };
})();

const MOB_F = ST_MOB.map((s) => s[2]); // نقاط وقوف الموبايل (على قمم الموجة)
const clamp01 = (v) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);
const pad = (n) => String(n).padStart(2, "0");

function Road({ m, t, active }) {
  const fit = useRef(null);
  // الاستيج بإحداثيات ثابتة (نفس viewBox القديم) وبيتعمله scale: قياس واحد عند تغيير الحجم بس
  useEffect(() => {
    const el = fit.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (!w) return;
      el.style.setProperty("--k", (w / m.w).toFixed(4));
      el.dataset.ready = "1";
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [m.w]);

  // القطر بـ transform من جداول جاهزة (GPU)، والجزء المضيء بـ clip-path بدل تعديل SVG clipPath كل فريم
  const x = useTransform(t, m.ts, m.tr.x);
  const y = useTransform(t, m.ts, m.tr.y);
  const r = useTransform(t, m.ts, m.tr.r);
  const rev = useTransform(t, m.ts, m.rv);
  const clip = useTransform(rev, (v) => (m.axis === "x" ? `inset(0 ${(100 - v).toFixed(2)}% 0 0)` : `inset(0 0 ${(100 - v).toFixed(2)}% 0)`));
  const k = m.key;

  return (
    <div ref={fit} className={`${styles.fit} ${styles[k]}`} style={{ "--ar": m.w / m.h }}>
      <div className={styles.canvas} style={{ width: m.w, height: m.h }}>
        <svg className={styles.layer} width={m.w} height={m.h} aria-hidden="true">
          <path d={m.d} className={styles.shadow} transform="translate(0 6)" />
          <path d={m.d} className={styles.track} />
          <path d={m.d} className={styles.hl} />
          <path d={m.lanes[0]} className={styles.lane} /><path d={m.lanes[1]} className={styles.lane} />
        </svg>
        <motion.svg className={styles.layer} width={m.w} height={m.h} style={{ clipPath: clip }} aria-hidden="true">
          <defs>
            <linearGradient id={`tg-${k}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={m.axis === "x" ? m.w : 0} y2={m.axis === "x" ? 0 : m.h}>
              <stop offset="0" stopColor="#f2b84b" /><stop offset="1" stopColor="#de6a2e" />
            </linearGradient>
          </defs>
          <path d={m.d} className={styles.glow} />
          <path d={m.d} className={styles.trail} stroke={`url(#tg-${k})`} />
          <path d={m.lanes[0]} className={styles.laneLit} /><path d={m.lanes[1]} className={styles.laneLit} />
        </motion.svg>

        {STAGES.map(({ title, desc, Icon }, i) => {
          const s = m.st[i];
          return (
            <div key={title} className={`${styles.st} ${styles[m.sides[i]]} ${i <= active ? styles.on : ""} ${i === active ? styles.cur : ""}`}
              style={{ left: s[0], top: s[1], "--nx": s[3], "--ny": s[4], "--room": `${s[5]}px` }}>
              <div className={styles.anchor}>
                <span className={styles.node}><Icon /></span>
                <div className={styles.card}><small>{pad(i + 1)}</small><h3>{title}</h3><p>{desc}</p></div>
              </div>
            </div>
          );
        })}

        <motion.div className={styles.train} style={{ x, y, rotate: r }}>
          <svg viewBox="0 0 80 36" aria-hidden="true">
            <defs>
              <linearGradient id={`bd-${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f7a2a" /><stop offset="1" stopColor="#12400c" /></linearGradient>
              <linearGradient id={`bm-${k}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffd66b" stopOpacity=".4" /><stop offset="1" stopColor="#ffd66b" stopOpacity="0" /></linearGradient>
              <radialGradient id={`gl-${k}`}><stop offset="0" stopColor="#f2b84b" stopOpacity=".35" /><stop offset="1" stopColor="#f2b84b" stopOpacity="0" /></radialGradient>
            </defs>
            <circle cx="40" cy="16" r="38" fill={`url(#gl-${k})`} />
            <path d="M77 14 L134 -10 L134 38 Z" fill={`url(#bm-${k})`} />
            <ellipse cx="40" cy="34" rx="32" ry="2.6" fill="rgba(0,0,0,.45)" />
            <rect x="4" y="3" width="70" height="26" rx="9" fill={`url(#bd-${k})`} stroke="rgba(255,255,255,.25)" />
            <rect x="4" y="19" width="70" height="3" fill="#f2b84b" opacity=".9" />
            {[12, 27, 42].map((wx) => <rect key={wx} x={wx} y="8" width="11" height="8" rx="2.5" fill="rgba(190,235,205,.7)" />)}
            <path d="M58 7 L68 7 Q73 9 73 17 L58 17 Z" fill="rgba(190,235,205,.85)" />
            <circle cx="75" cy="13" r="3" fill="#ffd66b" />
            <circle cx="20" cy="29" r="5" fill="#0d1f0b" stroke="#9bb894" /><circle cx="58" cy="29" r="5" fill="#0d1f0b" stroke="#9bb894" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

function useActive(t, calm, Fs) {
  // state بيتغير بس لما رقم المحطة يتغير (مش في كل فريم)
  const [active, setActive] = useState(-1);
  const sync = (v) => {
    const idx = Fs.reduce((a, f, i) => (v >= f - 0.004 ? i : a), -1);
    setActive((prev) => (prev === idx ? prev : idx));
  };
  useMotionValueEvent(t, "change", sync);
  useEffect(() => { sync(t.get()); }, [calm]); // eslint-disable-line
  return active;
}
const Bg = () => processBg && <div className={styles.bg}><Image src={processBg} alt="" fill placeholder="blur" quality={75} sizes="100vw" /></div>;
const Head = () => <div className={styles.head}><Chip>How we work</Chip><h2>Our Process</h2></div>;

/* ديسكتوب: القسم مثبّت والقطر بيمشي بالعرض مع السكرول (طول السكرول من .deskWrap في الـ CSS) */
function Desk({ calm }) {
  const wrap = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, clamp01);
  const raw = useTransform(p, KEYS.ins, KEYS.outs);
  const one = useMotionValue(1);
  const t = calm ? one : raw;
  const active = useActive(t, calm, F);
  return (
    <div ref={wrap} className={`${styles.deskWrap} ${calm ? styles.calm : ""}`}>
      <div className={styles.pin}>
        <Bg /><Head />
        <div className={styles.box}><Road m={MODES.desk} t={t} active={active} /></div>
        <div className={styles.hud}>
          <span className={styles.num}>{pad(active + 1)}<small>/{pad(STAGES.length)}</small></span>
          <em>{active < 0 ? "Scroll to start" : STAGES[active].title}</em>
          <span className={styles.bar}><motion.i style={{ scaleX: calm ? 1 : p }} /></span>
        </div>
      </div>
    </div>
  );
}

/* موبايل: طريق عمودي طويل بعرض الشاشة كله، والقطر ماشي مع السكرول العادي */
function Mob({ calm }) {
  const box = useRef(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start 55%", "end 55%"] });
  const raw = useTransform(scrollYProgress, clamp01);
  const one = useMotionValue(1);
  const t = calm ? one : raw;
  const active = useActive(t, calm, MOB_F);
  return (
    <div className={styles.mobWrap}>
      <Bg /><Head />
      <div ref={box} className={styles.mobBox}><Road m={MODES.mob} t={t} active={active} /></div>
    </div>
  );
}

export default function Process() {
  const calm = useReducedMotion();
  return (
    <section id="process" className={styles.wrap}>
      <Desk calm={calm} />
      <Mob calm={calm} />
    </section>
  );
}
