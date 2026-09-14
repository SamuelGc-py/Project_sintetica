import {
  createPlanAction,
  deletePlanAction,
  updatePlanAction
} from "@/backend/actions/plans.actions";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { formatCurrency } from "@/frontend/utils/format";
import { getSubscriptionPlans } from "@/backend/services/subscriptions.service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPlansPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const plans = await getSubscriptionPlans();

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Planes"
        description="CRUD de planes basico, premium y elite para equipos."
      />
      <StatusMessage params={params} />

      <Card>
        <CardHeader>
          <CardTitle>Crear o actualizar plan por nivel</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPlanAction} className="grid gap-4 lg:grid-cols-4">
            <input type="hidden" name="redirectTo" value="/admin/plans" />
            <Input label="Nombre" name="name" placeholder="Plan Premium" />
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Nivel
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="tier">
                <option value="BASIC">Basico</option>
                <option value="PREMIUM">Premium</option>
                <option value="ELITE">Elite</option>
              </select>
            </label>
            <Input label="Precio mensual" name="monthlyPrice" type="number" />
            <Input label="Descuento %" name="discountPercentage" type="number" defaultValue={0} />
            <Input label="Horas incluidas" name="hoursIncluded" type="number" defaultValue={4} />
            <label className="flex items-center gap-2 pt-7 text-sm font-medium text-slate-700">
              <input name="weeklyFixedReservation" type="checkbox" />
              Reserva fija semanal
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700 lg:col-span-2">
              Beneficios
              <textarea
                className="min-h-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                name="features"
                placeholder={"Reserva fija semanal\nRecordatorios por WhatsApp"}
              />
            </label>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Guardar plan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardContent className="grid gap-4 p-5 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] xl:items-end">
              <form action={updatePlanAction} className="contents">
                <input type="hidden" name="redirectTo" value="/admin/plans" />
                <input type="hidden" name="id" value={plan.id} />
                <Input label="Nombre" name="name" defaultValue={plan.name} />
                <Input label="Precio" name="monthlyPrice" type="number" defaultValue={plan.monthlyPrice} />
                <Input label="Descuento %" name="discountPercentage" type="number" defaultValue={plan.discountPercentage} />
                <Input label="Horas" name="hoursIncluded" type="number" defaultValue={plan.hoursIncluded} />
                <label className="flex items-center gap-2 pb-3 text-sm font-medium text-slate-700">
                  <input
                    name="weeklyFixedReservation"
                    type="checkbox"
                    defaultChecked={plan.weeklyFixedReservation}
                  />
                  Reserva fija
                </label>
                <Button type="submit" variant="secondary">
                  Actualizar
                </Button>
                <label className="grid gap-2 text-sm font-medium text-slate-700 xl:col-span-5">
                  Beneficios
                  <textarea
                    className="min-h-20 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    name="features"
                    defaultValue={plan.features.join("\n")}
                  />
                </label>
              </form>
              <div className="flex flex-col gap-2 text-sm text-slate-600 xl:col-span-6">
                <p>
                  {formatCurrency(plan.monthlyPrice)} · {plan.hoursIncluded} horas · {plan.discountPercentage}% descuento
                </p>
                <form action={deletePlanAction}>
                  <input type="hidden" name="redirectTo" value="/admin/plans" />
                  <input type="hidden" name="planId" value={plan.id} />
                  <Button type="submit" variant="secondary">
                    Eliminar plan
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
