import Link from "next/link";
import { ButtonLink } from "@/frontend/components/ui/button";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-brand-800 bg-brand-700">
      <nav className="flex h-16 w-full items-center justify-between gap-2 px-3 sm:px-4 md:px-8">
        <Link className="shrink-0 whitespace-nowrap text-base font-bold text-white sm:text-lg" href="/">
          Cancha Pro
        </Link>
        <div className="flex items-center gap-2">
          <ButtonLink
            href="/login"
            variant="ghost"
            size="sm"
            className="rounded-md bg-transparent px-4 py-2 text-white hover:bg-white hover:text-green-800"
          >
            Login
          </ButtonLink>
          <ButtonLink
            href="/register"
            size="sm"
            className="rounded-md border border-white bg-transparent px-4 py-2 text-white hover:bg-white hover:text-green-800"
          >
            Registro
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
