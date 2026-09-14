import Link from "next/link";

const clientLinks = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/courts", label: "Canchas" },
  { href: "/reservas", label: "Reservar horario" },
  { href: "/dashboard/reservations", label: "Mis reservas" },
  { href: "/dashboard/payments", label: "Mis pagos" },
  { href: "/dashboard/teams", label: "Mis equipos" },
  { href: "/dashboard/tournaments", label: "Torneos" }
];

export function ClientSidebar() {
  return (
    <aside className="border-r border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-64">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link className="text-lg font-bold" href="/dashboard">
          Cancha Pro
        </Link>
      </div>
      <nav className="grid gap-1 p-4 text-sm font-medium text-slate-700">
        {clientLinks.map((link) => (
          <Link
            key={link.href}
            className="rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-ink"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
