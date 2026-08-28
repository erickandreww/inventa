"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/dashboard",
    label:"Dashboard",
  },
  {
    href: "/products",
    label:"Products",
  },
  {
    href: "/categories",
    label:"Categories",
  },
  {
    href: "/stock",
    label:"Stock",
  },
]

type NavLinksProps = {
  mobile?: boolean;
};

export function NavLinks({mobile = false}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={mobile 
      ? "flex gap-2 overflow-x-auto" 
      : "flex flex-col gap-1"}
    >
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link key={link.href} href={link.href} 
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100 hover:text-black"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      </nav>
  )
}
