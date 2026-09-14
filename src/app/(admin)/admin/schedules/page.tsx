import {
  createBlockedSlotAction,
  createScheduleConfigAction,
  deleteBlockedSlotAction
} from "@/backend/actions/schedules.actions";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { getCourts } from "@/backend/services/courts.service";
import { getBlockedSlots, getScheduleConfigs } from "@/backend/services/schedules.service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const days = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

export default async function AdminSchedulesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [courts, schedules, blockedSlots] = await Promise.all([
    getCourts(),
    getScheduleConfigs(),
    getBlockedSlots()
  ]);

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gestion de horarios"
        description="Bloques disponibles, cierres y horarios especiales."
      />
      <StatusMessage params={params} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crear horario disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createScheduleConfigAction} className="grid gap-4">
              <input type="hidden" name="redirectTo" value="/admin/schedules" />
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Cancha
                <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="courtId">
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Dia
                <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="dayOfWeek">
                  {days.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                <Input label="Abre" name="opensAt" type="time" defaultValue="06:00" />
                <Input label="Cierra" name="closesAt" type="time" defaultValue="23:00" />
                <Input label="Minutos" name="slotMinutes" type="number" defaultValue={60} />
              </div>
              <Button type="submit">Crear horario</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bloquear horario</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createBlockedSlotAction} className="grid gap-4">
              <input type="hidden" name="redirectTo" value="/admin/schedules" />
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Cancha
                <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="courtId">
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                <Input label="Fecha" name="date" type="date" />
                <Input label="Inicio" name="startsAt" type="time" />
                <Input label="Fin" name="endsAt" type="time" />
              </div>
              <Input label="Motivo" name="reason" placeholder="Mantenimiento" />
              <Button type="submit">Bloquear</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Horarios configurados</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="rounded-md border border-slate-200 p-3 text-sm">
                <p className="font-semibold">
                  {schedule.courtName ?? "Global"} - {days[schedule.dayOfWeek]}
                </p>
                <p className="text-slate-600">
                  {schedule.opensAt} a {schedule.closesAt} cada {schedule.slotMinutes} minutos
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bloqueos activos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {blockedSlots.map((slot) => (
              <div key={slot.id} className="flex flex-col gap-3 rounded-md border border-slate-200 p-3 text-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{slot.courtName}</p>
                  <p className="text-slate-600">
                    {new Date(slot.startsAt).toLocaleString("es-CO")} - {new Date(slot.endsAt).toLocaleTimeString("es-CO")}
                  </p>
                  {slot.reason ? <p className="text-slate-600">{slot.reason}</p> : null}
                </div>
                <form action={deleteBlockedSlotAction}>
                  <input type="hidden" name="redirectTo" value="/admin/schedules" />
                  <input type="hidden" name="slotId" value={slot.id} />
                  <Button type="submit" variant="secondary">
                    Quitar
                  </Button>
                </form>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
