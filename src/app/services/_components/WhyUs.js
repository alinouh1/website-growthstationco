import styles from "./WhyUs.module.css";

const reasons = [
  ["Strategy Before Everything", "Every campaign, every post, every decision is connected to a clear growth plan built specifically for your business.", "ink"],
  ["Results You Can Measure", "We are allergic to vanity metrics. We track what moves your business: leads, conversions, and real ROI.", "cream"],
  ["Egypt & GCC, One Partner", "We are fluent in both markets. Whether scaling locally or expanding across the Gulf, we know the audiences, dynamics, and opportunities.", "amber"],
  ["Full Stack, One Team", "Strategy, branding, software, content, ads, and media, all under one roof, all aligned to one goal. No handoffs. No gaps.", "ember"],
];

export default function WhyUs() {
  return (
    <section className={styles.wrap}>
      <div className={styles.section}>
      <div className={styles.side}>
        <h2>Most agencies deliver work. <span className="gradientText">We deliver growth.</span></h2>
        <p>There is no shortage of agencies that post, design, and execute. What is rare is a partner who starts with your business goals, builds a strategy around them, and takes full ownership of the results.</p>
      </div>
      <div className={styles.stack}>
        {reasons.map(([t, d, v], i) => (
          <article key={t} className={`${styles.card} ${styles[v]}`} style={{ top: 120 + i * 26 }}>
            <h3>{t}</h3><p>{d}</p>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
