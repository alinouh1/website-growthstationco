"use client";
import { useRef } from "react";
import styles from "./SpotlightCard.module.css";

// كارت فيه لمعة بتتبع الماوس (CSS variables بس، بدون re-render)
export default function SpotlightCard({ children, className = "", lift = true }) {
  const ref = useRef(null);
  const raf = useRef(0);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
    });
  }
  return (
    <div ref={ref} onPointerMove={onMove} className={`${styles.card} ${lift ? styles.lift : ""} ${className}`}>
      {children}
    </div>
  );
}
