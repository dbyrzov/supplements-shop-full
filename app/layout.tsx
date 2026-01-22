import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Supplements Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="pt-20" style={{ paddingTop: '60px' }}>{children}</div>
      </body>
    </html>
  );
}
