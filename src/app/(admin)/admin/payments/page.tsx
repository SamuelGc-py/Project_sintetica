import { simulatePaymentAction, updatePaymentStatusAction } from "@/backend/actions/payments.actions";
import { PaymentStatusCard } from "@/frontend/components/payments/payment-status-card";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Button } from "@/frontend/components/ui/button";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { getAdminPayments } from "@/backend/services/payments.service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPaymentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const payments = await getAdminPayments();

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gestion de pagos"
        description="Pagos de reserva, suscripcion y torneos. Pasarela pendiente."
      />
      <StatusMessage params={params} />
      <div className="grid gap-4 md:grid-cols-2">
        {payments.map((payment) => (
          <div key={payment.id} className="grid gap-3">
            <PaymentStatusCard payment={payment} />
            <div className="grid gap-2 md:grid-cols-2">
              {payment.status === "pendiente" ? (
                <form action={simulatePaymentAction}>
                  <input type="hidden" name="paymentId" value={payment.id} />
                  <input type="hidden" name="redirectTo" value="/admin/payments" />
                  <Button type="submit" className="w-full">
                    Simular pago exitoso
                  </Button>
                </form>
              ) : null}
              <form action={updatePaymentStatusAction} className="grid grid-cols-[1fr_auto] gap-2">
                <input type="hidden" name="paymentId" value={payment.id} />
                <input type="hidden" name="redirectTo" value="/admin/payments" />
                <select
                  className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
                  name="status"
                  defaultValue="PENDING"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="PAID">Pagado</option>
                  <option value="FAILED">Fallido</option>
                  <option value="REFUNDED">Reembolsado</option>
                </select>
                <Button type="submit" variant="secondary">
                  Cambiar
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
