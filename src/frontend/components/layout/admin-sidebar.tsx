import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/reservations", label: "Reservas" },
  { href: "/admin/courts", label: "Canchas" },
  { href: "/admin/schedules", label: "Horarios" },
  { href: "/admin/prices", label: "Precios" },
  { href: "/admin/customers", label: "Clientes" },
  { href: "/admin/teams", label: "Equipos" },
  { href: "/admin/tournaments", label: "Torneos" },
  { href: "/admin/payments", label: "Pagos" },
  { href: "/admin/plans", label: "Planes" },
  { href: "/admin/subscriptions", label: "Suscripciones" },
  { href: "/admin/reports", label: "Reportes" }
];

export function AdminSidebar() {
  return (
    <aside className="border-r border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-72">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link className="text-lg font-bold" href="/admin">
          Cancha Pro Admin
        </Link>
      </div>
      <nav className="grid gap-1 p-4 text-sm font-medium text-slate-700">
        {adminLinks.map((link) => (
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
