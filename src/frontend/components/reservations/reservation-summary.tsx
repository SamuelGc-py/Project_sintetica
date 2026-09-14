import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { formatCurrency } from "@/frontend/utils/format";

export function ReservationSummary() {
  const total = 90000;
  const deposit = 30000;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Valor total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Anticipo requerido</span>
          <strong>{formatCurrency(deposit)}</strong>
        </div>
        <div className="rounded-md bg-brand-50 p-3 text-brand-800">
          Estado inicial: pendiente
        </div>
        <Button type="button">Continuar reserva</Button>
      </CardContent>
    </Card>
  );
}
