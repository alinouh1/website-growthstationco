import { getJobPostings } from "@/lib/api";
import RolesMarquee from "./_components/RolesMarquee";
import JobBoard from "./_components/JobBoard";
import styles from "./page.module.css";

export const metadata = {
  title: "Careers",
  description: "Join a team that builds systems, not just campaigns. Explore open positions at Growth Station.",
};
export const revalidate = 300;

const LINES = [["Build", "something"], ["that", "matters."]];

export default async function Careers() {
  let initial = { items: [], hasMore: false };
  try { initial = await getJobPostings(1); } catch {}
  let k = 0;
  return (
    <>
      <section className={styles.hero}>
        <span className={`${styles.blob} ${styles.b1}`} />
        <span className={`${styles.blob} ${styles.b2}`} />
        <div className={styles.inner}>
          <span className={styles.eyebrow} data-anim style={{ "--i": 0 }}><i className={styles.dot} /> We&apos;re hiring</span>
          <h1 className={styles.title}>
            {LINES.map((line, li) => (
              <span key={li} className={styles.line}>
                {line.map((w) => {
                  const i = ++k;
                  return (
                    <span key={w} className={styles.word}>
                      <span data-anim style={{ "--i": i }} className={li === 1 ? "gradientText" : ""}>{w}</span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>
          <p className={styles.lead} data-anim style={{ "--i": 5 }}>Join a team that builds systems, not just campaigns. We&apos;re looking for people who think before they execute.</p>
          <div className={styles.actions} data-anim style={{ "--i": 5.5 }}>
            <a href="#roles" className={styles.primary}>See open roles <span aria-hidden="true">↓</span></a>
            <a href="#apply" className={styles.ghost}>Open application</a>
          </div>
        </div>
        <RolesMarquee />
      </section>

      <JobBoard initialJobs={initial.items} initialHasMore={initial.hasMore} />
    </>
  );
}
