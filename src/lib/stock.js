// Low-stock helper for product cards. Returns the count to show ("Only N left")
// when total available stock is at/under the threshold, else null.
export function lowStockCount(product, threshold = 10) {
  const vars = product?.variations?.nodes || [];
  if (!vars.length) {
    const q = product?.stockQuantity;
    return q != null && q > 0 && q <= threshold ? q : null;
  }
  const inStock = vars.filter((v) => v.stockStatus === 'IN_STOCK' && v.stockQuantity != null);
  if (!inStock.length) return null;
  const total = inStock.reduce((s, v) => s + (v.stockQuantity || 0), 0);
  return total > 0 && total <= threshold ? total : null;
}
