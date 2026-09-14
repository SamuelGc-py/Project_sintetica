import {
  cancelTeamSubscriptionAction,
  createTeamSubscriptionAction
} from "@/backend/actions/plans.actions";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { formatCurrency } from "@/frontend/utils/format";
import { getCourts } from "@/backend/services/courts.service";
import {
  getSubscriptionPlans,
  getTeamSubscriptions
} from "@/backend/services/subscriptions.service";
import { getAllTeams } from "@/backend/services/teams.service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const days = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

export default async function AdminSubscriptionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [teams, plans, courts, subscriptions] = await Promise.all([
    getAllTeams(),
    getSubscriptionPlans(),
    getCourts({ activeOnly: true }),
    getTeamSubscriptions()
  ]);

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Suscripciones de equipos"
        description="Asocia equipos a planes y crea reservas fijas semanales."
      />
      <StatusMessage params={params} />

      <Card>
        <CardHeader>
          <CardTitle>Nueva suscripcion</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTeamSubscriptionAction} className="grid gap-4 lg:grid-cols-3">
            <input type="hidden" name="redirectTo" value="/admin/subscriptions" />
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Equipo
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="teamId">
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Plan
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="planId">
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {formatCurrency(plan.monthlyPrice)}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Cancha fija
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="fixedCourtId">
                <option value="">Sin reserva fija</option>
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Dia fijo
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="fixedDayOfWeek">
                <option value="-1">Sin dia fijo</option>
                {days.map((day, index) => (
                  <option key={day} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Hora fija" name="fixedTime" type="time" />
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Crear suscripcion
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-center">
              <div>
                <p className="font-semibold">{subscription.teamName}</p>
                <p className="text-sm text-slate-600">{subscription.planName}</p>
              </div>
              <p className="font-semibold">{formatCurrency(subscription.monthlyAmount)}</p>
              <p className="text-sm text-slate-600">
                {subscription.fixedCourtName ?? "Sin cancha fija"}
                {subscription.fixedDayOfWeek !== undefined && subscription.fixedTime
                  ? ` · ${days[subscription.fixedDayOfWeek]} ${subscription.fixedTime}`
                  : ""}
              </p>
              <Badge variant={subscription.status === "activa" ? "success" : "muted"}>
                {subscription.status}
              </Badge>
              <form action={cancelTeamSubscriptionAction}>
                <input type="hidden" name="redirectTo" value="/admin/subscriptions" />
                <input type="hidden" name="subscriptionId" value={subscription.id} />
                <Button type="submit" variant="secondary">
                  Cancelar
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
