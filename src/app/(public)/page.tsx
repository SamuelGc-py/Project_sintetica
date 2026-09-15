import { prisma } from "@/backend/db/prisma";
import { getCourts } from "@/backend/services/courts.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { ButtonLink } from "@/frontend/components/ui/button";
import { MainLayout } from "@/frontend/components/layout/main-layout";
import { formatCurrency } from "@/frontend/utils/format";

export const dynamic = "force-dynamic";

const benefits = [
  "Reservas online en tiempo real con PostgreSQL",
  "Gestion de canchas, horarios y estados",
  "Planes mensuales configurables para equipos",
  "Estadisticas deportivas de torneos y partidos",
  "Reportes financieros y registro de pagos"
];

const plans = [
  {
    name: "Plan Basico",
    price: "COP 180.000/mes",
    description: "Ideal para equipos que buscan horas fijas semanales con descuento."
  },
  {
    name: "Plan Premium",
    price: "COP 280.000/mes",
    description: "Incluye mas horas, recordatorios WhatsApp y descuentos exclusivos."
  },
  {
    name: "Plan Elite",
    price: "COP 420.000/mes",
    description: "Acceso prioritario, reportes detallados y beneficios en torneos."
  }
];

export default async function HomePage() {
  const courts = await getCourts({ activeOnly: true });

  let totalReservations = 0;
  let totalTeams = 0;
  let totalPaymentsAmount = 0;

  try {
    const [resCount, teamCount, paymentAgg] = await Promise.all([
      prisma.reservation.count(),
      prisma.team.count(),
      prisma.payment.aggregate({ _sum: { amount: true } })
    ]);
    totalReservations = resCount;
    totalTeams = teamCount;
    totalPaymentsAmount = Number(paymentAgg._sum.amount ?? 0);
  } catch {
    // fallback if DB connection is empty
  }

  return (
    <MainLayout>
      <section className="grid w-full gap-10 px-0 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            SaaS para Canchas Sinteticas
          </p>
          <h1 className="text-4xl font-bold leading-tight text-ink md:text-6xl">
            Cancha Pro
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Plataforma web full-stack conectada a base de datos PostgreSQL para administrar
            reservas en linea, anticipos, torneos, planes y reportes financieros desde un solo lugar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/reservas">Reservar cancha en linea</ButtonLink>
            <ButtonLink href="/admin" variant="secondary">
              Panel Administrador
            </ButtonLink>
          </div>
        </div>

        <Card className="border-brand-100 bg-white shadow-soft">
          <CardHeader>
            <CardTitle>Metricas en Tiempo Real (Base de Datos)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-lg bg-brand-50 p-4">
              <p className="text-sm text-slate-600">Total Reservas Registradas</p>
              <p className="mt-1 text-3xl font-bold text-brand-900">{totalReservations}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Recaudo / Pagos</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {formatCurrency(totalPaymentsAmount)}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Equipos Inscritos</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{totalTeams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Canchas Disponibles de la BD */}
      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-bold">Canchas Disponibles</h2>
              <p className="mt-1 text-slate-600">Informacion cargada directamente de PostgreSQL</p>
            </div>
            <ButtonLink href="/reservas">Ir a Reservar</ButtonLink>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {courts.map((court) => (
              <Card key={court.id} className="bg-white">
                <CardHeader>
                  <CardTitle>{court.name}</CardTitle>
                  <p className="text-sm font-semibold text-brand-700">{court.type}</p>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <p className="text-sm text-slate-600">Ubicacion: {court.location}</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(court.hourlyRate)} / hora
                  </p>
                  <ButtonLink href="/reservas" className="mt-2 text-center">
                    Reservar {court.name}
                  </ButtonLink>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-bold">Beneficios del Sistema</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {benefits.map((benefit) => (
              <Card key={benefit}>
                <CardContent className="pt-6 text-sm font-medium text-slate-700">
                  {benefit}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl font-bold">Planes de Suscripcion</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-brand-700">
                  {plan.price}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {plan.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">¿Listo para gestionar tus canchas?</h2>
            <p className="mt-2 text-slate-200">
              Registrate y empieza a recibir reservas en linea.
            </p>
          </div>
          <ButtonLink href="/register" variant="light">
            Crear cuenta
          </ButtonLink>
        </div>
      </section>
    </MainLayout>
  );
}
