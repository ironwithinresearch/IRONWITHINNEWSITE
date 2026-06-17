const SITE = "https://www.ironwithin.io";
const GQL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://bhidasowgm.onrocket.site/graphql";

// Refresh the product list hourly.
export const revalidate = 3600;

export default async function sitemap() {
  let slugs = [];
  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ products(first: 100) { nodes { slug } } }" }),
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    slugs = (json?.data?.products?.nodes || []).map((n) => n.slug).filter(Boolean).filter((s) => s !== 'gift-card');
  } catch {
    slugs = [];
  }

  const now = new Date();
  const staticRoutes = ["", "/shop", "/categories", "/gift-cards", "/lab-reports", "/faq", "/contact", "/affiliate", "/shipping", "/refund", "/terms", "/privacy", "/disclaimer"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: path === "" ? 1 : 0.6,
    })),
    ...slugs.map((slug) => ({
      url: `${SITE}/product/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
