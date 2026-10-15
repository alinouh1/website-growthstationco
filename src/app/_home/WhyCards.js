"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { FiTarget, FiBarChart2, FiZap, FiUsers, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { why } from "./data";
import styles from "./WhyCards.module.css";

const icons = [FiTarget, FiBarChart2, FiZap, FiUsers];
const AUTO_MS = 3200; // وقت التبديل التلقائي (غيّره من هنا)
const N = why.length;

/* سلايدر بعرض الشاشة كلها: بيتحرك لوحده، وبيتسحب بالصباع أو الماوس، وبأسهم. الكارت اللي في النص بيتملي amber */
export default function WhyCards() {
  const calm = useReducedMotion();
  const rail = useRef(null);
  const raf = useRef(0);
  const drag = useRef({ on: false, x: 0, l: 0 });
  const [idx, setIdx] = useState(0);
  const [hold, setHold] = useState(false);
  const inView = useInView(rail, { amount: 0.35 });
  const seen = useInView(rail, { once: true, amount: 0.2 });

  const nearest = useCallback(() => {
    const el = rail.current;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, dist = Infinity;
    [...el.children].forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  }, []);
  const goTo = useCallback((i) => {
    const el = rail.current, card = el?.children[i];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
  }, []);

  // rAF واحد لكل فريم، والـ state بيتغير بس لما رقم الكارت يتغير
  const onScroll = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      if (!rail.current) return;
      const b = nearest();
      setIdx((p) => (p === b ? p : b));
    });
  };

  // التبديل التلقائي بيقف لما المستخدم ماسك / القسم برا الشاشة / تقليل الحركة
  useEffect(() => {
    if (hold || !inView || calm) return;
    const id = setTimeout(() => goTo((idx + 1) % N), AUTO_MS);
    return () => clearTimeout(id);
  }, [hold, inView, calm, idx, goTo]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // سحب بالماوس (اللمس بيشتغل لوحده بالسكرول الأصلي)
  const down = (e) => {
    setHold(true);
    if (e.pointerType !== "mouse") return;
    const el = rail.current;
    drag.current = { on: true, x: e.clientX, l: el.scrollLeft };
    el.classList.add(styles.drag);
  };
  const move = (e) => { if (drag.current.on) rail.current.scrollLeft = drag.current.l - (e.clientX - drag.current.x); };
  const up = () => {
    setHold(false);
    if (!drag.current.on) return;
    drag.current.on = false;
    rail.current.classList.remove(styles.drag);
    goTo(nearest());
  };
  const go = (d) => goTo((idx + d + N) % N);

  return (
    <div className={styles.stage}>
      <div ref={rail} className={`${styles.rail} ${seen ? styles.in : ""}`} onScroll={onScroll}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}>
        {why.map((w, i) => {
          const Icon = icons[i];
          return (
            <article key={w.title} className={`${styles.card} ${i === idx ? styles.act : ""}`} style={{ "--i": i }}>
              <span className={styles.ico}><Icon /></span>
              <div><h3>{w.title}</h3><p>{w.text}</p></div>
            </article>
          );
        })}
      </div>
      <button type="button" className={`${styles.arrow} ${styles.prev}`} aria-label="Previous" onClick={() => go(-1)}><FiArrowLeft /></button>
      <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Next" onClick={() => go(1)}><FiArrowRight /></button>
      <div className={styles.dots}>
        {why.map((w, i) => (
          <button key={w.title} type="button" aria-label={`Show ${w.title}`} aria-current={i === idx}
            className={`${styles.dot} ${i === idx ? styles.on : ""}`} onClick={() => goTo(i)} />
        ))}
      </div>
    </div>
  );
}
