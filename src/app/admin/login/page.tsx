"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);

  // Redirect if already signed in as admin
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [session, status, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!mountedRef.current) return;

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      // Successful login — fetch updated session and redirect
      router.push("/admin");
      router.refresh();
    } catch {
      if (!mountedRef.current) return;
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  // Show nothing while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left: Editorial Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <Link href="/" className="font-headline text-3xl text-on-primary tracking-tighter">
            Atlas Beauty
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="w-16 h-px bg-on-primary/30" />
          <h1 className="font-headline text-5xl text-on-primary leading-tight">
            The Control <br />
            <span className="italic font-light">Centre.</span>
          </h1>
          <p className="text-on-primary/70 font-body text-lg leading-relaxed max-w-md">
            Manage your atlas. Oversee orders, curate collections, and architect the customer experience.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-8">
            {[
              { icon: "inventory_2", label: "Products" },
              { icon: "receipt_long", label: "Orders" },
              { icon: "group", label: "Customers" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-on-primary">{item.icon}</span>
                </div>
                <span className="text-on-primary/60 text-xs uppercase tracking-widest font-label">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-on-primary/40 text-[10px] uppercase tracking-widest font-body">
            © 2024 Atlas Beauty. Admin Portal v2.0
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md space-y-10">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <Link href="/" className="font-headline text-2xl text-on-surface tracking-tighter">
              Atlas Beauty
            </Link>
          </div>

          <div className="space-y-3">
            <h2 className="font-headline text-4xl text-on-surface">Welcome back.</h2>
            <p className="font-body text-sm text-on-surface-variant">
              Sign in to your admin account to continue.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm font-body">
              <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} suppressHydrationWarning>
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                  mail
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="admin@atlasbeauty.com"
                  className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary border-t-0 border-x-0 focus:ring-0 pl-8 py-3 text-sm font-body text-on-surface placeholder:text-on-surface-variant/40 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label"
              >
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••"
                  className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary border-t-0 border-x-0 focus:ring-0 pl-8 pr-10 py-3 text-sm font-body text-on-surface placeholder:text-on-surface-variant/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="w-4 h-4 border-2 border-primary rounded-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[10px]">check</span>
                </div>
                <span className="text-xs font-body text-on-surface-variant">Keep me signed in</span>
              </label>
              <button type="button" className="text-xs text-primary font-bold font-body hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-4 rounded-lg font-bold text-sm tracking-widest uppercase hover:brightness-110 transition-all active:scale-95 font-body flex items-center justify-center gap-3 mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">
                    progress_activity
                  </span>
                  Signing In…
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">secured</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">shield</span>
            <p className="text-xs font-body">
              Protected by 256-bit SSL encryption. Authorised personnel only.
            </p>
          </div>

          <p className="text-center text-xs font-body text-on-surface-variant pt-4">
            <Link href="/" className="hover:text-primary transition-colors">
              ← Back to Atlas Beauty
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
