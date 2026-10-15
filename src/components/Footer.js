import { SITE } from "@/lib/constants";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} {SITE.name}</p>
      <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
    </footer>
  );
}
