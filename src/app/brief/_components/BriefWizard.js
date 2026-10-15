"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { submitBrief } from "@/lib/api";
import { COUNTRY_CODES } from "@/lib/constants";
import styles from "./BriefWizard.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTES_MAX = 1000;
const req = (l) => `${l} is required`;
const min = (l, n) => `${l} must be at least ${n} characters`;

// نفس قواعد التحقق القديمة، دالة واحدة لكل حقل (ترجّع نص الخطأ أو "")
const RULES = {
  firstName: (v) => (!v.trim() ? req("First name") : v.trim().length < 2 ? min("First name", 2) : ""),
  lastName: (v) => (!v.trim() ? req("Last name") : v.trim().length < 2 ? min("Last name", 2) : ""),
  brand: (v) => (!v.trim() ? req("Brand name") : v.trim().length < 2 ? min("Brand name", 2) : ""),
  email: (v) => (!v.trim() ? "Email is required" : EMAIL_RE.test(v.trim()) ? "" : "Enter a valid email address"),
  phone: (v) => (!v.trim() ? "Phone number is required" : v.trim().length < 8 ? "Phone number must be at least 8 digits" : ""),
  businessOverview: (v) => (!v.trim() ? "Business overview is required" : v.trim().length < 10 ? min("Business overview", 10) : ""),
  productsServices: (v) => (!v.trim() ? "Products or services are required" : ""),
  targetAudience: (v) => (!v.trim() ? "Target audience is required" : ""),
  objectives: (v) => (!v.trim() ? "Objectives are required" : v.trim().length < 10 ? min("Objectives", 10) : ""),
  additionalInfo: (v) => (!v.trim() ? "This field is required" : v.trim().length < 10 ? "Write at least 10 characters" : v.length > NOTES_MAX ? `Maximum ${NOTES_MAX} characters` : ""),
};
const rule = (n) => ({ validate: (v) => RULES[n](v ?? "") || true });

const SERVICES = [
  ["strategy", "Strategy", "STRATEGY"],
  ["branding", "Branding", "BRANDING"],
  ["content", "Content Creation", "CONTENT_CREATION"],
  ["social", "Social Media Management", "SOCIAL_MEDIA_MANAGEMENT"],
  ["media", "Media Production", "MEDIA_PRODUCTION"],
  ["ads", "Ads & Performance Advertising", "ADS_ADVERTISING"],
  ["web", "Web Development", "WEB_DEVELOPMENT"],
  ["ecommerce", "E-commerce", "E_COMMERCE"],
  ["mobile", "Mobile Application", "MOBILE_APPLICATION"],
  ["uiux", "UI / UX Design", "UI_UX_DESIGN"],
  ["all", "All Services", "ALL"],
];
const ENUM = Object.fromEntries(SERVICES.map(([id, , e]) => [id, e]));
const LABEL = Object.fromEntries(SERVICES.map(([id, l]) => [id, l]));

const first = (v) => (v.firstName || "").trim();
const STEPS = [
  { key: "welcome", fields: [] },
  { key: "name", fields: ["firstName", "lastName"], title: () => "First things first. What's your name?" },
  { key: "brand", fields: ["brand"], title: (v) => `Nice to meet you${first(v) ? `, ${first(v)}` : ""}. Which brand are we talking about?` },
  { key: "contact", fields: ["email", "phone"], title: () => "How can we reach you?" },
  { key: "overview", fields: ["businessOverview"], title: (v) => `Tell us about ${(v.brand || "").trim() || "your business"}.` },
  { key: "offer", fields: ["productsServices"], title: () => "What do you offer?" },
  { key: "audience", fields: ["targetAudience"], title: () => "Who is it for?" },
  { key: "goals", fields: ["objectives"], title: () => "What does success look like?" },
  { key: "services", fields: [], title: () => "What do you need from us?" },
  { key: "notes", fields: ["additionalInfo"], title: () => "Anything else we should know?" },
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
  const { register, trigger, getValues, watch, reset, formState: { errors } } = useForm({
    mode: "onTouched",
    defaultValues: { firstName: "", lastName: "", brand: "", email: "", countryCode: "+20", phone: "", businessOverview: "", productsServices: "", targetAudience: "", objectives: "", additionalInfo: "" },
  });
  const [i, setI] = useState(0);
  const [dir, setDir] = useState("fwd");
  const [leaving, setLeaving] = useState(false);
  const [fromReview, setFromReview] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceError, setServiceError] = useState("");
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);
  const [doneName, setDoneName] = useState("");
  const wrapRef = useRef(null);

  const step = STEPS[i];
  const values = watch();
  const notesLen = (values.additionalInfo || "").length;
  const err = (n) => errors[n]?.message;
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
    const t = setTimeout(() => {
      const n = f && document.getElementById(`f-${f}`);
      if (n) n.focus({ preventScroll: true });
    }, 380);
    return () => clearTimeout(t);
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
    if (step.key === "services" && services.length === 0) { setServiceError("Please select at least one service"); return; }
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
        if (st.key === "services") setServiceError("Please select at least one service");
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
      setServerError(e?.message || e?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function restart() { setDone(false); setFromReview(false); setI(0); setDir("fwd"); }

  const onSubmit = (e) => { e.preventDefault(); if (step.key === "review") send(); else next(); };
  const onKeyDown = (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && step.key !== "review") { e.preventDefault(); next(); } };

  const rows = [
    ["Name", `${values.firstName} ${values.lastName}`.trim(), 1],
    ["Brand", values.brand, 2],
    ["Email", values.email, 3],
    ["Phone", `${values.countryCode} ${values.phone}`, 3],
    ["Overview", values.businessOverview, 4],
    ["Offer", values.productsServices, 5],
    ["Audience", values.targetAudience, 6],
    ["Goals", values.objectives, 7],
    ["Services", null, 8],
    ["Notes", values.additionalInfo, 9],
  ];

  /* ---------- الجانب الأيسر (السؤال) ---------- */
  let left;
  if (done) {
    left = (<><span className={styles.eyebrow}>All done</span><h1 className={styles.q}>Thank you{doneName ? `, ${doneName}` : ""}.</h1><p className={styles.hint}>Your brief is on its way to our team.</p></>);
  } else if (step.key === "welcome") {
    left = (<><span className={styles.eyebrow}><i className={styles.dot} /> Client onboarding</span><h1 className={styles.q}>Project <span className="gradientText">Brief</span></h1><p className={styles.hint}>Help us understand your business, goals, and vision — so we can build something remarkable together.</p></>);
  } else if (step.key === "review") {
    left = (<><span className={styles.eyebrow}>Almost there</span><h1 className={styles.q}>Here&apos;s your brief.</h1><p className={styles.hint}>Check everything, then send it our way. You can edit any answer.</p></>);
  } else {
    left = (<><span className={styles.counter}>{String(i).padStart(2, "0")}<i> / {String(Q).padStart(2, "0")}</i></span><h1 className={styles.q}>{step.title(values)}</h1></>);
  }

  /* ---------- الجانب الأيمن (الإجابة) ---------- */
  let right;
  if (done) {
    right = (
      <div className={styles.success} role="status">
        <svg viewBox="0 0 52 52" className={styles.check} aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none" /><path fill="none" d="M15 27l8 8 15-17" /></svg>
        <h2>Brief sent successfully!</h2>
        <p>Thank you for your interest. We&apos;ll review your brief and get back to you within 24 hours.</p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>Back to home</Link>
          <button type="button" className={styles.ghost} onClick={restart}>Send another brief</button>
        </div>
        <div className={styles.confetti} aria-hidden="true">{Array.from({ length: 18 }, (_, n) => <i key={n} style={{ left: `${(n * 53) % 100}%`, animationDelay: `${(n % 6) * 0.15}s`, background: ["#f2b84b", "#de6a2e", "#116a08", "#0a3206"][n % 4] }} />)}</div>
      </div>
    );
  } else if (step.key === "welcome") {
    right = (
      <div>
        <ul className={styles.expect}>
          <li><b>{Q}</b> short questions, one at a time</li>
          <li>Go back and edit any answer</li>
          <li>We reply within 24 hours</li>
        </ul>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={() => go(1, "fwd")} autoFocus>Start the brief <span aria-hidden="true">→</span></button>
        </div>
      </div>
    );
  } else if (step.key === "services") {
    right = (
      <>
        <p className={styles.label}>Which service(s) are you interested in?</p>
        <div className={styles.chips} role="group" aria-label="Services">
          {SERVICES.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={services.includes(id)} className={styles.chip} onClick={() => toggleService(id)}>
              <span className={styles.tick} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg></span>{label}
            </button>
          ))}
        </div>
        {serviceError && <p role="alert" className={styles.err}>{serviceError}</p>}
      </>
    );
  } else if (step.key === "review") {
    right = (
      <>
        <dl className={styles.sum}>
          {rows.map(([label, val, n]) => (
            <div className={styles.row} key={label}>
              <dt>{label}</dt>
              <dd>{label === "Services" ? <span className={styles.tags}>{services.map((id) => <i key={id}>{LABEL[id]}</i>)}</span> : val}</dd>
              <button type="button" className={styles.edit} onClick={() => edit(n)} aria-label={`Edit ${label}`}>Edit</button>
            </div>
          ))}
        </dl>
        {serverError && <p role="alert" className={styles.server}>{serverError}</p>}
      </>
    );
  } else {
    const F = {
      name: (<div className={styles.two}>
        <Field id="firstName" label="First name" error={err("firstName")}><input id="f-firstName" autoComplete="given-name" placeholder="First name" aria-invalid={bad("firstName")} aria-describedby="firstName-err" {...register("firstName", rule("firstName"))} /></Field>
        <Field id="lastName" label="Last name" error={err("lastName")}><input id="f-lastName" autoComplete="family-name" placeholder="Last name" aria-invalid={bad("lastName")} aria-describedby="lastName-err" {...register("lastName", rule("lastName"))} /></Field>
      </div>),
      brand: (<Field id="brand" label="Your brand" error={err("brand")}><input id="f-brand" autoComplete="organization" placeholder="Brand name" aria-invalid={bad("brand")} aria-describedby="brand-err" {...register("brand", rule("brand"))} /></Field>),
      contact: (<>
        <Field id="email" label="Email" error={err("email")}><input id="f-email" type="email" autoComplete="email" placeholder="name@email.com" aria-invalid={bad("email")} aria-describedby="email-err" {...register("email", rule("email"))} /></Field>
        <div className={styles.phone}>
          <select aria-label="Country code" {...register("countryCode")}>{COUNTRY_CODES.map(([c, n]) => <option key={c} value={c}>{n} ({c})</option>)}</select>
          <Field id="phone" label="Phone" error={err("phone")}><input id="f-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="Phone number" aria-invalid={bad("phone")} aria-describedby="phone-err" {...register("phone", { ...rule("phone"), onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ""); } })} /></Field>
        </div>
      </>),
      overview: (<Field id="businessOverview" label="Please provide a brief overview of your business or brand?" error={err("businessOverview")}><textarea id="f-businessOverview" rows={6} placeholder="What do you do, and what makes it special?" aria-invalid={bad("businessOverview")} aria-describedby="businessOverview-err" {...register("businessOverview", rule("businessOverview"))} /></Field>),
      offer: (<Field id="productsServices" label="What are your primary products or services?" error={err("productsServices")}><textarea id="f-productsServices" rows={5} placeholder="Your main products or services" aria-invalid={bad("productsServices")} aria-describedby="productsServices-err" {...register("productsServices", rule("productsServices"))} /></Field>),
      audience: (<Field id="targetAudience" label="Who is your target audience?" error={err("targetAudience")}><textarea id="f-targetAudience" rows={5} placeholder="Who are your customers?" aria-invalid={bad("targetAudience")} aria-describedby="targetAudience-err" {...register("targetAudience", rule("targetAudience"))} /></Field>),
      goals: (<Field id="objectives" label="What are your main objectives for this project and what results would you like to achieve?" error={err("objectives")}><textarea id="f-objectives" rows={6} placeholder="Your goals and the results you want" aria-invalid={bad("objectives")} aria-describedby="objectives-err" {...register("objectives", rule("objectives"))} /></Field>),
      notes: (<Field id="additionalInfo" label="Is there anything else you would like us to know about your project, notes, or requirements?" error={err("additionalInfo")}><textarea id="f-additionalInfo" rows={6} maxLength={NOTES_MAX} placeholder="Notes, requirements, deadlines…" aria-invalid={bad("additionalInfo")} aria-describedby="additionalInfo-err" {...register("additionalInfo", rule("additionalInfo"))} /><span className={styles.count}>{notesLen}/{NOTES_MAX}</span></Field>),
    };
    right = F[step.key];
  }

  const showNav = !done && step.key !== "welcome";
  const last = step.key === "review";

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${leaving ? styles.leaving : ""} ${dir === "back" ? styles.back : ""}`}>
      <section className={styles.left}>
        <span className={styles.ring} aria-hidden="true" />
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
              {i > 1 || fromReview ? <button type="button" className={styles.ghost} onClick={back}>{fromReview ? "Cancel" : "Back"}</button> : <span />}
              {last ? (
                <button type="submit" className={styles.primary} disabled={sending}>{sending ? <><span className={styles.spinner} aria-hidden="true" /> Sending…</> : <>Send brief <span aria-hidden="true">→</span></>}</button>
              ) : (
                <button type="submit" className={styles.primary}>{fromReview ? "Save" : "Continue"} <span aria-hidden="true">→</span></button>
              )}
            </div>
          )}
          {showNav && !last && <p className={styles.keys}>press <kbd>Enter ↵</kbd>{step.key === "overview" || step.key === "offer" || step.key === "audience" || step.key === "goals" || step.key === "notes" ? <> or <kbd>Ctrl/⌘ + Enter</kbd></> : null}</p>}
        </form>
      </section>
    </div>
  );
}
