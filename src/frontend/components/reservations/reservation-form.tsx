"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { formatCurrency } from "@/frontend/utils/format";
import type { CourtSummary } from "@/shared/types/reservation";
import { createReservationAction } from "@/backend/actions/reservations.actions";

type ReservationFormProps = {
  courts: CourtSummary[];
};

const defaultHours = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
];

export function ReservationForm({ courts }: ReservationFormProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedCourtId, setSelectedCourtId] = useState<string>(courts[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>("18:00");

  const selectedCourt = courts.find((c) => c.id === selectedCourtId) ?? courts[0];
  const hourlyRate = selectedCourt ? selectedCourt.hourlyRate : 90000;
  const depositAmount = Math.ceil((hourlyRate * 0.3) / 1000) * 1000;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Selecciona Cancha, Fecha y Hora</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form action={createReservationAction} className="grid gap-5">
            <input type="hidden" name="redirectTo" value="/reservas" />
            <input type="hidden" name="courtId" value={selectedCourtId} />
            <input type="hidden" name="date" value={selectedDate} />
            <input type="hidden" name="time" value={selectedTime} />
            <input type="hidden" name="durationMinutes" value="60" />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Cancha Disponible
                </label>
                <select
                  value={selectedCourtId}
                  onChange={(e) => setSelectedCourtId(e.target.value)}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-brand-600 focus:outline-none"
                >
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name} ({court.type}) - {formatCurrency(court.hourlyRate)}/h
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Fecha de Reserva
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={todayStr}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-brand-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Horario Disponible (Turnos de 60 mins)
              </label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {defaultHours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => setSelectedTime(hour)}
                    className={`h-10 rounded-md text-sm font-semibold transition ${
                      selectedTime === hour
                        ? "bg-brand-600 text-white shadow"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <Input
                label="Notas / Comentarios (opcional)"
                name="notes"
                placeholder="Ej. Balon prestado o petos"
              />
            </div>

            <Button type="submit" className="w-full text-base py-3">
              Confirmar y Crear Reserva en Base de Datos
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Resumen de Pago</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-between border-b border-slate-100 pb-2 text-sm">
            <span className="text-slate-600">Cancha seleccionada:</span>
            <span className="font-semibold">{selectedCourt?.name ?? "Cancha"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2 text-sm">
            <span className="text-slate-600">Fecha y Hora:</span>
            <span className="font-semibold">{selectedDate} a las {selectedTime}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2 text-sm">
            <span className="text-slate-600">Precio total hora:</span>
            <span className="font-semibold">{formatCurrency(hourlyRate)}</span>
          </div>
          <div className="rounded-lg bg-brand-50 p-4">
            <div className="flex justify-between text-sm font-bold text-brand-800">
              <span>Anticipo a pagar (30%):</span>
              <span>{formatCurrency(depositAmount)}</span>
            </div>
            <p className="mt-1 text-xs text-brand-600">
              El saldo restante se liquida al llegar a la cancha.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
