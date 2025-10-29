import { useEffect, useState } from "react";
import { API_BASE_URL } from "../components/config";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [extendLoading, setExtendLoading] = useState(false);
  const [months, setMonths] = useState(1);
  const [adminKey, setAdminKey] = useState("");
  const [jobResult, setJobResult] = useState(null);

  useEffect(() => {
    // Load email from localStorage (saved at login/signup flows)
    if (typeof window !== "undefined") {
      try {
        const e = localStorage.getItem("userEmail");
        if (e) setEmail(e);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const loadStatus = async () => {
      if (!email) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/subscription-status?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch status");
        }
        setStatus(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadStatus();
  }, [email]);

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleExtend = async () => {
    if (!email) {
      alert("Missing email; please login.");
      return;
    }
    setExtendLoading(true);
    setError(null);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Razorpay SDK failed to load.");

      const amountRupees = 200 * months; // simple pricing: ₹200/month
      const res = await fetch(`${API_BASE_URL}/api/razorpay/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount_rupees: amountRupees, currency: "INR", email, plan: `Extend ${months}m` }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order?.error || "Failed to create order");

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "PDFVille",
        description: `Extend subscription (${months} month${months>1?'s':''})`,
        order_id: order.order_id,
        prefill: { email },
        notes: { plan: `Extend ${months}m`, email },
        theme: { color: "#667eea" },
        handler: async function (resp) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                email,
                amount: order.amount,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.verified) {
              throw new Error(verifyData?.error || "Verification failed");
            }
            // Refresh status
            const sres = await fetch(`${API_BASE_URL}/api/users/subscription-status?email=${encodeURIComponent(email)}`);
            const sdata = await sres.json();
            if (sres.ok) setStatus(sdata);
            alert("Subscription extended successfully.");
          } catch (e) {
            setError(e.message);
          }
        },
      };

      const rz = new window.Razorpay(options);
      rz.on("payment.failed", function (resp) {
        setError(resp?.error?.description || "Payment failed");
      });
      rz.open();
    } catch (e) {
      setError(e.message);
    } finally {
      setExtendLoading(false);
    }
  };

  const runDowngradeJob = async () => {
    setJobResult(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/subscriptions/downgrade-expired`, {
        method: "POST",
        headers: { "X-Admin-Key": adminKey, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Job failed");
      setJobResult(data);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Account Dashboard</h1>

        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.06)", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Subscription Status</h2>
          {loading ? (
            <p>Loading status...</p>
          ) : error ? (
            <p style={{ color: "#dc2626" }}>Error: {error}</p>
          ) : status ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ color: "#6b7280" }}>Email</div>
                <div style={{ fontWeight: 600 }}>{status.email}</div>
              </div>
              <div>
                <div style={{ color: "#6b7280" }}>Plan</div>
                <div style={{ fontWeight: 600 }}>{status.subscription_status || "basic"}</div>
              </div>
              <div>
                <div style={{ color: "#6b7280" }}>Premium Active</div>
                <div style={{ fontWeight: 600 }}>{status.is_pro ? "Yes" : "No"}</div>
              </div>
              <div>
                <div style={{ color: "#6b7280" }}>Expiry</div>
                <div style={{ fontWeight: 600 }}>{formatDate(status.subscription_expiry)}</div>
              </div>
            </div>
          ) : (
            <p>No status found.</p>
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.06)", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Extend Subscription</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label>Months:</label>
            <select value={months} onChange={(e) => setMonths(parseInt(e.target.value))}>
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={12}>12</option>
            </select>
            <button
              onClick={handleExtend}
              disabled={extendLoading}
              style={{
                background: "#667eea",
                color: "#fff",
                border: "none",
                padding: "0.6rem 1rem",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {extendLoading ? "Processing..." : `Pay ₹${200 * months} to Extend`}
            </button>
          </div>
          <p style={{ color: "#6b7280", marginTop: 10 }}>Price: ₹200 per month. Extending adds 30 days per month to expiry.</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.06)", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Last Payment</h2>
          {status && status.payment_id ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ color: "#6b7280" }}>Payment ID</div>
                <div style={{ fontWeight: 600 }}>{status.payment_id}</div>
              </div>
              <div>
                <div style={{ color: "#6b7280" }}>Amount</div>
                <div style={{ fontWeight: 600 }}>₹{status.payment_amount || "—"}</div>
              </div>
              <div>
                <div style={{ color: "#6b7280" }}>Date</div>
                <div style={{ fontWeight: 600 }}>{formatDate(status.payment_date)}</div>
              </div>
              <div>
                <div style={{ color: "#6b7280" }}>Method</div>
                <div style={{ fontWeight: 600 }}>{status.payment_method || "—"}</div>
              </div>
            </div>
          ) : (
            <p>No recent payment on record.</p>
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Admin Controls</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <input
              type="password"
              placeholder="Admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              style={{ flex: 1, padding: "0.6rem", borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
            <button
              onClick={runDowngradeJob}
              style={{ background: "#ef4444", color: "#fff", border: "none", padding: "0.6rem 1rem", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}
            >
              Run Downgrade Job
            </button>
          </div>
          {jobResult && (
            <div style={{ color: "#065f46", background: "#d1fae5", borderRadius: 8, padding: 10 }}>
              <div>Downgraded: {jobResult.downgraded_count}</div>
              <div>Cognito synced: {jobResult.cognito_updated_count}</div>
              {jobResult.downgraded_emails?.length ? (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 600 }}>Emails:</div>
                  <div style={{ fontSize: 12 }}>{jobResult.downgraded_emails.join(", ")}</div>
                </div>
              ) : null}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}