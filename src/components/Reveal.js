"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.css";

// ظهور العناصر مع الـ scroll بدون أي مكتبة (IntersectionObserver + CSS)
export default function Reveal({ children, delay = 0, duration = 0.7, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io;
    const start = () => {
      if (!("IntersectionObserver" in window)) { setShown(true); return; }
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      io.observe(el);
    };
    if (document.documentElement.classList.contains("ready")) start();
    else window.addEventListener("gs-ready", start, { once: true });
    return () => { window.removeEventListener("gs-ready", start); io && io.disconnect(); };
  }, []);

  return (
    <div ref={ref} className={`${styles.reveal} ${shown ? styles.in : ""} ${className}`} style={{ transitionDelay: `${delay}s`, transitionDuration: `${duration}s` }}>
      {children}
    </div>
  );
}
