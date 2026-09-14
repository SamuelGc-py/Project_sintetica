import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";

const hours = ["6:00 p.m.", "7:00 p.m.", "8:00 p.m.", "9:00 p.m."];

export function ReservationCalendarPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disponibilidad</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-sm font-semibold">Fecha</p>
            <p className="mt-1 text-sm text-slate-600">Seleccion pendiente</p>
          </div>
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-sm font-semibold">Cancha</p>
            <p className="mt-1 text-sm text-slate-600">Cancha Norte</p>
          </div>
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-sm font-semibold">Duracion</p>
            <p className="mt-1 text-sm text-slate-600">60 minutos</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {hours.map((hour) => (
            <Button key={hour} type="button" variant="secondary">
              {hour}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
