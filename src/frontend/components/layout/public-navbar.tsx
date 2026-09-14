import Link from "next/link";
import { ButtonLink } from "@/frontend/components/ui/button";

const links = [
  { href: "/reservas", label: "Reservas" },
  { href: "/plans", label: "Planes" },
  { href: "/torneos", label: "Torneos" }
];

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link className="text-lg font-bold text-ink" href="/">
          Cancha Pro
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost" size="sm">
            Login
          </ButtonLink>
          <ButtonLink href="/register" size="sm">
            Registro
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
