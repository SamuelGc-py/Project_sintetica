import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import type { PaymentSummary } from "@/shared/types/payment";
import { formatCurrency } from "@/frontend/utils/format";

export function PaymentStatusCard({ payment }: { payment: PaymentSummary }) {
  const variant = payment.status === "pagado" ? "success" : payment.status === "fallido" ? "danger" : "warning";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{payment.description}</CardTitle>
          <Badge variant={variant}>{payment.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-slate-600">
        {payment.customerName ? <p>Cliente: {payment.customerName}</p> : null}
        <p>Tipo: {payment.purpose}</p>
        <p className="text-xl font-bold text-ink">
          {formatCurrency(payment.amount)}
        </p>
        <p>Proveedor: {payment.provider ?? "Pendiente por integrar"}</p>
      </CardContent>
    </Card>
  );
}
