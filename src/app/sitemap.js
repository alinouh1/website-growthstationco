import { NAV_LINKS, SITE } from "@/lib/constants";
export const dynamic = "force-static";
export default function sitemap() {
  return NAV_LINKS.map((l) => ({ url: `${SITE.url}${l.href === "/" ? "" : l.href}`, lastModified: new Date() }));
}
