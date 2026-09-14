import { PageHeader } from "@/frontend/components/layout/page-header";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { getAllTeams } from "@/backend/services/teams.service";

export const dynamic = "force-dynamic";

export default async function AdminTeamsPage() {
  const teams = await getAllTeams();

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gestion de equipos"
        description="Equipos, jugadores, capitanes y planes activos."
      />
      <div className="grid gap-4">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{team.name}</CardTitle>
                  <p className="text-sm text-slate-600">
                    Capitan: {team.captainName ?? "Sin capitan"} · {team.city ?? "Sin ciudad"}
                  </p>
                </div>
                {team.activePlanName ? <Badge>{team.activePlanName}</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {team.players.map((player) => (
                <div key={player.id} className="grid gap-2 rounded-md bg-slate-50 p-3 text-sm md:grid-cols-4">
                  <p className="font-medium">{player.name}</p>
                  <p>{player.documentNumber ?? "Sin documento"}</p>
                  <p>Camiseta {player.jerseyNumber ?? "-"}</p>
                  <p>{player.position ?? "Sin posicion"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
