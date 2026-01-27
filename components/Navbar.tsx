"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useSession, signOut } from "next-auth/react";
import { useGiftStore } from "@/store/useGiftStore";

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

  // Gift states
  const { gifts, selectedGift, setGifts, selectGift, resetGift } =
    useGiftStore();

  // NextAuth session
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";
  const isLoggedIn = !!session;
  const isCheckout = pathname === "/checkout";

  const links = [
    { name: "Продукти", href: "/products" },
    { name: "Контакти", href: "/contact" },
  ];

  if (isAdmin) links.push({ name: "Админ", href: "/admin" });

  function isLinkActive(linkHref: string, currentPath: string) {
    if (linkHref === "/") return currentPath === "/";
    return currentPath.startsWith(linkHref);
  }

  // Fetch gifts when total >= 20€
  useEffect(() => {
    if (total >= 20) {
      fetch("/api/admin/gifts")
        .then((res) => res.json())
        .then((data) => setGifts(data.gifts || []))
        .catch(() => setGifts([]));
    } else {
      setGifts([]);
      selectGift(null);
    }
  }, [total]);

  return (
    <nav className="bg-gradient-to-r from-sky-950/95 to-sky-900/95 text-white fixed w-full z-50 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="BodyNutrify Logo"
            width={150}
            height={50}
            priority
            className="hover:scale-105 transition-transform duration-300"
          />
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

          {/* Logout */}
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
            className={`
              relative ml-2 w-10 h-10 flex items-center justify-center rounded-full transition
              ${
                isCheckout
                  ? "text-yellow-300 cursor-not-allowed"
                  : "hover:bg-white/10 cursor-pointer"
              }
            `}
            onClick={() => {
              if (!isCheckout) setCartOpen(true);
            }}
            title={isCheckout ? "Checkout in progress" : "Open cart"}
          >
            <CartIcon className="w-5 h-5" />

            {count > 0 && (
              <span
                className={`
                  absolute -top-1 -right-1 text-[11px] font-bold rounded-full min-w-[18px] h-[18px]
                  flex items-center justify-center px-1 shadow
                  ${isCheckout ? "bg-yellow-400 text-sky-950" : "bg-yellow-400 text-sky-950"}
                `}
              >
                {count}
              </span>
            )}

            {isCheckout && (
              <span className="absolute bottom-0 right-0 text-xs">🔒</span>
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
        <div className="md:hidden p-4 bg-gradient-to-r from-sky-900 to-sky-800 rounded-b-xl">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block p-3 border-b hover:text-yellow-300 transition"
            >
              {link.name}
            </Link>
          ))}

          {isLoggedIn && (
            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
                setOpen(false);
              }}
              className="block w-full text-left p-3 bg-red-500 hover:bg-red-600 rounded text-white transition"
            >
              Logout
            </button>
          )}

          {/* MOBILE CART ICON */}
          <Link
            href="/checkout"
            className={`
              relative mt-4 w-10 h-10 flex items-center justify-center rounded-full transition
              ${
                isCheckout
                  ? "text-yellow-300 cursor-not-allowed"
                  : "hover:bg-white/10 cursor-pointer"
              }
            `}
            onClick={() => {
              setCartOpen(false);
              setOpen(false)
            }}
            title={isCheckout ? "Checkout in progress" : "Open cart"}
          >
            <CartIcon className="w-5 h-5" />

            {count > 0 && (
              <span
                className={`
                  absolute -top-1 -right-1 text-[11px] font-bold rounded-full min-w-[18px] h-[18px]
                  flex items-center justify-center px-1 shadow
                  ${isCheckout ? "bg-yellow-400 text-sky-950" : "bg-yellow-400 text-sky-950"}
                `}
              >
                {count}
              </span>
            )}

            {isCheckout && (
              <span className="absolute bottom-0 right-0 text-xs">🔒</span>
            )}
          </Link>
        </div>
      )}

      {/* MINI CART DRAWER */}
      {cartOpen && !isCheckout && (
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
                <p className="text-gray-500 text-center mt-10 text-sm">
                  Your cart is empty
                </p>
              )}

              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-1">
                  <div className="relative w-10 h-10 bg-gray-50 rounded-sm flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => decrease(item.id)}
                      className="h-5 w-5 rounded-full border text-sky-700 hover:bg-sky-50 transition text-xs flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm font-medium text-sky-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increase(item.id)}
                      className="h-5 w-5 rounded-full border text-sky-700 hover:bg-sky-50 transition text-xs flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-semibold w-14 text-right text-gray-900">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* GIFT SELECTOR */}
              {items.length > 0 && total >= 20 && gifts.length > 0 && (
                <div className="p-4 border-t border-gray-200 flex flex-col gap-2 bg-yellow-50 rounded-lg mt-2">
                  <p className="text-gray-800 font-medium text-sm mb-2">
                    Choose your free gift 🎁
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {gifts.map((gift) => (
                      <label
                        key={gift.id}
                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-yellow-100 transition ${
                          selectedGift?.id === gift.id
                            ? "border-yellow-500 bg-yellow-100"
                            : "border-gray-200 hover:bg-yellow-100/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gift"
                          checked={selectedGift?.id === gift.id}
                          onChange={() => selectGift(gift)}
                        />
                        {gift.imageUrl && (
                          <div className="w-8 h-8 relative flex-shrink-0">
                            <Image
                              src={gift.imageUrl}
                              alt={gift.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {gift.name}
                          </p>
                          <p className="text-xs text-gray-500 line-through">
                            €{gift.price.toFixed(2)}
                          </p>
                          <p className="text-xs font-semibold text-green-600">
                            Free
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
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
