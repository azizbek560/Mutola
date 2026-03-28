const API_BASE = "http://83.229.85.64";

function getToken() {
  return localStorage.getItem("token") || "";
}

export function setToken(t) {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
}

export async function getJSON(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error("API error: " + res.status);
  return res.json();
}

export async function authJSON(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: "Token " + token } : {}),
  };
  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.detail || ("API error: " + res.status);
    const err = new Error(msg);
    err.data = data;
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function authForm(path, formData) {
  const token = getToken();
  const headers = token ? { Authorization: "Token " + token } : {};
  const res = await fetch(API_BASE + path, { method: "POST", headers, body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.detail || ("API error: " + res.status);
    const err = new Error(msg);
    err.data = data;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const isLoggedIn = () => !!getToken();
