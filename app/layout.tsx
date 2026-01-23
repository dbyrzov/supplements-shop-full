// app/layout.tsx (Server Component)
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  title: "Supplements Shop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <body className="bg-gray-50 min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
