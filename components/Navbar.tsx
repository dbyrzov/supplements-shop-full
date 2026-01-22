"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "My Orders", href: "/orders" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <nav className="bg-gradient-to-r from-sky-950/95 to-sky-900/95 text-white fixed w-full z-50 top-0 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Лого */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight hover:text-yellow-300 transition-colors duration-300"
        >
          Supplements Shop
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 text-sm font-medium relative">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-2 py-1 flex items-center h-8
                  hover:text-yellow-300 transition-colors duration-300
                  ${isActive ? "text-yellow-300 font-semibold" : ""}
                `}
              >
                {link.name}

                {/* Активен бордър: по-тънък, с разстояние и градиент на краищата */}
                {isActive && (
                    <span
                        className="absolute bottom-0 left-0 w-full h-[2px] mt-1 rounded-full"
                        style={{
                            background: `linear-gradient(to right, transparent 0%, #facc15 25%, #facc15 75%, transparent 100%)`,
                        }}
                    />
                )}
              </Link>
            );
          })}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-3xl font-bold hover:text-yellow-300 transition-colors duration-300"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-6 bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg space-y-3 rounded-b-xl">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-white hover:text-yellow-300 transition-colors duration-300 ${
                  isActive ? "font-semibold text-yellow-300" : ""
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
