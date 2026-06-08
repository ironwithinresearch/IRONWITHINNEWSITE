This is is read me file
# Iron Within Research — GraphQL API Integration

## What's In This ZIP

### New Files
```
src/
  lib/
    apollo-client.js      ← Apollo Client setup (session + auth links)
    auth.js               ← loginUser, logoutUser, getToken helpers
    ApolloWrapper.jsx     ← Wraps app with Apollo + Auth + Cart providers
    queries/
      auth.js             ← registerCustomer, getViewer, sendPasswordReset
      products.js         ← getProducts, getProduct, getCategories, search
      cart.js             ← getCart, addToCart, updateItem, removItem, coupons
      checkout.js         ← checkout mutation + buildCheckoutInput helper
      orders.js           ← getOrders, getOrder, getCustomer
  context/
    AuthContext.jsx        ← useAuth() hook — login/logout/user state
    CartContext.jsx        ← useCart() hook — live WooCommerce cart
  app/
    layout.js             ← UPDATED — wrapped with ApolloWrapper
    login/page.js         ← UPDATED — connected to JWT auth
    register/page.js      ← UPDATED — connected to registerCustomer mutation
    shop/page.js          ← UPDATED — live products from GraphQL
    cart/page.js          ← UPDATED — live WooCommerce cart
    orders/page.js        ← UPDATED — live orders from GraphQL
    account/page.js       ← UPDATED — live customer profile
.env.local                ← Pre-filled with your real URLs
package.json              ← Apollo Client + GraphQL dependencies added
```

---

## Setup — 4 Steps

### Step 1 — Install dependencies
```bash
npm install
# or if you get errors:
npm install @apollo/client graphql
```

### Step 2 — Add .env.local
Copy the `.env.local` from this ZIP into your project root. Fill in:
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` — from stripe.com dashboard
- `STRIPE_SECRET_KEY` — from stripe.com dashboard
- `WC_CONSUMER_KEY` + `WC_CONSUMER_SECRET` — from WooCommerce → Settings → Advanced → REST API

### Step 3 — Replace files
Copy every file from this ZIP into your project, keeping the same folder structure.

### Step 4 — Run
```bash
npm run dev
```

---

## How It Works

### Authentication Flow
1. User fills login form → `useAuth().login(username, password)`
2. Calls `POST /wp-json/jwt-auth/v1/token` with credentials
3. JWT token stored in `localStorage` as `jwt_token`
4. Every Apollo request sends `Authorization: Bearer <token>` header
5. `AuthContext` exposes `isLoggedIn`, `user`, `logout` everywhere

### Cart Flow  
1. `CartContext` runs `GET_CART` query on mount
2. WooCommerce returns session token in response header
3. `sessionLink` in Apollo captures and stores it as `woo_session`
4. Every subsequent request sends `woocommerce-session: Session <token>`
5. `useCart()` exposes `addToCart`, `removeItem`, `updateQuantity`, `applyCoupon`

### Usage in any component
```jsx
// Auth
import { useAuth } from '@/context/AuthContext';
const { isLoggedIn, user, login, logout } = useAuth();

// Cart
import { useCart } from '@/context/CartContext';
const { cartItems, itemCount, addToCart, cartTotal } = useCart();

// Products query
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/queries/products';
const { data, loading } = useQuery(GET_PRODUCTS, { variables: { first: 20 } });
```

---

## GraphQL Endpoint
```
https://bhidasowgm.onrocket.site/graphql
```

## Test in GraphiQL IDE
```
https://bhidasowgm.onrocket.site/wp-admin/admin.php?page=graphiql-ide
```

## JWT Auth URL
```
POST https://bhidasowgm.onrocket.site/wp-json/jwt-auth/v1/token
Body: { "username": "developer", "password": "your-password-123" }
```
