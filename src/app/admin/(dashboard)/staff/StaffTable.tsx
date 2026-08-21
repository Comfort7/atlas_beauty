"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StaffUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  orderCount: number;
  createdAt: string;
};

export default function StaffTable({
  users,
  emptyLabel,
  limit,
}: {
  users: StaffUser[];
  emptyLabel: string;
  limit?: number;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  const visible = limit ? users.slice(0, limit) : users;

  async function setRole(id: string, role: "ADMIN" | "CUSTOMER") {
    setPendingId(id);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to update role");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPendingId(null);
    }
  }

  async function removeUser(id: string) {
    setPendingId(id);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/users/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to delete user");
      setConfirmingDelete(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPendingId(null);
    }
  }

  if (visible.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-outline-variant/20 p-8 text-center text-sm text-on-surface-variant">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
      {error && (
        <div className="px-6 py-3 bg-error-container text-on-error-container text-xs">{error}</div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-low">
              {["Name", "Email", "Orders", "Joined", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {visible.map((user) => (
              <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-on-surface">
                  {user.name || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{user.email}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{user.orderCount}</td>
                <td className="px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.role === "ADMIN" ? (
                      <button
                        type="button"
                        onClick={() => setRole(user.id, "CUSTOMER")}
                        disabled={pendingId === user.id}
                        className="text-xs font-bold text-on-surface-variant hover:text-on-surface disabled:opacity-50"
                      >
                        Revoke admin
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRole(user.id, "ADMIN")}
                        disabled={pendingId === user.id}
                        className="text-xs font-bold text-primary hover:underline disabled:opacity-50"
                      >
                        Make admin
                      </button>
                    )}
                    {confirmingDelete === user.id ? (
                      <span className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => removeUser(user.id)}
                          disabled={pendingId === user.id}
                          className="text-xs font-bold text-error hover:underline disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingDelete(null)}
                          className="text-xs text-on-surface-variant"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingDelete(user.id)}
                        disabled={pendingId === user.id}
                        className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-50"
                        title="Delete user"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
