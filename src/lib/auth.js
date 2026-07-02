// src/lib/auth.js

export async function loginUser(username, password) {
  const res = await fetch(process.env.NEXT_PUBLIC_JWT_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("jwt_token", data.token);
    // Store user info
    localStorage.setItem("iwr_user", JSON.stringify({
      email: data.user_email,
      name: data.user_display_name,
      nicename: data.user_nicename,
    }));
    return { success: true, user: data };
  }

  return { success: false, error: data.message || "Login failed" };
}

export function logoutUser() {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("woo_session");
  localStorage.removeItem("iwr_user");
}

// Read the `exp` claim (ms) from a JWT without verifying the signature.
function tokenExpMs(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export function isTokenExpired(token) {
  if (!token) return true;
  const exp = tokenExpMs(token);
  if (!exp) return false; // no exp claim — can't tell, so don't force a logout
  return Date.now() >= exp;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;
  // An expired token still "looks" logged in but the server treats it as a guest and
  // silently returns empty orders/profile. Clear it so the UI honestly shows logged-out
  // and prompts a fresh login (which restores the order history).
  if (isTokenExpired(token)) {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("iwr_user");
    localStorage.removeItem("woo_session");
    return null;
  }
  return token;
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const u = localStorage.getItem("iwr_user");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getToken();
}
