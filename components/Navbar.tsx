"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useSession, signOut } from "next-auth/react";

function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();

  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);

  // NextAuth session
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";
  const isLoggedIn = !!session;

  // Навигационни линкове
  const links = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
  ];

  // Добавяме Admin линк само ако е admin
  if (isAdmin) {
    links.push({ name: "Admin", href: "/admin" });
  }

  function isLinkActive(linkHref: string, currentPath: string) {
    if (linkHref === "/") return currentPath === "/";
    return currentPath.startsWith(linkHref);
  }

  return (
    <nav className="bg-gradient-to-r from-sky-950/95 to-sky-900/95 text-white fixed w-full z-50 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight hover:text-yellow-300 transition"
        >
          Supplements Shop
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => {
            const isActive = isLinkActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2 py-1 h-8 flex items-center hover:text-yellow-300 transition ${
                  isActive ? "text-yellow-300 font-semibold" : ""
                }`}
              >
                {link.name}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 w-full h-[2px] rounded-full"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, #facc15, transparent)",
                    }}
                  />
                )}
              </Link>
            );
          })}

          {/* Logout бутона */}
          {isLoggedIn && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white transition"
            >
              Logout
            </button>
          )}

          {/* CART ICON */}
          <div
            className="relative ml-2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer"
            onClick={() => setCartOpen(true)}
          >
            <CartIcon className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-sky-950 text-[11px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                {count}
              </span>
            )}
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl hover:text-yellow-300 transition"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-6 bg-gradient-to-r from-sky-900 to-sky-800 space-y-3 rounded-b-xl">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md hover:text-yellow-300 transition"
            >
              {link.name}
            </Link>
          ))}

          {/* Logout бутон за мобилни */}
          {isLoggedIn && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full text-left px-3 py-2 bg-red-500 hover:bg-red-600 rounded text-white transition"
            >
              Logout
            </button>
          )}

          {/* MOBILE CART ICON */}
          <div
            className="relative ml-2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer"
            onClick={() => setCartOpen(true)}
          >
            <CartIcon className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-sky-950 text-[11px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                {count}
              </span>
            )}
          </div>
        </div>
      )}

      {/* MINI CART DRAWER */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setCartOpen(false)}
          />

          <div
            className={`
              fixed top-14 right-4 h-[50vh] w-80 max-w-full bg-white
              shadow-2xl z-50 flex flex-col rounded-2xl transform transition-transform duration-300 ease-in-out
              ${cartOpen ? "translate-x-0" : "translate-x-full"}
            `}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-500 hover:text-gray-900 text-xl transition"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {items.length === 0 && (
                <p className="text-gray-500 text-center mt-10 text-sm">Your cart is empty</p>
              )}

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-1"
                >
                  {/* IMAGE */}
                  <div className="relative w-10 h-10 bg-gray-50 rounded-sm flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* NAME */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => decrease(item.id)}
                      className="h-5 w-5 rounded-full border text-sky-700 hover:bg-sky-50 transition text-xs flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm font-medium text-sky-700">{item.quantity}</span>
                    <button
                      onClick={() => increase(item.id)}
                      className="h-5 w-5 rounded-full border text-sky-700 hover:bg-sky-50 transition text-xs flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* ITEM TOTAL */}
                  <span className="text-sm font-semibold w-14 text-right text-gray-900">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
                <div className="flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full text-center py-2 bg-sky-700 text-white rounded-md hover:bg-sky-600 transition text-sm font-medium"
                >
                  Go to Checkout
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
