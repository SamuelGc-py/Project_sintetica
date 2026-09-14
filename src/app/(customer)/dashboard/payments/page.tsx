import { simulatePaymentAction } from "@/backend/actions/payments.actions";
import { PaymentStatusCard } from "@/frontend/components/payments/payment-status-card";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Button } from "@/frontend/components/ui/button";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { getCurrentSession } from "@/backend/integrations/auth/session";
import { getClientPayments } from "@/backend/services/payments.service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ClientPaymentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await getCurrentSession();
  const payments = await getClientPayments(session?.userId ?? "client-1");

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Mis pagos"
        description="Pagos de reservas, suscripciones y torneos."
      />
      <StatusMessage params={params} />
      <div className="grid gap-4 md:grid-cols-2">
        {payments.map((payment) => (
          <div key={payment.id} className="grid gap-3">
            <PaymentStatusCard payment={payment} />
            {payment.status === "pendiente" ? (
              <form action={simulatePaymentAction}>
                <input type="hidden" name="paymentId" value={payment.id} />
                <input type="hidden" name="redirectTo" value="/dashboard/payments" />
                <Button type="submit" className="w-full">
                  Simular pago exitoso
                </Button>
              </form>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
