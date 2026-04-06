"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">

          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-10">
            <Link href="/" className="text-2xl tracking-tighter text-on-surface font-headline">
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

          {/* Right: Search, Admin, Person, Cart, Mobile toggle */}
          <div className="flex items-center space-x-5">
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

            {/* Admin — subtle shield icon, desktop only */}
            <Link
              href="/admin/login"
              title="Admin Portal"
              className="hidden md:flex items-center hover:text-primary transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            </Link>

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

            {/* Mobile hamburger */}
            <button
              className="md:hidden hover:text-primary transition-colors text-on-surface-variant ml-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Panel */}
          <div className="relative ml-auto w-72 h-full bg-surface shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
              <span className="font-headline text-xl tracking-tighter text-on-surface">Atlas Beauty</span>
              <button onClick={() => setMenuOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
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

            {/* Admin link at bottom of mobile menu */}
            <div className="px-4 py-6 border-t border-outline-variant/20 space-y-2">
              <Link
                href="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                <span className="font-body text-sm">Admin Portal</span>
              </Link>
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
