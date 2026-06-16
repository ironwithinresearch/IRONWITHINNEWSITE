const GQL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://bhidasowgm.onrocket.site/graphql";
const SITE = "https://www.ironwithin.io";

// ISR: statically generate product pages and re-build them every 10 minutes.
// This moves the metadata GraphQL fetch to build/revalidation (off the request
// path) so product pages serve from cache (~0.2s TTFB) instead of re-rendering
// dynamically on every visit. Live stock still loads client-side (the product
// page's Apollo query is fetchPolicy:'no-cache'), so stock stays real-time.
export const revalidate = 600;

export async function generateStaticParams() {
  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ products(first: 100) { nodes { slug } } }" }),
      next: { revalidate: 3600 },
    });
    const nodes = (await res.json())?.data?.products?.nodes || [];
    return nodes.filter((n) => n?.slug).map((n) => ({ slug: n.slug }));
  } catch {
    return []; // fall back to on-demand rendering if GraphQL is unreachable at build
  }
}

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
