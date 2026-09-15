import Link from "next/link";
import { ButtonLink } from "@/frontend/components/ui/button";

const links = [
  { href: "/reservas", label: "Reservas" },
  { href: "/plans", label: "Planes" },
  { href: "/torneos", label: "Torneos" }
];

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-brand-800 bg-brand-700">
      <nav className="flex h-16 w-full items-center justify-between px-4 md:px-8">
        <Link className="text-lg font-bold text-white" href="/">
          Cancha Pro
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-white md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ButtonLink
            href="/login"
            variant="ghost"
            size="sm"
            className="bg-transparent text-white hover:bg-transparent hover:text-gray-200"
          >
            Login
          </ButtonLink>
          <ButtonLink
            href="/register"
            size="sm"
            className="bg-white font-semibold text-brand-700 hover:bg-gray-100"
          >
            Registro
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
