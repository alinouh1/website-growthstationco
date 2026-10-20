import Image from "next/image";
import { pics } from "../../assets/images/pages";
import styles from "./Gallery.module.css";

// كل صف لازم يكون فيه صور كفاية عشان الشريط يملا العرض
const fill = (a) => { let r = [...a]; while (r.length && r.length < 8) r = r.concat(a); return r; };
const half = Math.ceil(pics.length / 2);
const rows = [fill(pics.slice(0, half)), fill(pics.slice(half).length ? pics.slice(half) : pics.slice(0, half))];

function Lane({ imgs, rev }) {
  return (
    <div className={styles.lane}>
      <div className={`${styles.track} ${rev ? styles.rev : ""}`}>
        {[0, 1].map((g) => (
          <div key={g} className={styles.group} aria-hidden={g === 1 ? "true" : undefined}>
            {imgs.map((src, i) => (
              <figure key={i} className={styles.item}>
                <Image src={src} alt="" fill placeholder="blur" quality={75} sizes="(max-width:700px) 220px, 340px" />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <section className={styles.wrap} aria-label="Selected work">
      <p className={styles.kicker}>Our work</p>
      <Lane imgs={rows[0]} />
      <Lane imgs={rows[1]} rev />
    </section>
  );
}
