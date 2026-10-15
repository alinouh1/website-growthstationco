"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { submitJobApplication } from "@/lib/api";
import { POSITIONS, deptOf } from "./jobs";
import styles from "./ApplicationModal.module.css";

const MAX_CV = 5 * 1024 * 1024; // 5 MB
const EXT = [".pdf", ".doc", ".docx"];
const REQ = "This field is required";
const ORDER = ["position", "fullName", "email", "phone", "portfolio", "cv", "whyGrowthStation"];
const normalizeUrl = (v) => { const t = v.trim(); return /^https?:\/\//i.test(t) ? t : `https://${t}`; };

// نفس قواعد التحقق القديمة: بترجّع نص الخطأ أو ""
const R = {
  position: (v) => (!v ? REQ : !POSITIONS.includes(v) ? "Please select a position" : ""),
  fullName: (v) => (!v.trim() ? REQ : v.trim().length < 3 ? "Enter your full name (at least 3 characters)" : ""),
  email: (v) => (!v.trim() ? REQ : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address"),
  phone: (v) => (!v.trim() ? REQ : /^\+?\d{8,15}$/.test(v.trim().replace(/[\s\-()]/g, "")) ? "" : "Enter a valid phone number (8–15 digits)"),
  portfolio: (v) => {
    if (!v.trim()) return REQ;
    try { return new URL(normalizeUrl(v)).hostname.includes(".") ? "" : "Enter a valid link"; } catch { return "Enter a valid link"; }
  },
  whyGrowthStation: (v) => (!v.trim() ? REQ : v.trim().length < 10 ? "Write at least 10 characters" : ""),
};
const rule = (n) => ({ validate: (v) => R[n](v ?? "") || true });

function Field({ id, label, error, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={`f-${id}`}>{label} <b>*</b></label>
      {children}
      {error && <p id={`${id}-err`} role="alert" className={styles.err}>{error}</p>}
    </div>
  );
}

export default function ApplicationModal({ job, onClose }) {
  const [shown, setShown] = useState(false);
  const [cv, setCv] = useState(null);
  const [cvError, setCvError] = useState("");
  const [drag, setDrag] = useState(false);
  const [sending, setSending] = useState(false);
  const [summary, setSummary] = useState("");
  const [done, setDone] = useState(false);
  const panel = useRef(null);
  const timers = useRef({});
  const lastFocus = useRef(null);

  const { register, trigger, getValues, formState: { errors } } = useForm({
    mode: "onTouched",
    defaultValues: { position: POSITIONS.includes(job?.title) ? job.title : "", fullName: "", email: "", phone: "", portfolio: "", whyGrowthStation: "" },
  });
  const err = (n) => errors[n]?.message;
  const bad = (n) => (errors[n] ? "true" : "false");
  const dept = deptOf(job);

  function close() {
    setShown(false);
    clearTimeout(timers.current.close);
    timers.current.close = setTimeout(onClose, 420);
  }

  useEffect(() => {
    lastFocus.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => { setShown(true); panel.current?.focus({ preventScroll: true }); });
    const t = timers.current;
    return () => {
      document.body.style.overflow = prev;
      cancelAnimationFrame(raf);
      clearTimeout(t.close); clearTimeout(t.auto);
      lastFocus.current?.focus?.();
    };
  }, []);

  function onKeyDown(e) {
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab" || !panel.current) return;
    const f = panel.current.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (e.shiftKey && (a === first || a === panel.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  }

  function pickFile(file) {
    if (!file) return;
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!EXT.includes(ext)) { setCvError("Please upload a PDF or Word file."); return; }
    if (file.size > MAX_CV) { setCvError("File is too large (max 5 MB)."); return; }
    setCv(file); setCvError(""); setSummary("");
  }

  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    const okFields = await trigger();
    const v = getValues();
    if (!cv) setCvError((c) => c || "Please attach your CV");
    if (!okFields || !cv) {
      setSummary("Please fix the highlighted fields before sending");
      const first = ORDER.find((n) => (n === "cv" ? !cv : R[n](v[n] || "")));
      const el = first && document.getElementById(`f-${first}`);
      if (el) { el.scrollIntoView({ block: "center", behavior: "smooth" }); el.focus({ preventScroll: true }); }
      return;
    }
    setSending(true); setSummary("");
    try {
      await submitJobApplication({
        position: v.position, fullName: v.fullName.trim(), email: v.email.trim(), phone: v.phone.trim(),
        portfolio: normalizeUrl(v.portfolio), cv, whyGrowthStation: v.whyGrowthStation.trim(),
      });
      setDone(true);
      timers.current.auto = setTimeout(close, 2600);
    } catch (e2) {
      setSummary(e2?.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return createPortal(
    <div className={`${styles.root} ${shown ? styles.shown : ""}`} role="dialog" aria-modal="true" aria-labelledby="apply-title" onKeyDown={onKeyDown}>
      <div className={styles.backdrop} onClick={close} />
      <div ref={panel} tabIndex={-1} className={styles.panel}>
        <button type="button" className={styles.x} onClick={close} aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
        <div className={styles.top}>
          <span className={styles.badge}>{dept || "General"} · Open</span>
          <h2 id="apply-title" dir="auto">{job ? job.title : "Open Application"}</h2>
          <p>Tell us who you are and what you&apos;re great at — we&apos;ll find the right fit.</p>
        </div>

        {done ? (
          <div className={styles.success} role="status">
            <svg viewBox="0 0 52 52" className={styles.check} aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none" /><path fill="none" d="M15 27l8 8 15-17" /></svg>
            <h3>Application submitted successfully!</h3>
            <p>Thank you. We&apos;ll review it and get back to you.</p>
            <button type="button" className={styles.ghost} onClick={close}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className={styles.form}>
            <Field id="position" label="Position" error={err("position")}>
              <select id="f-position" className={styles.select} aria-invalid={bad("position")} aria-describedby="position-err" {...register("position", rule("position"))}>
                <option value="" disabled>Select a position</option>
                {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field id="fullName" label="Full name" error={err("fullName")}>
              <input id="f-fullName" autoComplete="name" placeholder="Full name" aria-invalid={bad("fullName")} aria-describedby="fullName-err" {...register("fullName", rule("fullName"))} />
            </Field>
            <Field id="email" label="Email" error={err("email")}>
              <input id="f-email" type="email" inputMode="email" autoComplete="email" placeholder="name@email.com" aria-invalid={bad("email")} aria-describedby="email-err" {...register("email", rule("email"))} />
            </Field>
            <div className={styles.two}>
              <Field id="phone" label="Phone" error={err("phone")}>
                <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone" aria-invalid={bad("phone")} aria-describedby="phone-err" {...register("phone", rule("phone"))} />
              </Field>
              <Field id="portfolio" label="Portfolio / LinkedIn" error={err("portfolio")}>
                <input id="f-portfolio" inputMode="url" autoCapitalize="none" autoCorrect="off" placeholder="linkedin.com/in/you" aria-invalid={bad("portfolio")} aria-describedby="portfolio-err" {...register("portfolio", rule("portfolio"))} />
              </Field>
            </div>

            <div className={styles.field}>
              <label htmlFor="f-cv">CV / Resume <b>*</b></label>
              <div className={`${styles.drop} ${drag ? styles.drag : ""} ${cvError ? styles.dropBad : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files?.[0]); }}>
                <input id="f-cv" type="file" accept=".pdf,.doc,.docx" className="srOnly" aria-invalid={cvError ? "true" : "false"} aria-describedby="cv-err"
                  onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = ""; }} />
                <label htmlFor="f-cv" className={styles.dropLabel}>
                  {cv ? (
                    <span className={styles.file}><svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5" /></svg><b>{cv.name}</b><i>{(cv.size / 1024 / 1024).toFixed(2)} MB</i></span>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className={styles.up}><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
                      <strong>Drop your CV here or browse files</strong>
                      <small>PDF or Word · Max 5 MB</small>
                    </>
                  )}
                </label>
              </div>
              {cvError && <p id="cv-err" role="alert" className={styles.err}>{cvError}</p>}
            </div>

            <Field id="whyGrowthStation" label="Why Growth Station?" error={err("whyGrowthStation")}>
              <textarea id="f-whyGrowthStation" rows={4} placeholder="Tell us in a few lines" aria-invalid={bad("whyGrowthStation")} aria-describedby="whyGrowthStation-err" {...register("whyGrowthStation", rule("whyGrowthStation"))} />
            </Field>

            {summary && <p role="alert" className={styles.summary}>{summary}</p>}

            <div className={styles.actions}>
              <button type="button" className={styles.ghost} onClick={close}>Cancel</button>
              <button type="submit" className={styles.submit} disabled={sending}>
                {sending ? <><span className={styles.spinner} aria-hidden="true" /> Sending…</> : <>Submit application <span aria-hidden="true">→</span></>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
