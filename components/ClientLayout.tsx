"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      <main className="pt-20">{children}</main>
    </SessionProvider>
  );
}
