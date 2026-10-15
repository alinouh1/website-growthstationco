import { readdirSync, copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const src = "src/assets/images/service";
const out = "src/assets/images/pages";
mkdirSync(out, { recursive: true });

const files = readdirSync(src)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const names = files.map((f, i) => {
  const n = `img-${String(i + 1).padStart(2, "0")}${extname(f).toLowerCase()}`;
  copyFileSync(join(src, f), join(out, n));
  return n;
});

const code =
  names.map((n, i) => `import i${i} from "./${n}";`).join("\n") +
  `\n\nexport const pics = [${names.map((_, i) => `i${i}`).join(", ")}];\n`;
writeFileSync(join(out, "index.js"), code);
console.log(`${names.length} images -> ${out}`);
