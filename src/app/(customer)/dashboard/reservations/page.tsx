import { createReservationAction } from "@/backend/actions/reservations.actions";
import { simulatePaymentAction } from "@/backend/actions/payments.actions";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { EmptyState } from "@/frontend/components/ui/empty-state";
import { Input } from "@/frontend/components/ui/input";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { formatCurrency } from "@/frontend/utils/format";
import { getCurrentSession } from "@/backend/integrations/auth/session";
import { getClientPayments } from "@/backend/services/payments.service";
import {
  getAvailableCourts,
  getAvailableSlots,
  getClientReservations
} from "@/backend/services/reservations.service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(
  params: Record<string, string | string[] | undefined> | undefined,
  key: string
) {
  const value = params?.[key];
  return Array.isArray(value) ? value[0] : value;
}

function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function reservationVariant(status: string) {
  if (status === "confirmada" || status === "completada") {
    return "success";
  }

  if (status === "cancelada") {
    return "danger";
  }

  return "warning";
}

export default async function ClientReservationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await getCurrentSession();
  const userId = session?.userId ?? "client-1";
  const courts = await getAvailableCourts();
  const selectedCourtId = getSingleParam(params, "courtId") ?? courts[0]?.id ?? "";
  const selectedDate = getSingleParam(params, "date") ?? getTomorrowDate();
  const slots = await getAvailableSlots(selectedCourtId, selectedDate);
  const selectedCourt = courts.find((court) => court.id === selectedCourtId);
  const previewTotal = selectedCourt?.hourlyRate ?? 0;
  const previewDeposit = Math.ceil(previewTotal * 0.3 / 1000) * 1000;
  const [reservations, payments] = await Promise.all([
    getClientReservations(userId),
    getClientPayments(userId)
  ]);

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Mis reservas"
        description="Crea reservas, consulta estados y paga anticipos simulados."
      />
      <StatusMessage params={params} />

      <Card>
        <CardHeader>
          <CardTitle>Nueva reserva</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <form className="grid gap-4 md:grid-cols-3" method="get">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Cancha
              <select
                className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
                name="courtId"
                defaultValue={selectedCourtId}
              >
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name} - {formatCurrency(court.hourlyRate)}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Fecha" name="date" type="date" defaultValue={selectedDate} />
            <div className="flex items-end">
              <Button type="submit" variant="secondary" className="w-full">
                Ver horarios
              </Button>
            </div>
          </form>

          <form action={createReservationAction} className="grid gap-4 rounded-lg bg-slate-50 p-4 md:grid-cols-4">
            <input type="hidden" name="redirectTo" value="/dashboard/reservations" />
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="courtId" value={selectedCourtId} />
            <input type="hidden" name="date" value={selectedDate} />
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Hora disponible
              <select
                className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
                name="time"
                disabled={slots.length === 0}
              >
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Duracion" name="durationMinutes" type="number" defaultValue={60} />
            <div className="rounded-md bg-white p-3 text-sm">
              <p className="text-slate-600">Valor</p>
              <p className="font-semibold">{formatCurrency(previewTotal)}</p>
              <p className="mt-1 text-slate-600">Anticipo {formatCurrency(previewDeposit)}</p>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full" disabled={slots.length === 0}>
                Crear reserva
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {reservations.length === 0 ? (
          <EmptyState message="Todavia no tienes reservas." />
        ) : (
          reservations.map((reservation) => {
            const pendingPayment = payments.find(
              (payment) =>
                payment.reservationId === reservation.id &&
                payment.status === "pendiente"
            );

            return (
              <Card key={reservation.id}>
                <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr_1fr_220px] lg:items-center">
                  <div>
                    <p className="font-semibold">{reservation.courtName}</p>
                    <p className="text-sm text-slate-600">
                      {reservation.date} - {reservation.startTime}
                    </p>
                  </div>
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
                  {pendingPayment ? (
                    <form action={simulatePaymentAction}>
                      <input type="hidden" name="paymentId" value={pendingPayment.id} />
                      <input type="hidden" name="redirectTo" value="/dashboard/reservations" />
                      <Button type="submit" className="w-full">
                        Simular pago exitoso
                      </Button>
                    </form>
                  ) : (
                    <p className="text-sm text-slate-500">Sin pago pendiente</p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
