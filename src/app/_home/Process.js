"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiSearch, FiTarget, FiPenTool, FiCode, FiSend, FiTrendingUp, FiArrowDown } from "react-icons/fi";
import Chip from "./Chip";
import { DESK, LANES_DESK, ST_DESK, TR_DESK } from "./paths";
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
const N = STAGES.length;
// ديسكتوب: نفس مسار الموقع القديم (2000×900) أفقي ومثبّت. موبايل وتابلت (≤1024px): طريق متعرّج قصير بمحطات وسيارة بتتحرك مع السكرول
const MODES = {
  desk: { key: "desk", w: 2000, h: 900, d: DESK, lanes: LANES_DESK, st: ST_DESK, tr: TR_DESK, axis: "x", sides: ["above", "below", "above", "below", "above", "below"] },
};
for (const m of Object.values(MODES)) {
  m.ts = m.tr.x.map((_, i) => i / (m.tr.x.length - 1));
  m.rv = (m.axis === "x" ? m.tr.x : m.tr.y).map((v) => (v / (m.axis === "x" ? m.w : m.h)) * 100);
}
const F = ST_DESK.map((s) => s[2]); // نقاط الوقوف: 5% 24% 43% 62% 81% 100%

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

/* ===== موبايل وتابلت: طريق متعرّج (3 حارات بلفّات S) والمحطات مربعات عليه والسيارة بتمشي من محطة لمحطة ===== */
const CW = 360, CH = 440, OY = 30, R = 70, LA = 298, LB = 176, LC = 298;
const ARC = Math.PI * R, LEN = LA + ARC + LB + ARC + LC;
const ROAD = "M -30 80 L 268 80 A 70 70 0 0 1 268 220 L 92 220 A 70 70 0 0 0 92 360 L 390 360";
const STN = [[80, 80], [200, 80], [215, 220], [125, 220], [145, 360], [265, 360]]; // مركز كل محطة على الطريق
const ACCENTS = ["#f2b84b", "#ff8a4c", "#7bd66b", "#4cc9b0", "#ffd166", "#de6a2e"]; // لون لكل محطة
const sOf = (x, y) => (y === 80 ? x + 30 : y === 220 ? LA + ARC + (268 - x) : LA + ARC + LB + ARC + (x - 92));
const CF = STN.map(([x, y]) => sOf(x, y) / LEN); // مكان كل محطة كنسبة من طول الطريق

// مكان السيارة واتجاهها (x, y, زاوية) عند نسبة f من الطريق
function pose(f) {
  let s = Math.min(1, Math.max(0, f)) * LEN;
  if (s <= LA) return [-30 + s, 80, 0];
  s -= LA;
  if (s <= ARC) { const u = s / ARC, th = ((-90 + 180 * u) * Math.PI) / 180; return [268 + R * Math.cos(th), 150 + R * Math.sin(th), 180 * u]; }
  s -= ARC;
  if (s <= LB) return [268 - s, 220, 180];
  s -= LB;
  if (s <= ARC) { const u = s / ARC, th = ((-90 - 180 * u) * Math.PI) / 180; return [92 + R * Math.cos(th), 290 + R * Math.sin(th), 180 - 180 * u]; }
  s -= ARC;
  return [92 + s, 360, 0];
}

// السكرول -> مسافة على الطريق: وقفة عند كل محطة، والسيارة بتكمّل وتخرج من الشاشة في الآخر
const CKEYS = (() => {
  const dwell = 0.05, hold = 0.1, travel = 1 - dwell * CF.length - hold;
  const ins = [0], outs = [0];
  let x = 0, prev = 0;
  CF.forEach((f) => { x += (f - prev) * travel; ins.push(x); outs.push(f); x += dwell; ins.push(x); outs.push(f); prev = f; });
  ins.push(1); outs.push(1);
  return { ins, outs };
})();

const letter = {
  in: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: (i) => ({ opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: 0.05 + i * 0.035, duration: 0.4, ease: "easeOut" } }),
  out: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};
const rise = {
  in: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.45, ease: "easeOut" } },
  out: { opacity: 0, transition: { duration: 0.12 } },
};

function Burst({ color }) {
  return (
    <span className={styles.burst} aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <motion.i key={i} style={{ background: color }} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(a) * 46, y: Math.sin(a) * 46, opacity: 0, scale: 0 }} transition={{ duration: 0.85, ease: "easeOut" }} />;
      })}
    </span>
  );
}

function Car({ s }) {
  const p = useTransform(s, pose);
  const x = useTransform(p, (v) => v[0]);
  const y = useTransform(p, (v) => v[1] + OY);
  const r = useTransform(p, (v) => v[2]);

  return (
    <motion.div className={styles.car} style={{ x, y, rotate: r }} aria-hidden="true">
      <svg viewBox="0 0 64 30" overflow="visible">
        <defs>
          <linearGradient id="cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3c9535" /><stop offset="1" stopColor="#12400c" /></linearGradient>
          <linearGradient id="cl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffd66b" stopOpacity=".55" /><stop offset="1" stopColor="#ffd66b" stopOpacity="0" /></linearGradient>
        </defs>
        <path d="M58 6 L116 -8 L116 38 L58 24 Z" fill="url(#cl)" />
        <rect x="3" y="5" width="58" height="26" rx="11" fill="rgba(0,0,0,.4)" />
        {[9, 40].flatMap((wx) => [-1, 27].map((wy) => <rect key={`${wx}${wy}`} x={wx} y={wy} width="12" height="4" rx="1.5" fill="#0b1a09" />))}
        <rect x="2" y="2" width="58" height="26" rx="11" fill="url(#cb)" stroke="rgba(255,255,255,.3)" />
        <rect x="10" y="14" width="22" height="2" rx="1" fill="#f2b84b" opacity=".9" />
        <rect x="21" y="5" width="20" height="20" rx="6" fill="#0d2b0b" opacity=".55" />
        <path d="M44 6 L52 9 L52 21 L44 24 Z" fill="rgba(190,235,205,.85)" />
        <path d="M15 7 L21 8 L21 22 L15 23 Z" fill="rgba(190,235,205,.55)" />
        <circle cx="59" cy="8" r="2.6" fill="#ffe08a" /><circle cx="59" cy="22" r="2.6" fill="#ffe08a" />
        <rect x="1" y="6" width="3" height="5" rx="1" fill="#ff6a3d" /><rect x="1" y="19" width="3" height="5" rx="1" fill="#ff6a3d" />
      </svg>
    </motion.div>
  );
}

function Caption({ active }) {
  const st = STAGES[active];
  return (
    <div className={styles.cap} aria-live="polite">
      <div className={styles.capBox}>
        <AnimatePresence mode="wait" initial={false}>
          {active < 0 ? (
            <motion.div key="hint" className={styles.hint} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              Scroll to start <FiArrowDown />
            </motion.div>
          ) : (
            <motion.div key={active} className={styles.capIn} initial="in" animate="show" exit="out">
              <motion.span className={styles.bignum} variants={rise}>{pad(active + 1)}</motion.span>
              <div>
                <h3>{[...st.title].map((ch, i) => <motion.span key={i} custom={i} variants={letter}>{ch === " " ? "\u00a0" : ch}</motion.span>)}</h3>
                <motion.p variants={rise}>{st.desc}</motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className={styles.dots}>{STAGES.map((_, i) => <i key={i} className={i <= active ? styles.dOn : ""} style={{ "--c": ACCENTS[i] }} />)}</div>
    </div>
  );
}

function Compact({ calm }) {
  const wrap = useRef(null);
  const fit = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, clamp01);
  const raw = useTransform(p, CKEYS.ins, CKEYS.outs);
  const one = useMotionValue(1);
  const s = calm ? one : raw;
  const trail = useTransform(s, clamp01);
  const active = useActive(s, calm, CF);

  // الكانفس بإحداثيات ثابتة (360×410) وبيتعمله scale حسب عرض الشاشة
  useEffect(() => {
    const el = fit.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (!w) return;
      el.style.setProperty("--k", (w / CW).toFixed(4));
      el.dataset.ready = "1";
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`${styles.mobWrap} ${calm ? styles.mcalm : ""}`}>
      <div className={styles.mpin} style={{ "--accent": ACCENTS[Math.max(active, 0)] }}>
        <span className={styles.blob} /><span className={`${styles.blob} ${styles.b2}`} /><span className={`${styles.blob} ${styles.b3}`} />
        <Bg /><Head />
        <div className={styles.mbody}>
          <div ref={fit} className={styles.mfit} style={{ "--ar": CW / CH }}>
            <div className={styles.mcanvas} style={{ width: CW, height: CH }}>
<svg className={styles.mroad} width={CW} height={CH} style={{ top: OY }} aria-hidden="true">                <defs>
                  <linearGradient id="mtg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={CW} y2="0">
                    <stop offset="0" stopColor="#f2b84b" /><stop offset="1" className={styles.gs} />
                  </linearGradient>
                </defs>
                <path d={ROAD} className={styles.msh} transform="translate(0 5)" />
                <path d={ROAD} className={styles.mtr} />
                <path d={ROAD} className={styles.mhl} />
                <path d={ROAD} className={styles.mlane} />
                <motion.path d={ROAD} className={styles.mglow} style={{ pathLength: trail }} />
                <motion.path d={ROAD} className={styles.mlit} stroke="url(#mtg)" style={{ pathLength: trail }} />
              </svg>

             <ol className={styles.mtiles}>
  {STAGES.map(({ title, Icon }, i) => {
    const on = calm || i <= active, cur = i === active;
    return (
      <li key={title} className={`${styles.mp} ${on ? styles.mon : ""} ${cur ? styles.mcur : ""}`}
        style={{ left: STN[i][0], top: STN[i][1] - 21 + OY, "--c": ACCENTS[i] }}
        aria-current={cur ? "step" : undefined}>
        <motion.div className={styles.plate}
          animate={cur ? { rotate: [0, -6, 4, -2, 0], scale: 1.06 } : { rotate: 0, scale: 1 }}
          transition={cur ? { duration: 0.9, ease: "easeOut" } : { duration: 0.3 }}>
          <small>{pad(i + 1)}</small>
          <i className={styles.lamp} />
          <span className={styles.mico}><Icon /></span>
          <b>{title}</b>
          {cur && <Burst color="#7bd66b" />}
        </motion.div>
        <span className={styles.stem} />
        <span className={styles.foot} />
      </li>
    );
  })}
</ol>

              <Car s={s} />
            </div>
          </div>
          <Caption active={active} />
        </div>
      </div>
    </div>
  );
}

export default function Process() {
  const calm = useReducedMotion();
  return (
    <section id="process" className={styles.wrap}>
      <Desk calm={calm} />
      <Compact calm={calm} />
    </section>
  );
}