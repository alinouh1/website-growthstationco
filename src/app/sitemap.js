import { NAV_LINKS, SITE } from "@/lib/constants";
export default function sitemap() {
  return NAV_LINKS.map((l) => ({ url: `${SITE.url}${l.href === "/" ? "" : l.href}`, lastModified: new Date() }));
}
