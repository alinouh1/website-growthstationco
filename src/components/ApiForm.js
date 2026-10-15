"use client";
import { useState } from "react";
import styles from "./ApiForm.module.css";

export default function ApiForm({ fields, onSubmit, submitLabel = "Send", successMessage = "Sent. Thank you!" }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handle(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const values = {};
    for (const f of fields) {
      values[f.name] = f.type === "file" ? form.elements[f.name].files[0] : form.elements[f.name].value;
    }
    try {
      await onSubmit(values);
      form.reset();
      setStatus("done");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form className={styles.form} onSubmit={handle}>
      {fields.map((f) => (
        <label key={f.name} className={styles.field}>
          <span>{f.label}{f.required ? " *" : ""}</span>
          {f.type === "textarea" ? (
            <textarea name={f.name} rows={5} required={f.required} />
          ) : (
            <input name={f.name} type={f.type || "text"} required={f.required} accept={f.accept} />
          )}
        </label>
      ))}
      <button type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending…" : submitLabel}</button>
      {status === "done" && <p role="status" className={styles.ok}>{successMessage}</p>}
      {status === "error" && <p role="alert" className={styles.err}>{error}</p>}
    </form>
  );
}
