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

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt_token");
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
