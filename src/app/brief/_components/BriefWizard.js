"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { submitBrief } from "@/lib/api";
import { COUNTRY_CODES } from "@/lib/constants";
import { useLang } from "@/components/LangScope";
import LangToggle from "@/components/LangToggle";
import styles from "./BriefWizard.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTES_MAX = 1000;

// قواعد التحقق: بترجّع مفتاح الخطأ (e.xxx) أو "" — والمفتاح بيترجم وقت العرض فيتغير مع زر اللغة
const RULES = {
  firstName: (v) => (!v.trim() ? "e.firstName" : v.trim().length < 2 ? "e.firstNameMin" : ""),
  lastName: (v) => (!v.trim() ? "e.lastName" : v.trim().length < 2 ? "e.lastNameMin" : ""),
  brand: (v) => (!v.trim() ? "e.brand" : v.trim().length < 2 ? "e.brandMin" : ""),
  email: (v) => (!v.trim() ? "e.email" : EMAIL_RE.test(v.trim()) ? "" : "e.emailBad"),
  phone: (v) => (!v.trim() ? "e.phone" : v.trim().length < 8 ? "e.phoneMin" : ""),
  businessOverview: (v) => (!v.trim() ? "e.overview" : v.trim().length < 10 ? "e.overviewMin" : ""),
  productsServices: (v) => (!v.trim() ? "e.offer" : ""),
  targetAudience: (v) => (!v.trim() ? "e.audience" : ""),
  objectives: (v) => (!v.trim() ? "e.goals" : v.trim().length < 10 ? "e.goalsMin" : ""),
  additionalInfo: (v) => (!v.trim() ? "e.notes" : v.trim().length < 10 ? "e.notesMin" : v.length > NOTES_MAX ? "e.notesMax" : ""),
};
const rule = (n) => ({ validate: (v) => RULES[n](v ?? "") || true });

// [id, الـ enum اللي بيتبعت للـ API] — الأسماء المعروضة في القاموس (svc.<id>)
const SERVICES = [
  ["strategy", "STRATEGY"],
  ["branding", "BRANDING"],
  ["content", "CONTENT_CREATION"],
  ["social", "SOCIAL_MEDIA_MANAGEMENT"],
  ["media", "MEDIA_PRODUCTION"],
  ["ads", "ADS_ADVERTISING"],
  ["web", "WEB_DEVELOPMENT"],
  ["ecommerce", "E_COMMERCE"],
  ["mobile", "MOBILE_APPLICATION"],
  ["uiux", "UI_UX_DESIGN"],
  ["all", "ALL"],
];
const ENUM = Object.fromEntries(SERVICES);

const first = (v) => (v.firstName || "").trim();
const STEPS = [
  { key: "welcome", fields: [] },
  { key: "name", fields: ["firstName", "lastName"], title: (v, t) => t("s.name") },
  { key: "brand", fields: ["brand"], title: (v, t) => (first(v) ? t("s.brandN", { name: first(v) }) : t("s.brand")) },
  { key: "contact", fields: ["email", "phone"], title: (v, t) => t("s.contact") },
  { key: "overview", fields: ["businessOverview"], title: (v, t) => t("s.overview", { brand: (v.brand || "").trim() || t("s.yourBusiness") }) },
  { key: "offer", fields: ["productsServices"], title: (v, t) => t("s.offer") },
  { key: "audience", fields: ["targetAudience"], title: (v, t) => t("s.audience") },
  { key: "goals", fields: ["objectives"], title: (v, t) => t("s.goals") },
  { key: "services", fields: [], title: (v, t) => t("s.services") },
  { key: "notes", fields: ["additionalInfo"], title: (v, t) => t("s.notes") },
  { key: "review", fields: [] },
];
const LAST = STEPS.length - 1; // review
const Q = LAST - 1; // عدد الأسئلة

const norm = (s) => (s ? String(s).replace(/[\u0660-\u0669]/g, (d) => d.charCodeAt(0) - 0x0660).replace(/[\u06F0-\u06F9]/g, (d) => d.charCodeAt(0) - 0x06f0) : s);

function Field({ id, label, error, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={`f-${id}`}>{label}</label>
      {children}
      {error && <p id={`${id}-err`} role="alert" className={styles.err}>{error}</p>}
    </div>
  );
}

export default function BriefWizard() {
  const { t } = useLang();
  const { register, trigger, getValues, watch, reset, formState: { errors } } = useForm({
    mode: "onTouched",
    defaultValues: { firstName: "", lastName: "", brand: "", email: "", countryCode: "+20", phone: "", businessOverview: "", productsServices: "", targetAudience: "", objectives: "", additionalInfo: "" },
  });
  const [i, setI] = useState(0);
  const [dir, setDir] = useState("fwd");
  const [leaving, setLeaving] = useState(false);
  const [fromReview, setFromReview] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceError, setServiceError] = useState(""); // بنخزّن المفتاح مش النص
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);
  const [doneName, setDoneName] = useState("");
  const wrapRef = useRef(null);

  const step = STEPS[i];
  const values = watch();
  const notesLen = (values.additionalInfo || "").length;
  const err = (n) => { const m = errors[n]?.message; return m ? t(m) : undefined; };
  const bad = (n) => (errors[n] ? "true" : "false");

  function go(n, d) {
    setDir(d);
    setLeaving(true);
    setTimeout(() => { setI(n); setLeaving(false); }, 240);
  }

  useEffect(() => {
    const el = wrapRef.current;
    if (el && el.getBoundingClientRect().top < -10) el.scrollIntoView({ behavior: "smooth", block: "start" });
    const f = STEPS[i].fields[0];
    const tm = setTimeout(() => {
      const n = f && document.getElementById(`f-${f}`);
      if (n) n.focus({ preventScroll: true });
    }, 380);
    return () => clearTimeout(tm);
  }, [i]);

  async function next() {
    if (leaving || sending) return;
    if (step.fields.length) {
      const ok = await trigger(step.fields);
      if (!ok) {
        const f = step.fields.find((n) => RULES[n](getValues(n) || ""));
        const el = f && document.getElementById(`f-${f}`);
        if (el) el.focus({ preventScroll: true });
        return;
      }
    }
    if (step.key === "services" && services.length === 0) { setServiceError("e.service"); return; }
    setServiceError("");
    go(fromReview ? LAST : i + 1, "fwd");
    setFromReview(false);
  }
  function back() {
    if (i === 0 || leaving) return;
    go(fromReview ? LAST : i - 1, "back");
    setFromReview(false);
  }
  function edit(n) { setFromReview(true); go(n, "back"); }

  function toggleService(id) {
    setServiceError("");
    setServices((cur) => {
      if (id === "all") return cur.includes("all") ? [] : ["all"];
      if (cur.includes("all")) return [id];
      return cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    });
  }

  async function send() {
    if (sending) return;
    const v = getValues();
    for (let k = 1; k < LAST; k++) {
      const st = STEPS[k];
      const badField = st.fields.find((n) => RULES[n](v[n] || ""));
      if (badField || (st.key === "services" && services.length === 0)) {
        setFromReview(true);
        go(k, "back");
        setTimeout(() => trigger(st.fields), 400);
        if (st.key === "services") setServiceError("e.service");
        return;
      }
    }
    setSending(true);
    setServerError("");
    try {
      const fullName = `${v.firstName.trim()} ${v.lastName.trim()}`.trim();
      await submitBrief({
        department: "MODERATOR",
        sender: { fullName: norm(fullName), brand: norm(v.brand.trim()), email: norm(v.email.trim()), phone: norm(v.countryCode + v.phone) },
        mainInfo: {
          bussinessInfo: norm(v.businessOverview.trim()),
          productsOrServices: norm(v.productsServices.trim()),
          targetAudience: norm(v.targetAudience.trim()),
          goalsAndResults: norm(v.objectives.trim()),
          service: services.map((id) => ENUM[id]).filter(Boolean),
          notes: norm(v.additionalInfo.trim()),
        },
      });
      setDoneName(v.firstName.trim());
      reset();
      setServices([]);
      setDone(true);
    } catch (e) {
      setServerError(e?.message || e?.response?.data?.message || "e.server");
    } finally {
      setSending(false);
    }
  }

  function restart() { setDone(false); setFromReview(false); setI(0); setDir("fwd"); }

  const onSubmit = (e) => { e.preventDefault(); if (step.key === "review") send(); else next(); };
  const onKeyDown = (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && step.key !== "review") { e.preventDefault(); next(); } };

  // [id، القيمة، رقم الخطوة، LTR؟]
  const rows = [
    ["name", `${values.firstName} ${values.lastName}`.trim(), 1],
    ["brand", values.brand, 2],
    ["email", values.email, 3, true],
    ["phone", `${values.countryCode} ${values.phone}`, 3, true],
    ["overview", values.businessOverview, 4],
    ["offer", values.productsServices, 5],
    ["audience", values.targetAudience, 6],
    ["goals", values.objectives, 7],
    ["services", null, 8],
    ["notes", values.additionalInfo, 9],
  ];

  /* ---------- الجانب الأيسر (السؤال) ---------- */
  let left;
  if (done) {
    left = (<><span className={styles.eyebrow}>{t("d.eyebrow")}</span><h1 className={styles.q}>{doneName ? t("d.thanksN", { name: doneName }) : t("d.thanks")}</h1><p className={styles.hint}>{t("d.hint")}</p></>);
  } else if (step.key === "welcome") {
    left = (<><span className={styles.eyebrow}><i className={styles.dot} /> {t("w.eyebrow")}</span><h1 className={styles.q}>{t("w.t1")} <span className="gradientText">{t("w.t2")}</span></h1><p className={styles.hint}>{t("w.hint")}</p></>);
  } else if (step.key === "review") {
    left = (<><span className={styles.eyebrow}>{t("a.almost")}</span><h1 className={styles.q}>{t("a.title")}</h1><p className={styles.hint}>{t("a.hint")}</p></>);
  } else {
    left = (<><span className={styles.counter} dir="ltr">{String(i).padStart(2, "0")}<i> / {String(Q).padStart(2, "0")}</i></span><h1 className={styles.q}>{step.title(values, t)}</h1></>);
  }

  /* ---------- الجانب الأيمن (الإجابة) ---------- */
  let right;
  if (done) {
    right = (
      <div className={styles.success} role="status">
        <svg viewBox="0 0 52 52" className={styles.check} aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none" /><path fill="none" d="M15 27l8 8 15-17" /></svg>
        <h2>{t("d.title")}</h2>
        <p>{t("d.text")}</p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>{t("d.home")}</Link>
          <button type="button" className={styles.ghost} onClick={restart}>{t("d.again")}</button>
        </div>
        <div className={styles.confetti} aria-hidden="true">{Array.from({ length: 18 }, (_, n) => <i key={n} style={{ left: `${(n * 53) % 100}%`, animationDelay: `${(n % 6) * 0.15}s`, background: ["#f2b84b", "#de6a2e", "#116a08", "#0a3206"][n % 4] }} />)}</div>
      </div>
    );
  } else if (step.key === "welcome") {
    right = (
      <div>
        <ul className={styles.expect}>
          <li><b>{Q}</b> {t("w.l1")}</li>
          <li>{t("w.l2")}</li>
          <li>{t("w.l3")}</li>
        </ul>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={() => go(1, "fwd")} autoFocus>{t("w.start")} <span aria-hidden="true">→</span></button>
        </div>
      </div>
    );
  } else if (step.key === "services") {
    right = (
      <>
        <p className={styles.label}>{t("sv.q")}</p>
        <div className={styles.chips} role="group" aria-label={t("sv.aria")}>
          {SERVICES.map(([id]) => (
            <button key={id} type="button" aria-pressed={services.includes(id)} className={styles.chip} onClick={() => toggleService(id)}>
              <span className={styles.tick} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg></span>{t(`svc.${id}`)}
            </button>
          ))}
        </div>
        {serviceError && <p role="alert" className={styles.err}>{t(serviceError)}</p>}
      </>
    );
  } else if (step.key === "review") {
    right = (
      <>
        <dl className={styles.sum}>
          {rows.map(([id, val, n, ltr]) => (
            <div className={styles.row} key={id}>
              <dt>{t(`rv.${id}`)}</dt>
              <dd className={ltr ? styles.ltr : undefined}>{id === "services" ? <span className={styles.tags}>{services.map((s) => <i key={s}>{t(`svc.${s}`)}</i>)}</span> : val}</dd>
              <button type="button" className={styles.edit} onClick={() => edit(n)} aria-label={`${t("b.edit")} ${t(`rv.${id}`)}`}>{t("b.edit")}</button>
            </div>
          ))}
        </dl>
        {serverError && <p role="alert" className={styles.server}>{t(serverError)}</p>}
      </>
    );
  } else {
    const F = {
      name: (<div className={styles.two}>
        <Field id="firstName" label={t("fl.first")} error={err("firstName")}><input id="f-firstName" autoComplete="given-name" placeholder={t("ph.first")} aria-invalid={bad("firstName")} aria-describedby="firstName-err" {...register("firstName", rule("firstName"))} /></Field>
        <Field id="lastName" label={t("fl.last")} error={err("lastName")}><input id="f-lastName" autoComplete="family-name" placeholder={t("ph.last")} aria-invalid={bad("lastName")} aria-describedby="lastName-err" {...register("lastName", rule("lastName"))} /></Field>
      </div>),
      brand: (<Field id="brand" label={t("fl.brand")} error={err("brand")}><input id="f-brand" autoComplete="organization" placeholder={t("ph.brand")} aria-invalid={bad("brand")} aria-describedby="brand-err" {...register("brand", rule("brand"))} /></Field>),
      contact: (<>
        <Field id="email" label={t("fl.email")} error={err("email")}><input id="f-email" type="email" autoComplete="email" placeholder={t("ph.email")} aria-invalid={bad("email")} aria-describedby="email-err" {...register("email", rule("email"))} /></Field>
        <div className={styles.phone}>
          <select aria-label={t("f.country")} {...register("countryCode")}>{COUNTRY_CODES.map(([c, n]) => <option key={c} value={c}>{n} ({c})</option>)}</select>
          <Field id="phone" label={t("fl.phone")} error={err("phone")}><input id="f-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder={t("ph.phone")} aria-invalid={bad("phone")} aria-describedby="phone-err" {...register("phone", { ...rule("phone"), onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ""); } })} /></Field>
        </div>
      </>),
      overview: (<Field id="businessOverview" label={t("fl.overview")} error={err("businessOverview")}><textarea id="f-businessOverview" rows={6} placeholder={t("ph.overview")} aria-invalid={bad("businessOverview")} aria-describedby="businessOverview-err" {...register("businessOverview", rule("businessOverview"))} /></Field>),
      offer: (<Field id="productsServices" label={t("fl.offer")} error={err("productsServices")}><textarea id="f-productsServices" rows={5} placeholder={t("ph.offer")} aria-invalid={bad("productsServices")} aria-describedby="productsServices-err" {...register("productsServices", rule("productsServices"))} /></Field>),
      audience: (<Field id="targetAudience" label={t("fl.audience")} error={err("targetAudience")}><textarea id="f-targetAudience" rows={5} placeholder={t("ph.audience")} aria-invalid={bad("targetAudience")} aria-describedby="targetAudience-err" {...register("targetAudience", rule("targetAudience"))} /></Field>),
      goals: (<Field id="objectives" label={t("fl.goals")} error={err("objectives")}><textarea id="f-objectives" rows={6} placeholder={t("ph.goals")} aria-invalid={bad("objectives")} aria-describedby="objectives-err" {...register("objectives", rule("objectives"))} /></Field>),
      notes: (<Field id="additionalInfo" label={t("fl.notes")} error={err("additionalInfo")}><textarea id="f-additionalInfo" rows={6} maxLength={NOTES_MAX} placeholder={t("ph.notes")} aria-invalid={bad("additionalInfo")} aria-describedby="additionalInfo-err" {...register("additionalInfo", rule("additionalInfo"))} /><span className={styles.count} dir="ltr">{notesLen}/{NOTES_MAX}</span></Field>),
    };
    right = F[step.key];
  }

  const showNav = !done && step.key !== "welcome";
  const last = step.key === "review";
  const multiline = ["overview", "offer", "audience", "goals", "notes"].includes(step.key);

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${leaving ? styles.leaving : ""} ${dir === "back" ? styles.back : ""}`}>
      <section className={styles.left}>
        <span className={styles.ring} aria-hidden="true" />
        <div className={styles.lang}><LangToggle /></div>
        {!done && i > 0 && i < LAST && <span key={`m${i}`} className={`${styles.mark} ${styles.anim}`} aria-hidden="true">{String(i).padStart(2, "0")}</span>}
        <div key={`l${i}${done}`} className={`${styles.leftIn} ${styles.anim}`} aria-live="polite">{left}</div>
        {!done && (
          <div className={styles.progress} aria-hidden="true">
            <span style={{ transform: `scaleX(${i / LAST})` }} />
          </div>
        )}
      </section>

      <section className={styles.right}>
        <form key={`r${i}${done}`} className={`${styles.rightIn} ${styles.anim}`} onSubmit={onSubmit} onKeyDown={onKeyDown} noValidate>
          {right}
          {showNav && (
            <div className={styles.actions}>
              {i > 1 || fromReview ? <button type="button" className={styles.ghost} onClick={back}>{fromReview ? t("b.cancel") : t("b.back")}</button> : <span />}
              {last ? (
                <button type="submit" className={styles.primary} disabled={sending}>{sending ? <><span className={styles.spinner} aria-hidden="true" /> {t("b.sending")}</> : <>{t("b.send")} <span aria-hidden="true">→</span></>}</button>
              ) : (
                <button type="submit" className={styles.primary}>{fromReview ? t("b.save") : t("b.continue")} <span aria-hidden="true">→</span></button>
              )}
            </div>
          )}
          {showNav && !last && <p className={styles.keys}>{t("k.press")} <kbd dir="ltr">Enter ↵</kbd>{multiline ? <> {t("k.or")} <kbd dir="ltr">Ctrl/⌘ + Enter</kbd></> : null}</p>}
        </form>
      </section>
    </div>
  );
}
