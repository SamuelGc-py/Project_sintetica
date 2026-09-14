import { createPriceRuleAction } from "@/backend/actions/schedules.actions";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { formatCurrency } from "@/frontend/utils/format";
import { getCourts } from "@/backend/services/courts.service";
import { getPriceRules } from "@/backend/services/schedules.service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const days = ["Todos", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

export default async function AdminPricesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [courts, rules] = await Promise.all([getCourts(), getPriceRules()]);

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gestion de precios"
        description="Tarifas por cancha, franja horaria y reglas especiales."
      />
      <StatusMessage params={params} />

      <Card>
        <CardHeader>
          <CardTitle>Nueva regla de precio</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPriceRuleAction} className="grid gap-4 md:grid-cols-5">
            <input type="hidden" name="redirectTo" value="/admin/prices" />
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Cancha
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="courtId">
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Dia
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="dayOfWeek">
                <option value="">Todos</option>
                <option value="1">Lunes</option>
                <option value="2">Martes</option>
                <option value="3">Miercoles</option>
                <option value="4">Jueves</option>
                <option value="5">Viernes</option>
                <option value="6">Sabado</option>
                <option value="0">Domingo</option>
              </select>
            </label>
            <Input label="Desde" name="startsAt" type="time" />
            <Input label="Hasta" name="endsAt" type="time" />
            <Input label="Precio/hora" name="hourlyRate" type="number" />
            <div className="md:col-span-5">
              <Button type="submit">Crear regla</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {courts.map((court) => (
          <Card key={court.id}>
            <CardHeader>
              <CardTitle>{court.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              <p>{court.location}</p>
              <p className="mt-2 text-2xl font-bold text-ink">
                {formatCurrency(court.hourlyRate)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reglas especiales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {rules.map((rule) => (
            <div key={rule.id} className="grid gap-2 rounded-md border border-slate-200 p-3 text-sm md:grid-cols-4">
              <p className="font-semibold">{rule.courtName}</p>
              <p>{rule.dayOfWeek === null || rule.dayOfWeek === undefined ? "Todos" : days[rule.dayOfWeek === 0 ? 7 : rule.dayOfWeek]}</p>
              <p>{rule.startsAt ?? "00:00"} - {rule.endsAt ?? "24:00"}</p>
              <p className="font-semibold">{formatCurrency(rule.hourlyRate)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
