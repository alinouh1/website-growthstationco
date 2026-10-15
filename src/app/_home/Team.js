"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Chip from "./Chip";
import { team } from "./data";
import shaban from "../../assets/images/team/shaban.webp";
import rana from "../../assets/images/team/rana.webp";
import osama from "../../assets/images/team/osama.webp";
import styles from "./Team.module.css";

const PHOTOS = [shaban, rana, osama];
const AUTO_MS = 2000; // وقت التبديل التلقائي (غيّره من هنا)
const THRESH = 50;    // أقل سحب (px) يتحسب تبديل
const N = team.length;
const HALF = Math.floor(N / 2);
const offsetOf = (i, a) => ((i - a + N + HALF) % N) - HALF; // -1 / 0 / +1

export default function Team() {
  const calm = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [vis, setVis] = useState(true);
  const boxRef = useRef(null);
  const stageRef = useRef(null);
  const drag = useRef({ on: false, x: 0, dx: 0 });
  const hold = useRef({ h: false, d: false, f: false });

  const go = useCallback((d) => setActive((a) => (a + d + N) % N), []);
  const sync = () => setPaused(hold.current.h || hold.current.d || hold.current.f);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const f = () => setVis(!document.hidden);
    document.addEventListener("visibilitychange", f);
    return () => document.removeEventListener("visibilitychange", f);
  }, []);
  // التشغيل التلقائي بيقف وهو برا الشاشة / التاب مخفي / المستخدم ماسك أو واقف بالماوس
  useEffect(() => {
    if (calm || paused || !inView || !vis) return;
    const id = setTimeout(() => go(1), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, paused, inView, vis, calm, go]);

  // السحب بيحرك الكروت مباشرة بمتغير CSS (--dx) من غير re-render
  const down = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { on: true, x: e.clientX, dx: 0 };
    stageRef.current.classList.add(styles.dragging);
    hold.current.d = true; sync();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    const d = drag.current;
    if (!d.on) return;
    d.dx = e.clientX - d.x;
    stageRef.current.style.setProperty("--dx", `${d.dx}px`);
  };
  const up = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    stageRef.current.classList.remove(styles.dragging);
    stageRef.current.style.setProperty("--dx", "0px");
    if (d.dx > THRESH) go(-1); else if (d.dx < -THRESH) go(1);
    hold.current.d = false; sync();
  };
  const key = (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  const m = team[active];
  return (
    <section className={`${styles.wrap} ${paused ? styles.paused : ""} ${calm ? styles.still : ""}`}>
      <span className={styles.ghost} aria-hidden="true">TEAM</span>
      <div className={styles.sec} style={{ "--auto": `${AUTO_MS}ms` }}>
        <div className={styles.head}><Chip>Leadership</Chip><h2>Meet the team</h2></div>

        <div ref={boxRef} className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Leadership team"
          tabIndex={0} onKeyDown={key} onFocus={() => { hold.current.f = true; sync(); }} onBlur={() => { hold.current.f = false; sync(); }}>
          <div className={styles.orbit} aria-hidden="true" />
          <div ref={stageRef} className={styles.stage}
            onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") { hold.current.h = true; sync(); } }}
            onPointerLeave={(e) => { if (e.pointerType === "mouse") { hold.current.h = false; sync(); } }}>
            {team.map((p, i) => {
              const o = offsetOf(i, active);
              return (
                <figure key={p.name} className={`${styles.card} ${o === 0 ? styles.cur : ""}`} aria-hidden={o !== 0}
                  style={{ "--o": o, "--a": Math.abs(o), zIndex: o === 0 ? 3 : 1 }}
                  onClick={() => { if (o !== 0 && Math.abs(drag.current.dx) < 6) setActive(i); }}>
                  <i className={styles.frame} />
                  <div className={styles.photo}>
                    <Image src={PHOTOS[i]} alt={p.name} fill placeholder="blur" quality={80} draggable={false}
                      sizes="(max-width:899px) 60vw, 340px" />
                  </div>
                </figure>
              );
            })}
          </div>
          <button type="button" className={`${styles.arrow} ${styles.prev}`} aria-label="Previous" onClick={() => go(-1)}><FiArrowLeft /></button>
          <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Next" onClick={() => go(1)}><FiArrowRight /></button>
        </div>

        <div key={active} className={styles.meta}>
          <span className={styles.role}>{m.role}</span>
          <h3>{m.name}</h3>
          <p>{m.bio}</p>
        </div>

        <div className={styles.dots}>
          {team.map((p, i) => (
            <button key={p.name} type="button" aria-label={`Show ${p.name}`} aria-current={i === active}
              className={`${styles.dot} ${i === active ? styles.on : ""}`} onClick={() => setActive(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
