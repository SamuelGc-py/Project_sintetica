import { PageHeader } from "@/frontend/components/layout/page-header";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { getAdminReservations } from "@/backend/services/reservations.service";
import { formatCurrency } from "@/frontend/utils/format";
import { updateReservationStatusAction } from "@/backend/actions/reservations.actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function reservationVariant(status: string) {
  if (status === "confirmada" || status === "completada") {
    return "success";
  }

  if (status === "cancelada") {
    return "danger";
  }

  return "warning";
}

export default async function AdminReservationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const reservations = await getAdminReservations();

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gestion de reservas"
        description="Calendario, estados, anticipos y cambios de horario."
      />
      <StatusMessage params={params} />
      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr_1fr_1fr_220px] lg:items-center">
              <div>
                <p className="font-semibold">{reservation.customerName}</p>
                <p className="text-sm text-slate-600">{reservation.courtName}</p>
              </div>
              <p className="text-sm text-slate-600">
                {reservation.date} - {reservation.startTime}
              </p>
              <div className="text-sm">
                <p className="font-semibold">
                  {formatCurrency(reservation.totalAmount)}
                </p>
                <p className="text-slate-600">
                  Anticipo {formatCurrency(reservation.depositAmount)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={reservationVariant(reservation.status)}>
                  {reservation.status}
                </Badge>
                {reservation.paymentStatus ? (
                  <Badge variant={reservation.paymentStatus === "pagado" ? "success" : "warning"}>
                    pago {reservation.paymentStatus}
                  </Badge>
                ) : null}
              </div>
              <form action={updateReservationStatusAction} className="grid gap-2">
                <input type="hidden" name="reservationId" value={reservation.id} />
                <input type="hidden" name="redirectTo" value="/admin/reservations" />
                <select
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                  name="status"
                  defaultValue="CONFIRMED"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="CONFIRMED">Confirmada</option>
                  <option value="CANCELLED">Cancelada</option>
                  <option value="COMPLETED">Completada</option>
                </select>
                <button className="h-10 rounded-md bg-brand-600 px-3 text-sm font-semibold text-white" type="submit">
                  Actualizar
                </button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
