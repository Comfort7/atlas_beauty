"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Collections", href: "/" },
  { label: "Skincare", href: "/skincare" },
  { label: "Body Care", href: "/bodycare" },
  { label: "Fragrance", href: "/fragrance" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
];

const mobileLinks = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Skincare", href: "/skincare", icon: "spa" },
  { label: "Body Care", href: "/bodycare", icon: "water_drop" },
  { label: "Fragrance", href: "/fragrance", icon: "local_florist" },
  { label: "Journal", href: "/journal", icon: "article" },
  { label: "About Us", href: "/about", icon: "info" },
  { label: "Shopping Bag", href: "/cart", icon: "shopping_bag" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] min-h-16 sm:min-h-[4.5rem] border-b border-outline-variant/20 ${
          menuOpen ? "bg-surface shadow-sm" : "bg-surface/80 backdrop-blur-md"
        }`}
      >
        <div className="flex h-full min-h-16 sm:min-h-[4.5rem] justify-between items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 md:px-8 max-w-7xl mx-auto min-w-0">

          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-4 min-w-0 md:gap-10">
            <Link
              href="/"
              className="shrink-0 text-lg sm:text-xl md:text-2xl tracking-tighter text-on-surface font-headline truncate"
            >
              Atlas Beauty
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ label, href }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`font-body text-sm transition-colors duration-300 ${
                      isActive
                        ? "text-primary font-bold border-b-2 border-primary pb-1"
                        : "text-on-surface-variant font-medium hover:text-primary"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Search, Person, Cart, Mobile toggle */}
          <div className="flex items-center shrink-0 gap-3 sm:space-x-5">
            {/* Search — desktop only */}
            <div className="hidden lg:block relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search products…"
                className="bg-surface-container-high border-none text-sm py-2 pl-10 pr-4 focus:ring-0 w-48 border-b-2 border-primary font-body text-on-surface placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Account */}
            <button className="hover:text-primary transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">person</span>
            </button>

            {/* Cart */}
            <Link href="/cart" className="hover:text-primary transition-colors relative text-on-surface-variant">
              <span className="material-symbols-outlined">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                2
              </span>
            </Link>

            {/* Mobile hamburger — stays above dimmed overlay (drawer begins below nav) */}
            <button
              type="button"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-container-high hover:text-primary transition-colors text-on-surface-variant"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="material-symbols-outlined text-2xl">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer: only below the fixed nav (drawer z-40, nav z-50) so bar + hamburger stay visible */}
      {menuOpen && (
        <div
          id="mobile-nav-drawer"
          className="fixed left-0 right-0 bottom-0 top-16 z-40 flex sm:top-[4.5rem] md:hidden max-w-[100vw]"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          {/* Backdrop — does not cover navbar */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          {/* Panel */}
          <div className="relative ml-auto w-[min(20rem,85vw)] h-full max-h-full bg-surface shadow-2xl flex flex-col border-l border-outline-variant/20">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
              <span className="font-headline text-xl tracking-tighter text-on-surface">Atlas Beauty</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overscroll-contain">
              {mobileLinks.map(({ label, href, icon }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary text-on-primary font-bold"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                    <span className="font-body text-sm">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 py-6 border-t border-outline-variant/20 space-y-2">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 px-4">
                © 2024 Atlas Beauty
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
