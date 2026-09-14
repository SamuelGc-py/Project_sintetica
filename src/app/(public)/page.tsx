import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { ButtonLink } from "@/frontend/components/ui/button";
import { MainLayout } from "@/frontend/components/layout/main-layout";

const benefits = [
  "Reservas online con anticipos",
  "Control de horarios, precios y clientes",
  "Planes mensuales para equipos",
  "Torneos con estadisticas deportivas",
  "Reportes financieros para la administracion"
];

const plans = [
  {
    name: "Operacion",
    price: "Desde COP 149.000/mes",
    description: "Ideal para canchas que quieren digitalizar agenda y pagos."
  },
  {
    name: "Crecimiento",
    price: "Desde COP 249.000/mes",
    description: "Agrega planes para equipos, torneos y reportes avanzados."
  },
  {
    name: "Multi-sede",
    price: "A la medida",
    description: "Pensado para marcas con varias sedes y administradores."
  }
];

export default function HomePage() {
  return (
    <MainLayout>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            SaaS para canchas sinteticas
          </p>
          <h1 className="text-4xl font-bold leading-tight text-ink md:text-6xl">
            Cancha Pro
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Una plataforma web para que los dueños de canchas en Colombia
            administren reservas, anticipos, planes mensuales, torneos,
            clientes y reportes financieros desde un solo lugar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/reservas">Reservar cancha</ButtonLink>
            <ButtonLink href="/admin" variant="secondary">
              Soy administrador
            </ButtonLink>
          </div>
        </div>
        <Card className="border-brand-100 bg-white shadow-soft">
          <CardHeader>
            <CardTitle>Resumen operativo</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-lg bg-brand-50 p-4">
              <p className="text-sm text-slate-600">Reservas de hoy</p>
              <p className="mt-1 text-3xl font-bold">18</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Anticipos</p>
                <p className="mt-1 text-xl font-semibold">COP 620k</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Equipos activos</p>
                <p className="mt-1 text-xl font-semibold">32</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-bold">Beneficios</h2>
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
        <h2 className="text-2xl font-bold">Planes para administradores</h2>
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
            <h2 className="text-2xl font-bold">Contacto</h2>
            <p className="mt-2 text-slate-200">
              Agenda una demo y empieza a ordenar tu operacion deportiva.
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
