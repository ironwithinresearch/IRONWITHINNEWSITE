const GQL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://bhidasowgm.onrocket.site/graphql";
const SITE = "https://www.ironwithin.io";

const strip = (h) => (h || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query ($slug: ID!) { product(id: $slug, idType: SLUG) { name shortDescription image { sourceUrl } } }`,
        variables: { slug },
      }),
      next: { revalidate: 3600 },
    });
    const p = (await res.json())?.data?.product;
    if (!p) return { title: "Product" };

    const desc =
      strip(p.shortDescription).slice(0, 160) ||
      `${p.name} — research-grade peptide, independently third-party lab-tested. For research use only.`;
    const img = p.image?.sourceUrl;

    return {
      title: p.name,
      description: desc,
      alternates: { canonical: `/product/${slug}` },
      openGraph: {
        type: "website",
        url: `${SITE}/product/${slug}`,
        title: `${p.name} | Iron Within Research`,
        description: desc,
        images: img ? [{ url: img }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: p.name,
        description: desc,
        images: img ? [img] : undefined,
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default function ProductLayout({ children }) {
  return children;
}
