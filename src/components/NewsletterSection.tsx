"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/v1/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to subscribe");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section className="py-24 px-8">
      <div className="max-w-4xl mx-auto bg-surface-container-low rounded-lg p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-4xl font-headline mb-4">Join the Inner Circle</h2>
          <p className="font-body text-on-surface-variant mb-10 max-w-md mx-auto">
            Receive editorial insights, exclusive previews of new arrivals, and
            invitations to our virtual rituals.
          </p>

          {status === "success" ? (
            <p className="max-w-lg mx-auto font-body text-sm text-primary flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              You're subscribed. Welcome to the inner circle.
            </p>
          ) : (
            <form
              className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto"
              onSubmit={handleSubmit}
              suppressHydrationWarning
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={status === "loading"}
                className="flex-1 bg-surface-container-high border-b-2 border-primary border-t-0 border-x-0 focus:ring-0 focus:border-primary px-4 py-4 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-primary text-on-primary px-10 py-4 rounded-lg font-bold hover:scale-95 transition-transform uppercase tracking-widest text-xs font-body disabled:opacity-60 disabled:hover:scale-100"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="text-xs text-error mt-4 font-body">{error}</p>
          )}

          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-6 font-body">
            By subscribing, you agree to our privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}
