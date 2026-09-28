import { api } from "../Config/api";

// All membership/payment calls live here (Part 13: no scattered axios calls).
// Note: only a planId is ever sent -- prices, user identity and payment
// status are always decided by the backend.
export const membershipService = {
  getPlans: () => api.get("/api/membership/plans"),
  getCurrent: () => api.get("/api/membership/current"),
  getSubscriptionHistory: (page = 0, size = 20) =>
    api.get("/api/membership/history", { params: { page, size } }),
  getPaymentHistory: (page = 0, size = 20) =>
    api.get("/api/payments/history", { params: { page, size } }),

  createOrder: (planId) => api.post("/api/payments/create-order", { planId }),
  verifyPayment: (payload) => api.post("/api/payments/verify", payload),
  markFailed: (razorpayOrderId) =>
    api.post("/api/payments/failed", { razorpayOrderId }),
};

// Loads Razorpay's hosted checkout script once.
export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.getElementById("razorpay-checkout-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const formatMoney = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export const durationLabel = (days) => {
  if (!days || days >= 36500) return "Forever";
  if (days % 365 === 0) return `${days / 365} Year${days / 365 > 1 ? "s" : ""}`;
  if (days % 30 === 0) return `${days / 30} Months`;
  return `${days} Days`;
};

// null limit from backend = unlimited
export const limitLabel = (n) => (n === null || n === undefined ? "Unlimited" : n);
