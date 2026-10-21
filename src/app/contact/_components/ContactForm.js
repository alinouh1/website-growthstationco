"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitContact } from "@/lib/api";
import { COUNTRY_CODES } from "@/lib/constants";
import { useLang } from "@/components/LangScope";
import styles from "./ContactForm.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// رسائل الأخطاء بتتسجّل كمفاتيح (e.name ...) وبتترجم وقت العرض، فبتتغير فورًا مع زر اللغة
function Field({ id, label, required, error, full, children }) {
  const { t } = useLang();
  return (
    <div className={`${styles.field} ${full ? styles.full : ""}`}>
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <div className={styles.ctl}>{children}<i className={styles.ul} /></div>
      {error && <p id={`${id}-err`} role="alert" className={styles.err}>{t(error.message)}</p>}
    </div>
  );
}

export default function ContactForm() {
  const { t } = useLang();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, submitCount } } = useForm({
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", countryCode: "+20", phone: "", subject: "", message: "" },
  });
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const hasErrors = Object.keys(errors).length > 0;

  async function onSubmit(v) {
    setServerError("");
    try {
      await submitContact({
        fullName: v.fullName.trim(),
        email: v.email.trim(),
        phone: v.countryCode + v.phone,
        message: v.message.trim(),
        subject: v.subject.trim() || "Website Contact Form",
      });
      reset();
      setDone(true);
    } catch (err) {
      setServerError(err?.response?.data?.message || err?.message || "f.fail");
    }
  }

  const bad = (n) => (errors[n] ? "true" : "false");

  return (
    <div className={styles.card}>
      {done ? (
        <div className={styles.success} role="status">
          <svg viewBox="0 0 52 52" className={styles.check} aria-hidden="true">
            <circle cx="26" cy="26" r="24" fill="none" />
            <path fill="none" d="M15 27l8 8 15-17" />
          </svg>
          <h3>{t("f.doneTitle")}</h3>
          <p>{t("f.doneText")}</p>
          <button type="button" className={styles.again} onClick={() => setDone(false)}>{t("f.again")}</button>
        </div>
      ) : (
        <>
          <div className={styles.head}>
            <h2>{t("f.title")}</h2>
            <p>{t("f.sub")}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
            <div className={styles.grid}>
              <Field id="fullName" label={t("f.fullName")} required error={errors.fullName}>
                <input id="fullName" placeholder={t("f.phFullName")} autoComplete="name" aria-invalid={bad("fullName")} aria-describedby="fullName-err"
                  {...register("fullName", { required: "e.name", validate: (v) => v.trim().length >= 2 || "e.nameMin" })} />
              </Field>

              <Field id="email" label={t("f.email")} required error={errors.email}>
                <input id="email" type="email" placeholder={t("f.phEmail")} autoComplete="email" aria-invalid={bad("email")} aria-describedby="email-err"
                  {...register("email", { required: "e.email", validate: (v) => EMAIL_RE.test(v.trim()) || "e.emailBad" })} />
              </Field>

              <Field id="phone" label={t("f.phone")} required error={errors.phone}>
                <div className={styles.phone}>
                  <select aria-label={t("f.country")} {...register("countryCode")}>
                    {COUNTRY_CODES.map(([code, name]) => <option key={code} value={code}>{name} ({code})</option>)}
                  </select>
                  <input id="phone" type="tel" inputMode="numeric" placeholder={t("f.phPhone")} autoComplete="tel-national" aria-invalid={bad("phone")} aria-describedby="phone-err"
                    {...register("phone", {
                      required: "e.phone",
                      minLength: { value: 8, message: "e.phoneMin" },
                      onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ""); },
                    })} />
                </div>
              </Field>

              <Field id="subject" label={t("f.subject")} error={errors.subject}>
                <input id="subject" placeholder={t("f.phSubject")} aria-describedby="subject-err" {...register("subject")} />
              </Field>

              <Field id="message" label={t("f.message")} required full error={errors.message}>
                <textarea id="message" rows={5} placeholder={t("f.phMessage")} aria-invalid={bad("message")} aria-describedby="message-err"
                  {...register("message", { required: "e.msg", validate: (v) => v.trim().length >= 10 || "e.msgMin" })} />
              </Field>
            </div>

            {submitCount > 0 && hasErrors && <p className={styles.hint} role="alert">{t("f.hint")}</p>}
            {serverError && <p className={styles.server} role="alert">{t(serverError)}</p>}

            <div className={styles.actions}>
              <span className={styles.req}><b>*</b> {t("f.required")}</span>
              <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting
                  ? <><span className={styles.spinner} aria-hidden="true" /> {t("f.sending")}</>
                  : <>{t("f.send")} <span className={styles.arrow} aria-hidden="true">→</span></>}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
