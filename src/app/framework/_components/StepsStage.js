"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./StepsStage.module.css";

// رقم واحد كبير ثابت على الجنب بيتبدّل مع الـ scroll (IntersectionObserver واحد بس)
export default function StepsStage({ steps }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)); }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const s = steps[active];
  return (
    <section className={styles.section} id="steps">
      <div className={styles.inner}>
        <div className={styles.stage} aria-hidden="true">
          <span className={styles.eyebrow}>The process</span>
          <div key={`n${active}`} className={styles.num}>{s.n}</div>
          <div key={`t${active}`} className={styles.name}>{s.title}</div>
          <div className={styles.dots}>
            {steps.map((_, i) => <i key={i} className={i === active ? styles.on : i < active ? styles.done : ""} />)}
          </div>
        </div>
        <ol className={styles.list}>
          {steps.map((st, i) => (
            <li key={st.n} ref={(el) => { refs.current[i] = el; }} data-i={i} className={`${styles.card} ${i === active ? styles.active : ""}`}>
              <span className={styles.badge}>{st.n}</span>
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}