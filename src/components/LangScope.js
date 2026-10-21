"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./rtl.css";

const KEY = "gs-lang";
const Ctx = createContext({ lang: "en", dir: "ltr", setLang: () => {}, t: (k) => k });
export const useLang = () => useContext(Ctx);

// بيلفّ محتوى الصفحة: بيحدد اللغة والاتجاه (dir) للصفحة بس، من غير ما يلمس النافبار أو باقي الموقع
export default function LangScope({ dict, children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s === "ar" || s === "en") setLangState(s);
    } catch {}
  }, []);

  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch {}
  }, []);

  const value = useMemo(() => ({
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    setLang,
    // t("key") أو t("key", { name: "Ali" }) بيبدّل {name} داخل النص
    t: (k, vars) => {
      let s = dict?.[lang]?.[k] ?? dict?.en?.[k] ?? k;
      if (vars && typeof s === "string") s = s.replace(/\{(\w+)\}/g, (_, n) => vars[n] ?? "");
      return s;
    },
  }), [lang, setLang, dict]);

  return (
    <Ctx.Provider value={value}>
      <div className="langScope" dir={value.dir} lang={lang}>{children}</div>
    </Ctx.Provider>
  );
}
