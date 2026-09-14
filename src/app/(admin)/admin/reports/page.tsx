import { MetricCard } from "@/frontend/components/dashboard/metric-card";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { getFinancialDashboard } from "@/backend/services/payments.service";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const dashboard = await getFinancialDashboard();

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Reportes financieros"
        description="Ingresos, reservas por cancha, horarios vendidos y cartera."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Ingresos diarios" value={dashboard.dailyRevenue} />
        <MetricCard label="Ingresos mensuales" value={dashboard.monthlyRevenue} />
        <MetricCard label="Reservas por cancha" value={dashboard.reservationsByCourt} />
        <MetricCard label="Horarios mas vendidos" value={dashboard.topTimeSlots} />
        <MetricCard label="Clientes frecuentes" value={dashboard.frequentCustomers} />
        <MetricCard label="Pagos pendientes" value={dashboard.pendingPayments} />
      </div>
    </div>
  );
}
