import { MetricCard } from "@/frontend/components/dashboard/metric-card";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { getFinancialDashboard } from "@/backend/services/payments.service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const dashboard = await getFinancialDashboard();

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Dashboard administrativo"
        description="Vista general para la operacion de la cancha."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Reservas de hoy" value={dashboard.reservationsToday} />
        <MetricCard label="Ingresos de hoy" value={dashboard.dailyRevenue} />
        <MetricCard label="Ingresos del mes" value={dashboard.monthlyRevenue} />
        <MetricCard label="Pagos pendientes" value={dashboard.pendingPayments} />
        <MetricCard label="Canchas activas" value={dashboard.activeCourts} />
        <MetricCard label="Proximos partidos" value={dashboard.upcomingMatches} />
        <MetricCard label="Equipos suscritos" value={dashboard.activeSubscriptions} />
      </div>
    </div>
  );
}
