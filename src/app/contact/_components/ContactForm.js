"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitContact } from "@/lib/api";
import { COUNTRY_CODES } from "@/lib/constants";
import styles from "./ContactForm.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ id, label, required, error, full, children }) {
  return (
    <div className={`${styles.field} ${full ? styles.full : ""}`}>
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <div className={styles.ctl}>{children}<i className={styles.ul} /></div>
      {error && <p id={`${id}-err`} role="alert" className={styles.err}>{error.message}</p>}
    </div>
  );
}

export default function ContactForm() {
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
      setServerError(err?.response?.data?.message || err?.message || "Failed to send. Please try again.");
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
          <h3>Message sent</h3>
          <p>Thank you. Our team will contact you soon.</p>
          <button type="button" className={styles.again} onClick={() => setDone(false)}>Send another message</button>
        </div>
      ) : (
        <>
          <div className={styles.head}>
            <h2>Send us a message</h2>
            <p>Fill in the form below and our team will contact you soon.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
            <div className={styles.grid}>
              <Field id="fullName" label="Full name" required error={errors.fullName}>
                <input id="fullName" placeholder="Your full name" autoComplete="name" aria-invalid={bad("fullName")} aria-describedby="fullName-err"
                  {...register("fullName", { required: "Full name is required", validate: (v) => v.trim().length >= 2 || "Name must be at least 2 characters" })} />
              </Field>

              <Field id="email" label="Email" required error={errors.email}>
                <input id="email" type="email" placeholder="name@email.com" autoComplete="email" aria-invalid={bad("email")} aria-describedby="email-err"
                  {...register("email", { required: "Email is required", validate: (v) => EMAIL_RE.test(v.trim()) || "Enter a valid email address" })} />
              </Field>

              <Field id="phone" label="Phone" required error={errors.phone}>
                <div className={styles.phone}>
                  <select aria-label="Country code" {...register("countryCode")}>
                    {COUNTRY_CODES.map(([code, name]) => <option key={code} value={code}>{name} ({code})</option>)}
                  </select>
                  <input id="phone" type="tel" inputMode="numeric" placeholder="Phone number" autoComplete="tel-national" aria-invalid={bad("phone")} aria-describedby="phone-err"
                    {...register("phone", {
                      required: "Phone number is required",
                      minLength: { value: 8, message: "Phone number must be at least 8 digits" },
                      onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ""); },
                    })} />
                </div>
              </Field>

              <Field id="subject" label="Subject" error={errors.subject}>
                <input id="subject" placeholder="What is this about? (optional)" aria-describedby="subject-err" {...register("subject")} />
              </Field>

              <Field id="message" label="Message" required full error={errors.message}>
                <textarea id="message" rows={5} placeholder="Tell us about your project, your goals and your timeline…" aria-invalid={bad("message")} aria-describedby="message-err"
                  {...register("message", { required: "Message is required", validate: (v) => v.trim().length >= 10 || "Message must be at least 10 characters" })} />
              </Field>
            </div>

            {submitCount > 0 && hasErrors && <p className={styles.hint} role="alert">Please fill in the highlighted fields before sending.</p>}
            {serverError && <p className={styles.server} role="alert">{serverError}</p>}

            <div className={styles.actions}>
              <span className={styles.req}><b>*</b> Required fields</span>
              <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? <><span className={styles.spinner} aria-hidden="true" /> Sending…</> : <>Send message <span className={styles.arrow} aria-hidden="true">→</span></>}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}