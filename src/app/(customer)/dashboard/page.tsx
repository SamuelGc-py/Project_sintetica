import Link from "next/link";
import { getClientReservations } from "@/backend/services/reservations.service";

export const dynamic = "force-dynamic";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h13m-5-5 5 5-5 5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v3m10.5-3v3M4.5 9.75h15m-13.5-6h12A1.5 1.5 0 0 1 19.5 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5h-12a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
  );
}

export default async function ClientDashboardPage() {
  const reservations = await getClientReservations();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <section className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-8 text-white shadow-sm sm:px-10 sm:py-10">
        <div className="absolute -right-20 -top-24 size-72 rounded-full border border-emerald-500/30" />
        <div className="absolute -bottom-36 right-24 size-64 rounded-full border border-emerald-500/20" />
        <div className="relative max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">Cancha Pro / Tu espacio</p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-5xl">Menos agenda. Más cancha.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Encuentra una cancha, arma tu próximo partido y deja que nosotros nos encarguemos de la reserva.</p>
          <Link className="mt-7 inline-flex items-center gap-3 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400" href="/dashboard/courts">
            Buscar una cancha
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <section aria-labelledby="quick-actions-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Todo en un solo lugar</p>
            <h2 id="quick-actions-title" className="mt-1 font-heading text-2xl font-extrabold text-slate-950">¿Qué quieres hacer hoy?</h2>
          </div>
          <span className="hidden text-sm text-slate-500 sm:block">{reservations.length} reservas registradas</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md" href="/dashboard/courts">
            <span className="mb-8 flex size-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><CalendarIcon /></span>
            <h3 className="font-heading text-lg font-extrabold text-slate-950">Reservar cancha</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Explora horarios y encuentra el lugar ideal para tu partido.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Ver canchas <ArrowIcon /></span>
          </Link>
          <Link className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md" href="/dashboard/reservations">
            <span className="mb-8 flex size-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><CalendarIcon /></span>
            <h3 className="font-heading text-lg font-extrabold text-slate-950">Mis reservas</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Consulta tus próximos partidos y revisa el estado de cada reserva.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Ver reservas <ArrowIcon /></span>
          </Link>
          <Link className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md" href="/dashboard/tournaments">
            <span className="mb-8 flex size-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><CalendarIcon /></span>
            <h3 className="font-heading text-lg font-extrabold text-slate-950">Torneos</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Conoce los torneos disponibles y lleva tu equipo a la cancha.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Explorar torneos <ArrowIcon /></span>
          </Link>
        </div>
      </section>

      <section className="flex flex-col justify-between gap-5 rounded-xl border border-emerald-100 bg-emerald-50 p-6 sm:flex-row sm:items-center sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Tu actividad</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">Tienes {reservations.length} {reservations.length === 1 ? "reserva registrada" : "reservas registradas"}.</p>
          <p className="mt-1 text-sm text-slate-600">Mantén tus partidos organizados desde tu espacio personal.</p>
        </div>
        <Link className="inline-flex shrink-0 items-center justify-center rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-700 hover:text-white" href="/dashboard/reservations">Ver mi actividad</Link>
      </section>
    </div>
  );
}
