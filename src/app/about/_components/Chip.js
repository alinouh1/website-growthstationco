import styles from "./Chip.module.css";
export default function Chip({ children }) {
  return <span className={styles.chip}><i />{children}</span>;
}
