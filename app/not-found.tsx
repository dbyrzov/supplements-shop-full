import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Страницата не беше намерена</h1>
      <p className="mb-4">Съжаляваме, но страницата, която търсите, не съществува.</p>
      <Link href="/" className="text-blue-500 underline">
        Върни се на началната страница
      </Link>
    </div>
  );
}
