import {
  addPlayerAction,
  createTeamAction,
  updateTeamAction
} from "@/backend/actions/teams.actions";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { getCurrentSession } from "@/backend/integrations/auth/session";
import { getClientTeams } from "@/backend/services/teams.service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ClientTeamsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await getCurrentSession();
  const userId = session?.userId ?? "client-1";
  const teams = await getClientTeams(userId);

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Mis equipos"
        description="Crea equipos, edita datos y agrega jugadores."
      />
      <StatusMessage params={params} />

      <Card>
        <CardHeader>
          <CardTitle>Crear equipo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTeamAction} className="grid gap-4 md:grid-cols-4">
            <input type="hidden" name="redirectTo" value="/dashboard/teams" />
            <input type="hidden" name="captainId" value={userId} />
            <Input label="Nombre" name="name" placeholder="Barrio FC" />
            <Input label="Telefono" name="contactPhone" placeholder="+57 300..." />
            <Input label="Ciudad" name="city" placeholder="Bogota" />
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Crear equipo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle>{team.name}</CardTitle>
                {team.activePlanName ? <Badge>{team.activePlanName}</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="grid gap-5">
              <form action={updateTeamAction} className="grid gap-4 md:grid-cols-4">
                <input type="hidden" name="redirectTo" value="/dashboard/teams" />
                <input type="hidden" name="id" value={team.id} />
                <Input label="Nombre" name="name" defaultValue={team.name} />
                <Input label="Telefono" name="contactPhone" defaultValue={team.contactPhone} />
                <Input label="Ciudad" name="city" defaultValue={team.city} />
                <div className="flex items-end">
                  <Button type="submit" variant="secondary" className="w-full">
                    Actualizar
                  </Button>
                </div>
              </form>

              <div className="grid gap-3">
                <p className="text-sm font-semibold">Jugadores</p>
                {team.players.map((player) => (
                  <div key={player.id} className="grid gap-2 rounded-md bg-slate-50 p-3 text-sm md:grid-cols-4">
                    <p className="font-medium">{player.name}</p>
                    <p>{player.documentNumber ?? "Sin documento"}</p>
                    <p>Camiseta {player.jerseyNumber ?? "-"}</p>
                    <p>{player.position ?? "Sin posicion"}</p>
                  </div>
                ))}
              </div>

              <form action={addPlayerAction} className="grid gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-5">
                <input type="hidden" name="redirectTo" value="/dashboard/teams" />
                <input type="hidden" name="teamId" value={team.id} />
                <Input label="Jugador" name="name" />
                <Input label="Documento" name="documentNumber" />
                <Input label="Camiseta" name="jerseyNumber" type="number" />
                <Input label="Posicion" name="position" />
                <div className="flex items-end">
                  <Button type="submit" className="w-full">
                    Agregar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
