const API_URL = "https://webproject404-backend.darkube.app/api/auth";

// ---- AUTH MANAGEMENT ----
export const setAuthData = (token, username, email, id) => {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
  localStorage.setItem("userId", id);
};

export const getUsername = () => localStorage.getItem("username");
export const getEmail = () => localStorage.getItem("email");
export const getUserId = () => localStorage.getItem("userId");
export const getToken = () => localStorage.getItem("token");

export const removeAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("userId");
};

export const isLoggedIn = () => !!getToken();

// ---- LOGIN ----
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Invalid credentials");
  }

  const data = await res.json();
  setAuthData(data.token, data.username || email, email, data.id || "");
  return data;
}

// ---- SIGNUP ----
export async function signup(username, email, password) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
}

// ---- AUTH FETCH ----
export async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };
  return fetch(url, { ...options, headers });
}

// ---- JWT PARSING ----
export function parseJwt(token) {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}
export async function logout() {
  const token = getToken();
  if (!token) return;

  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const message = await res.text(); // backend sends plain text
  console.log("Logout response:", message);

  removeAuthData();
}



// ---- USERNAME AVAILABILITY ----
export async function checkUsernameAvailability(username, options = {}) {
  if (!username) return true;
  const url = `${API_URL}/check-username?username=${encodeURIComponent(username)}`;
  const fetchOptions = { method: "GET" };
  if (options.signal) fetchOptions.signal = options.signal;

  const res = await fetch(url, fetchOptions);
  if (!res.ok) throw new Error("Failed to check username availability");

  const data = await res.json();
  if (typeof data.available === "boolean") return data.available;
  if (typeof data.exists === "boolean") return !data.exists;
  if (typeof data.taken === "boolean") return !data.taken;
  return !!data?.available;
}