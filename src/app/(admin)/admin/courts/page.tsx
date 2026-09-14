import {
  createCourtAction,
  deleteCourtAction,
  updateCourtAction
} from "@/backend/actions/courts.actions";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { formatCurrency } from "@/frontend/utils/format";
import { getCourts } from "@/backend/services/courts.service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCourtsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const courts = await getCourts();

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gestion de canchas"
        description="Crea, edita y controla el estado de cada cancha."
      />
      <StatusMessage params={params} />

      <Card>
        <CardHeader>
          <CardTitle>Nueva cancha</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCourtAction} className="grid gap-4 md:grid-cols-5">
            <input type="hidden" name="redirectTo" value="/admin/courts" />
            <Input label="Nombre" name="name" placeholder="Cancha Norte" />
            <Input label="Tipo" name="type" placeholder="Futbol 5" />
            <Input label="Sede" name="location" placeholder="Sede principal" />
            <Input label="Precio/hora" name="hourlyRate" type="number" placeholder="90000" />
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Crear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {courts.map((court) => (
          <Card key={court.id}>
            <CardContent className="grid gap-4 p-5 xl:grid-cols-[1fr_1fr_1fr_1fr_280px_120px] xl:items-end">
              <form id={`update-${court.id}`} action={updateCourtAction} className="contents">
                <input type="hidden" name="redirectTo" value="/admin/courts" />
                <input type="hidden" name="id" value={court.id} />
                <Input label="Nombre" name="name" defaultValue={court.name} />
                <Input label="Tipo" name="type" defaultValue={court.type} />
                <Input label="Sede" name="location" defaultValue={court.location} />
                <Input
                  label="Precio/hora"
                  name="hourlyRate"
                  type="number"
                  defaultValue={court.hourlyRate}
                />
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Estado
                  <select
                    className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
                    name="status"
                    defaultValue={court.status === "activa" ? "ACTIVE" : court.status === "inactiva" ? "INACTIVE" : "MAINTENANCE"}
                  >
                    <option value="ACTIVE">Activa</option>
                    <option value="INACTIVE">Inactiva</option>
                    <option value="MAINTENANCE">Mantenimiento</option>
                  </select>
                </label>
                <Button type="submit" variant="secondary">
                  Guardar
                </Button>
              </form>
              <div className="xl:col-span-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <Badge variant={court.status === "activa" ? "success" : "muted"}>
                    {court.status}
                  </Badge>
                  <span>{formatCurrency(court.hourlyRate)} / hora</span>
                </div>
                <form action={deleteCourtAction}>
                  <input type="hidden" name="redirectTo" value="/admin/courts" />
                  <input type="hidden" name="courtId" value={court.id} />
                  <Button type="submit" variant="secondary">
                    Eliminar
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
