// src/app/shop/page.js — server component.
// ISR-prefetches the product list so the grid paints instantly (no client-side
// GraphQL wait on first load). The client grid (ShopClient) takes over for
// filters/search and refreshes live stock. Metadata lives in shop/layout.js.

import ShopClient from './ShopClient';

export const revalidate = 300; // rebuild the prefetched list every 5 min

const WP_GRAPHQL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://bhidasowgm.onrocket.site/graphql';

const PRODUCTS_QUERY = `query ShopInitial {
  products(first: 100) {
    nodes {
      id databaseId name slug shortDescription
      image { sourceUrl altText }
      productCategories { nodes { name slug } }
      ... on SimpleProduct { price salePrice regularPrice onSale stockStatus }
      ... on VariableProduct {
        price regularPrice onSale
        variations(first: 100) { nodes { id price regularPrice stockStatus stockQuantity } }
      }
    }
  }
}`;

async function getInitialProducts() {
  try {
    const res = await fetch(WP_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: PRODUCTS_QUERY }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.products?.nodes || [];
  } catch {
    return []; // on any failure, ShopClient falls back to its own client fetch (unchanged behavior)
  }
}

export default async function ShopPage() {
  const initialProducts = await getInitialProducts();
  return <ShopClient initialProducts={initialProducts} />;
}
