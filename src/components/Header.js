"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/constants";
import logo from "@/assets/images/logo/logo-mark.svg";
import styles from "./Header.module.css";

// عدّل القايمة من هنا (بتستخدم للديسكتوب والموبايل)
const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Brief", href: "/brief" },
  { label: "Contact US", href: "/contact" },
];

export default function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Home بالظبط بس، وباقي الصفحات تشتغل حتى لو فيها صفحات فرعية (/services/web)
  const isActive = (href) =>
    href === "/" ? path === "/" : path === href || path.startsWith(href + "/");

  useEffect(() => {
    let last = false;
    const onScroll = () => {
      const s = window.scrollY > 12;
      if (s !== last) { last = s; setScrolled(s); }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.logo} aria-label={`${SITE.name} home`}>
          <Image src={logo} alt="" width={30} height={40} priority />
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`${styles.link} ${isActive(l.href) ? styles.active : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <Link href="/brief" className={styles.cta}>Get Started</Link>
          <button
            className={`${styles.burger} ${open ? styles.x : ""}`}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            tabIndex={open ? 0 : -1}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`${styles.mlink} ${isActive(l.href) ? styles.mactive : ""}`}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/brief" tabIndex={open ? 0 : -1} className={styles.mcta}>Get Started</Link>
      </div>
    </header>
  );
}