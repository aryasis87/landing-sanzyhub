import { SITE, TEMPLATE } from "@/lib/template";

export default function sitemap() {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/lisensi`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...TEMPLATE.map((t) => ({ url: `${SITE}/template/${t.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 })),
  ];
}
