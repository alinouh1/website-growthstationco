"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Reveal from "@/components/Reveal";
import { getJobPostings } from "@/lib/api";
import { toJobsArray, deptOf, jobKey } from "./jobs";
import styles from "./JobBoard.module.css";

// الـ modal (وفورمه) بيتحمّل بس لما حد يفتحه، فمش بيثقّل أول تحميل للصفحة
const ApplicationModal = dynamic(() => import("./ApplicationModal"), { ssr: false });
const preload = () => import("./ApplicationModal");

export default function JobBoard({ initialJobs, initialHasMore }) {
  const [jobs, setJobs] = useState(() => toJobsArray(initialJobs));
  const [hasMore, setHasMore] = useState(Boolean(initialHasMore));
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState({ open: false, job: null });

  const departments = [...new Set(jobs.map(deptOf).filter(Boolean))];
  const shown = filter === "all" ? jobs : jobs.filter((j) => deptOf(j).toLowerCase() === filter);

  async function loadMore() {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const res = await getJobPostings(next);
      const incoming = toJobsArray(res.items);
      setJobs((prev) => [...prev, ...incoming.filter((n) => n._id == null || !prev.some((p) => p._id === n._id))]);
      setHasMore(Boolean(res.hasMore));
      setPage(next);
    } catch {
      /* الزر هيفضل موجود وتقدر تحاول تاني */
    } finally {
      setLoadingMore(false);
    }
  }

  const open = (job = null) => setModal({ open: true, job });

  return (
    <>
      <section className={styles.roles} id="roles">
        <div className={styles.inner}>
          <Reveal duration={1}>
            <div className={styles.head}>
              <h2 className={styles.h2}>Open Positions</h2>
              {jobs.length > 0 && <span className={styles.count}>{jobs.length}{hasMore ? "+" : ""} {jobs.length === 1 && !hasMore ? "role" : "roles"}</span>}
            </div>
            {departments.length > 0 && (
              <div className={styles.filters} role="group" aria-label="Filter by department">
                <button type="button" aria-pressed={filter === "all"} className={styles.pill} onClick={() => setFilter("all")}>All</button>
                {departments.map((d) => (
                  <button key={d} type="button" aria-pressed={filter === d.toLowerCase()} className={styles.pill} onClick={() => setFilter(d.toLowerCase())}>{d}</button>
                ))}
              </div>
            )}
          </Reveal>

          {shown.length === 0 ? (
            <Reveal>
              <div className={styles.empty}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8zM8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></svg>
                <p>No positions available at the moment. Check back later.</p>
                <button type="button" className={styles.apply} onClick={() => open(null)} onPointerEnter={preload} onFocus={preload}>Send open application <span aria-hidden="true">→</span></button>
              </div>
            </Reveal>
          ) : (
            <div className={styles.list}>
              {shown.map((job, i) => (
                <Reveal key={jobKey(job, i)} delay={(i % 4) * 0.07} duration={0.9}>
                  <article className={styles.job}>
                    <span className={styles.idx} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <div className={styles.body}>
                      <h3 dir="auto">{job.title}</h3>
                      <div className={styles.tags}>
                        {deptOf(job) && <i className={styles.dept}>{deptOf(job)}</i>}
                        {job.type && <i className={styles.type}>{job.type}</i>}
                      </div>
                      {job.description && <p dir="auto">{job.description}</p>}
                    </div>
                    <button type="button" className={styles.apply} onClick={() => open(job)} onPointerEnter={preload} onFocus={preload}>Apply <span aria-hidden="true">→</span></button>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          {hasMore && (
            <div className={styles.more}>
              <button type="button" className={styles.moreBtn} onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? <span className={styles.spinner} aria-label="Loading" /> : "Load more"}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={styles.cta} id="apply">
        <Reveal duration={1.1}>
          <div className={styles.ctaIn}>
            <h2>Don&apos;t see your role?</h2>
            <p>Send an open application — we&apos;re always looking for great people.</p>
            <button type="button" className={styles.ctaBtn} onClick={() => open(null)} onPointerEnter={preload} onFocus={preload}>
              Send open application
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /></svg>
            </button>
          </div>
        </Reveal>
      </section>

      {modal.open && <ApplicationModal job={modal.job} onClose={() => setModal({ open: false, job: null })} />}
    </>
  );
}
