// frontend/lib/premiumClient.js
import { API_BASE_URL } from "../components/config";

export async function postWithEmail(endpoint, body) {
  let email = null;
  if (typeof window !== "undefined") {
    try {
      email = localStorage.getItem("userEmail");
    } catch {}
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, email }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  return { res, data };
}
