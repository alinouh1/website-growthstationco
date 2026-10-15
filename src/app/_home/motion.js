"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function Reveal({ children, className, delay = 0, y = 44 }) {
  const calm = useReducedMotion();
  return (
    <motion.div className={className} initial={calm ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.85, delay, ease: [0.2, 0.8, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

function Word({ w, i, n, p, calm, g }) {
  const o = useTransform(p, [i / n, (i + 1) / n], [0.16, 1]);
  return <motion.span className={g ? "gradientText" : undefined} style={calm ? undefined : { opacity: o }}>{w}</motion.span>;
}

export function ScrollWords({ parts, className, rowClass }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 85%", "start 30%"] });
  const n = parts.reduce((s, [t]) => s + t.split(" ").length, 0);
  let k = 0;
  return (
    <h2 ref={ref} className={className} aria-label={parts.map(([t]) => t).join(" ")}>
      {parts.map(([t, g], r) => (
        <span key={r} className={rowClass} aria-hidden="true">
          {t.split(" ").map((w, j) => [<Word key={j} w={w} i={k++} n={n} p={p} calm={calm} g={g} />, " "])}
        </span>
      ))}
    </h2>
  );
}
