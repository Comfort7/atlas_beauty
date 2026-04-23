"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

type NavChild = { label: string; href: string };
type NavItem = { icon: string; label: string; href: string; children?: NavChild[] };

const navItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/admin" },
  {
    icon: "inventory_2",
    label: "Products",
    href: "/admin/products",
    children: [
      { label: "All Products", href: "/admin/products" },
      { label: "Add New Product", href: "/admin/products/new" },
    ],
  },
  { icon: "warehouse", label: "Inventory", href: "/admin/inventory" },
  { icon: "receipt_long", label: "Orders", href: "/admin/orders" },
  { icon: "group", label: "Customers", href: "/admin/customers" },
  {
    icon: "article",
    label: "Blog",
    href: "/admin/blog",
    children: [
      { label: "All Posts", href: "/admin/blog" },
      { label: "Write New Post", href: "/admin/blog/new" },
    ],
  },
  {
    icon: "local_offer",
    label: "Coupons",
    href: "/admin/coupons",
    children: [
      { label: "Coupons & banners", href: "/admin/coupons" },
      { label: "Add coupon", href: "/admin/coupons/new" },
      { label: "Add banner", href: "/admin/coupons/banners/new" },
    ],
  },
  { icon: "dashboard_customize", label: "Layout", href: "/admin/layout" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    // Auto-open the submenu for the active section
    return navItems
      .filter((item) => item.children && pathname.startsWith(item.href))
      .map((item) => item.label);
  });

  function toggleMenu(label: string) {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-surface border-r border-outline-variant/30 flex flex-col transition-all duration-300 flex-shrink-0 sticky top-0 h-screen z-30`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-outline-variant/20">
        <Link
          href="/"
          className="font-headline text-xl text-on-surface tracking-tighter truncate flex-1"
        >
          {collapsed ? "AB" : "Atlas Beauty"}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined text-sm">
            {collapsed ? "menu_open" : "menu"}
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const menuOpen = openMenus.includes(item.label);

          return (
            <div key={item.label}>
              {item.children && !collapsed ? (
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                    active
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm flex-shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-sm truncate flex-1">{item.label}</span>
                  <span className="material-symbols-outlined text-[14px] flex-shrink-0">
                    {menuOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    active
                      ? "bg-primary text-on-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="material-symbols-outlined text-sm flex-shrink-0">
                    {item.icon}
                  </span>
                  {!collapsed && <span className="text-sm truncate">{item.label}</span>}
                </Link>
              )}

              {/* Submenu */}
              {item.children && menuOpen && !collapsed && (
                <div className="ml-6 mt-0.5 space-y-0.5 border-l-2 border-outline-variant/20 pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        pathname === child.href
                          ? "text-primary font-bold bg-primary/5"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User + Sign Out */}
      <div className="p-3 border-t border-outline-variant/20 space-y-1">
        <div className={`flex items-center gap-3 px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-primary-container text-sm">
              person
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-on-surface truncate">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                Super Admin
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-error-container/50 hover:text-error transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
          title="Sign Out"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
