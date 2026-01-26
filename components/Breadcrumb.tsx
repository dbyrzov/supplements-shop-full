"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa"; // икона за стрелка

interface BreadcrumbItem {
  label: string;
  href: string;
}

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pathname) return null;

  const pathParts = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Home
  breadcrumbs.push({ label: "Home", href: "/" });

  // Основен path (например "products")
  let cumulativePath = "";
  pathParts.forEach((part) => {
    cumulativePath += "/" + part;
    const label = part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    breadcrumbs.push({ label, href: cumulativePath });
  });

  // Category query param
  const category = searchParams.get("category");
  if (category) {
    const label = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    breadcrumbs.push({ label, href: pathname + "?category=" + category });
  }

  return (
    <nav aria-label="Breadcrumb" className="my-4">
      <ol className="flex flex-wrap items-center text-gray-700 text-sm md:text-base">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={index} className="flex items-center">
              {index > 0 && <FaChevronRight className="mx-2 text-gray-400 w-3 h-3" />}
              {isLast ? (
                <span className="font-semibold text-gray-900">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
