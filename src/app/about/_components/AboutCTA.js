"use client";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Reveal } from "./motion";
import styles from "./AboutCTA.module.css";

export default function AboutCTA() {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 }), sy = useSpring(y, { stiffness: 220, damping: 16 });
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const leave = () => { x.set(0); y.set(0); };

  return (
    <section className={styles.cta}>
      <div className={styles.orbits} aria-hidden="true"><i className={`${styles.ring} ${styles.r1}`} /><i className={`${styles.ring} ${styles.r2}`} /></div>
      <Reveal className={styles.inner} y={40}>
        <h2>Ready to build something real?</h2>
        <p>Book your strategy session now.</p>
        <div className={styles.magnet} onMouseMove={move} onMouseLeave={leave}>
          <motion.div style={{ x: sx, y: sy }}>
            <Link href="/brief" className={styles.btn}>Start your growth journey today →</Link>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}
