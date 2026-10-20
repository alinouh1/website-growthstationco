"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { pics } from "../../assets/images/pages";
import styles from "./Gallery.module.css";

// كل صف لازم يكون فيه صور كفاية عشان الشريط يملا العرض
const fill = (a) => { let r = [...a]; while (r.length && r.length < 8) r = r.concat(a); return r; };
const half = Math.ceil(pics.length / 2);
const rows = [fill(pics.slice(0, half)), fill(pics.slice(half).length ? pics.slice(half) : pics.slice(0, half))];

// شريط بيتحرك لوحده ومعاه سحب بالماوس/الإصبع. بعد السحب بيكمّل بزخم ثم يرجع يتحرك لوحده
function Lane({ imgs, rev }) {
  const lane = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const laneEl = lane.current;
    const trackEl = track.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = rev ? 1 : -1;      // الصف التاني بيمشي عكس الأول
    const seconds = rev ? 95 : 80; // نفس سرعة الأنيميشن القديم
    let W = 0, x = 0, momentum = 0, vel = 0;
    let last = 0, raf = 0, visible = false, hovering = false, dragging = false;
    let startX = 0, startOff = 0, lastX = 0, lastT = 0;

    const measure = () => { W = trackEl.firstElementChild.offsetWidth; };
    const wrap = () => { if (W) x = (((x % W) + W) % W) - W; }; // بيفضل بين -W و 0
    const paint = () => { trackEl.style.transform = `translate3d(${x}px,0,0)`; };

    const tick = (t) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (!dragging) {
        const auto = reduce || hovering ? 0 : (dir * W) / seconds;
        x += (auto + momentum) * dt;
        momentum *= Math.exp(-3 * dt);
        if (Math.abs(momentum) < 1) momentum = 0;
        wrap();
        paint();
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const down = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      momentum = 0;
      vel = 0;
      startX = lastX = e.clientX;
      startOff = x;
      lastT = performance.now();
      laneEl.setPointerCapture(e.pointerId);
      laneEl.classList.add(styles.dragging);
    };
    const move = (e) => {
      if (!dragging) return;
      const now = performance.now();
      const dt = (now - lastT) / 1000;
      if (dt > 0) vel = vel * 0.6 + ((e.clientX - lastX) / dt) * 0.4;
      lastX = e.clientX;
      lastT = now;
      x = startOff + (e.clientX - startX);
      wrap();
      paint();
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      laneEl.classList.remove(styles.dragging);
      if (performance.now() - lastT > 80) vel = 0; // وقف قبل ما يسيب = من غير زخم
      momentum = Math.max(-3000, Math.min(3000, vel));
      start();
    };
    const enter = (e) => { if (e.pointerType === "mouse") hovering = true; };
    const leave = () => { hovering = false; };

    measure();
    wrap();
    paint();

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });
    io.observe(laneEl);
    const ro = new ResizeObserver(() => { measure(); wrap(); paint(); });
    ro.observe(trackEl.firstElementChild);

    laneEl.addEventListener("pointerdown", down);
    laneEl.addEventListener("pointermove", move);
    laneEl.addEventListener("pointerup", up);
    laneEl.addEventListener("pointercancel", up);
    laneEl.addEventListener("pointerenter", enter);
    laneEl.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      laneEl.removeEventListener("pointerdown", down);
      laneEl.removeEventListener("pointermove", move);
      laneEl.removeEventListener("pointerup", up);
      laneEl.removeEventListener("pointercancel", up);
      laneEl.removeEventListener("pointerenter", enter);
      laneEl.removeEventListener("pointerleave", leave);
    };
  }, [rev]);

  return (
    <div ref={lane} className={styles.lane} onDragStart={(e) => e.preventDefault()}>
      <div ref={track} className={styles.track}>
        {[0, 1].map((g) => (
          <div key={g} className={styles.group} aria-hidden={g === 1 ? "true" : undefined}>
            {imgs.map((src, i) => (
              <figure key={i} className={styles.item}>
                <Image src={src} alt="" fill draggable={false} placeholder="blur" quality={75} sizes="(max-width:700px) 220px, 340px" />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <section className={styles.wrap} aria-label="Selected work">
      <p className={styles.kicker}>Our work</p>
      <Lane imgs={rows[0]} />
      <Lane imgs={rows[1]} rev />
    </section>
  );
}