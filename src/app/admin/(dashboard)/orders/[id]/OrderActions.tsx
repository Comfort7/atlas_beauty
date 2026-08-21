"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type Props = {
  orderId: string;
  status: string;
  paymentStatus: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
};

export default function OrderActions({
  orderId,
  status,
  paymentStatus,
  trackingNumber,
  trackingUrl,
}: Props) {
  const router = useRouter();
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingTracking, setSavingTracking] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [confirmingRefund, setConfirmingRefund] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function updateStatus(newStatus: string) {
    setSavingStatus(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/v1/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to update status");
      setSuccess("Order status updated.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSavingStatus(false);
    }
  }

  async function saveTracking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingTracking(true);
    setError("");
    setSuccess("");
    const form = e.currentTarget;
    const number = (form.elements.namedItem("trackingNumber") as HTMLInputElement).value.trim();
    const url = (form.elements.namedItem("trackingUrl") as HTMLInputElement).value.trim();

    try {
      const res = await fetch(`/api/v1/admin/orders/${orderId}/shipping`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber: number, trackingUrl: url || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to save tracking");
      setSuccess("Tracking info saved and customer notified.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSavingTracking(false);
    }
  }

  async function issueRefund() {
    setRefunding(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/v1/admin/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to issue refund");
      setSuccess("Refund issued.");
      setConfirmingRefund(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setRefunding(false);
    }
  }

  const canRefund = ["PAID", "PARTIALLY_REFUNDED"].includes(paymentStatus);

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-xs">
          <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-primary-container/30 text-primary px-4 py-3 rounded-lg text-xs">
          <span className="material-symbols-outlined text-sm flex-shrink-0">check_circle</span>
          {success}
        </div>
      )}

      {/* Status */}
      <div className="bg-surface rounded-xl border border-outline-variant/20 p-6">
        <h2 className="font-headline text-lg text-on-surface mb-1">Order Status</h2>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-4">
          Payment: {paymentStatus.replace(/_/g, " ").toLowerCase()}
        </p>
        <select
          value={status}
          disabled={savingStatus}
          onChange={(e) => updateStatus(e.target.value)}
          className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Tracking */}
      <form
        onSubmit={saveTracking}
        className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-4"
      >
        <h2 className="font-headline text-lg text-on-surface">Shipping & Tracking</h2>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
            Tracking number
          </label>
          <input
            name="trackingNumber"
            defaultValue={trackingNumber ?? ""}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
            Tracking URL
          </label>
          <input
            name="trackingUrl"
            type="url"
            defaultValue={trackingUrl ?? ""}
            placeholder="https://…"
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={savingTracking}
          className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-sm font-bold disabled:opacity-60"
        >
          {savingTracking ? "Saving…" : "Save & mark shipped"}
        </button>
      </form>

      {/* Refund */}
      {canRefund && (
        <div className="bg-surface rounded-xl border border-error/30 p-6">
          <h2 className="font-headline text-lg text-on-surface mb-1">Refund</h2>
          <p className="text-xs text-on-surface-variant mb-4">
            Issues a full refund through Stripe for this order's payment.
          </p>
          {confirmingRefund ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={issueRefund}
                disabled={refunding}
                className="flex-1 bg-error text-on-error py-2.5 rounded-lg text-sm font-bold disabled:opacity-60"
              >
                {refunding ? "Processing…" : "Confirm refund"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingRefund(false)}
                className="px-4 py-2.5 rounded-lg text-sm text-on-surface-variant border border-outline-variant"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingRefund(true)}
              className="w-full border border-error text-error py-2.5 rounded-lg text-sm font-bold hover:bg-error-container/30 transition-colors"
            >
              Issue refund
            </button>
          )}
        </div>
      )}
    </div>
  );
}
