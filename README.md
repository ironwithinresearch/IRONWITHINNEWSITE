# FIXES — What Was Wrong & What to Replace

## ROOT CAUSE SUMMARY

1. **Apollo Client** — session token wasn't being captured correctly from WooCommerce response headers
2. **Product route** — folder was named `[id]` but queries use slugs — needs to be `[slug]`
3. **Cart mutations** — variationId wasn't passed correctly, cache wasn't updating after mutations
4. **Forgot password** — was a fake setTimeout, now connected to real GraphQL mutation
5. **Checkout** — paymentMethod was missing, causing WooCommerce to reject orders
6. **CartContext** — wasn't writing back to Apollo cache after mutations, causing stale UI

---

## FILES TO REPLACE (copy these into your project)

| This file | Replaces |
|---|---|
| `src/lib/apollo-client.js` | `src/lib/apollo-client.js` |
| `src/lib/queries/products.js` | `src/lib/queries/products.js` |
| `src/lib/queries/cart.js` | `src/lib/queries/cart.js` |
| `src/lib/queries/checkout.js` | `src/lib/queries/checkout.js` |
| `src/lib/queries/auth.js` | `src/lib/queries/auth.js` |
| `src/context/CartContext.jsx` | `src/context/CartContext.jsx` |
| `src/app/shop/page.js` | `src/app/shop/page.js` |
| `src/app/product/[slug]/page.js` | `src/app/product/[id]/page.js` — SEE NOTE BELOW |
| `src/app/forgot-password/page.js` | `src/app/forgot-password/page.js` |

---

## CRITICAL — RENAME THE PRODUCT FOLDER

```bash
# In your project root, run:
mv src/app/product/\[id\] src/app/product/\[slug\]
```

Then replace the page.js inside with the new one provided.
All product links use slugs (`/product/v-neck-t-shirt`), not numeric IDs.

---

## CHECKOUT — TEST WITHOUT STRIPE FIRST

The checkout is set to `paymentMethod: 'cod'` (Cash on Delivery) by default.
This lets you test the full order flow without Stripe.

To test:
1. Add products to cart
2. Go to checkout
3. Fill in billing/shipping info
4. Click "Place Order"
5. Order should appear in WooCommerce → Orders

Once orders are working, integrate Stripe:
- Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
- Collect card → get `paymentIntent.id` from Stripe
- Pass it as `transactionId` in `buildCheckoutInput`
- Change `paymentMethod` to `'stripe'`

---

## AFTER REPLACING FILES

```bash
npm install
npm run dev
```

Then test in this order:
1. Visit `/shop` — should show real products from WooCommerce
2. Click a product — should go to `/product/[slug]`
3. Click "Add to Cart" — should update cart count in navbar
4. Visit `/cart` — should show cart items with update/remove working
5. Register new account at `/register`
6. Login at `/login`
7. Visit `/checkout` — fill form, place order
8. Check `/orders` — order should appear
9. Test `/forgot-password` — sends real email now

---

## ENV CHECK

Make sure `.env.local` has these (they should already be there):
```
NEXT_PUBLIC_WORDPRESS_URL=https://bhidasowgm.onrocket.site
NEXT_PUBLIC_GRAPHQL_URL=https://bhidasowgm.onrocket.site/graphql
NEXT_PUBLIC_JWT_AUTH_URL=https://bhidasowgm.onrocket.site/wp-json/jwt-auth/v1/token
```
