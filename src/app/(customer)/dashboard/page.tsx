import { MetricCard } from "@/frontend/components/dashboard/metric-card";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { getClientPayments } from "@/backend/services/payments.service";
import { getClientReservations } from "@/backend/services/reservations.service";
import { getClientTeamSubscriptions } from "@/backend/services/subscriptions.service";
import { getClientTeams } from "@/backend/services/teams.service";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const [reservations, payments, teams, subscriptions] = await Promise.all([
    getClientReservations(),
    getClientPayments(),
    getClientTeams(),
    getClientTeamSubscriptions()
  ]);
  const pendingReservations = reservations.filter(
    (reservation) => reservation.paymentStatus === "pendiente"
  );

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Panel del cliente"
        description="Resumen de reservas, pagos, equipos y torneos inscritos."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Proximas reservas" value={reservations.length} />
        <MetricCard label="Pendientes de pago" value={pendingReservations.length} />
        <MetricCard label="Pagos registrados" value={payments.length} />
        <MetricCard label="Equipos creados" value={teams.length} />
        <MetricCard label="Torneos inscritos" value="1" />
        <MetricCard label="Planes activos" value={subscriptions.length} />
      </div>
    </div>
  );
}
