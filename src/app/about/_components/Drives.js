"use client";
import { useState } from "react";
import Chip from "./Chip";
import { drives } from "./data";
import styles from "./Drives.module.css";

export default function Drives() {
  const [a, setA] = useState(0);
  const cols = drives.map((_, i) => (i === a ? "3.4fr" : "1fr")).join(" ");

  return (
    <section className={styles.wrap}>
      <div className={styles.sec}>
        <div className={styles.head}>
          <div>
            <Chip>What drives us</Chip>
            <h2 className={styles.title}>Built to <b>move</b> your business <em>forward.</em></h2>
          </div>
          <p>Vision. Mission. Promise.</p>
        </div>
        <div className={styles.panels} style={{ "--cols": cols }}>
          {drives.map((d, i) => (
            <article key={d.label} tabIndex={0} aria-label={`${d.label}: ${d.title}`}
              className={`${styles.panel} ${a === i ? styles.open : ""}`}
              onMouseEnter={() => setA(i)} onFocus={() => setA(i)} onClick={() => setA(i)}>
              <span className={styles.vert}><span>{d.label}</span></span>
              <div className={styles.body}>
                <span className={styles.tag}>{d.label}</span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
