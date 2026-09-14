import {
  createMatchAction,
  createTournamentAction,
  deleteTournamentAction,
  enrollTeamAction,
  recordMatchResultAction,
  registerCardAction,
  registerGoalAction,
  updateTournamentAction
} from "@/backend/actions/tournaments.actions";
import type { ReactNode } from "react";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { StatusMessage } from "@/frontend/components/ui/status-message";
import { formatCurrency } from "@/frontend/utils/format";
import { getCourts } from "@/backend/services/courts.service";
import { getAllTeams } from "@/backend/services/teams.service";
import {
  getCardsTable,
  getPublicTournaments,
  getScorers,
  getTournamentMatches,
  getTournamentStandings
} from "@/backend/services/tournaments.service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminTournamentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [tournaments, teams, courts, matches, standings, scorers, cards] =
    await Promise.all([
      getPublicTournaments(),
      getAllTeams(),
      getCourts({ activeOnly: true }),
      getTournamentMatches(),
      getTournamentStandings(),
      getScorers(),
      getCardsTable()
    ]);

  const players = teams.flatMap((team) =>
    team.players.map((player) => ({
      ...player,
      teamId: team.id,
      teamName: team.name
    }))
  );

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gestion de torneos"
        description="Torneos, inscripciones, partidos, resultados y estadisticas."
      />
      <StatusMessage params={params} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crear torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createTournamentAction} className="grid gap-4">
              <input type="hidden" name="redirectTo" value="/admin/tournaments" />
              <Input label="Nombre" name="name" placeholder="Copa Nocturna" />
              <Input label="Inscripcion" name="inscriptionFee" type="number" defaultValue={0} />
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Descripcion
                <textarea
                  className="min-h-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  name="description"
                />
              </label>
              <Button type="submit">Crear torneo</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inscribir equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={enrollTeamAction} className="grid gap-4">
              <input type="hidden" name="redirectTo" value="/admin/tournaments" />
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Torneo
                <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="tournamentId">
                  {tournaments.map((tournament) => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Equipo
                <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="teamId">
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>
              <Button type="submit">Inscribir</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {tournaments.map((tournament) => (
          <Card key={tournament.id}>
            <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
              <form action={updateTournamentAction} className="contents">
                <input type="hidden" name="redirectTo" value="/admin/tournaments" />
                <input type="hidden" name="id" value={tournament.id} />
                <Input label="Nombre" name="name" defaultValue={tournament.name} />
                <Input
                  label="Inscripcion"
                  name="inscriptionFee"
                  type="number"
                  defaultValue={tournament.inscriptionFee}
                />
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Estado
                  <select
                    className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
                    name="status"
                    defaultValue="OPEN"
                  >
                    <option value="DRAFT">Borrador</option>
                    <option value="OPEN">Inscripciones abiertas</option>
                    <option value="IN_PROGRESS">En curso</option>
                    <option value="FINISHED">Finalizado</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </label>
                <Input label="Descripcion" name="description" defaultValue={tournament.description} />
                <Button type="submit" variant="secondary">
                  Actualizar
                </Button>
              </form>
              <div className="lg:col-span-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <Badge>{tournament.status}</Badge>
                  <span>{tournament.registeredTeams} equipos</span>
                  <span>{formatCurrency(tournament.inscriptionFee)}</span>
                </div>
                <form action={deleteTournamentAction}>
                  <input type="hidden" name="redirectTo" value="/admin/tournaments" />
                  <input type="hidden" name="tournamentId" value={tournament.id} />
                  <Button type="submit" variant="secondary">
                    Eliminar
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crear partido</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createMatchAction} className="grid gap-4 lg:grid-cols-6">
            <input type="hidden" name="redirectTo" value="/admin/tournaments" />
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Torneo
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="tournamentId">
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Local
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="homeTeamId">
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Visitante
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="awayTeamId">
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Cancha
              <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="courtId">
                <option value="">Sin cancha</option>
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Fecha" name="date" type="date" />
            <Input label="Hora" name="time" type="time" />
            <div className="lg:col-span-6">
              <Button type="submit">Crear partido</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partidos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {matches.map((match) => (
            <div key={match.id} className="grid gap-4 rounded-md border border-slate-200 p-3 lg:grid-cols-[1fr_1fr_280px] lg:items-center">
              <div>
                <p className="font-semibold">
                  {match.homeTeamName} vs {match.awayTeamName}
                </p>
                <p className="text-sm text-slate-600">
                  {match.tournamentName} · {match.courtName ?? "Sin cancha"} · {match.status}
                </p>
              </div>
              <p className="text-lg font-bold">
                {match.homeScore ?? "-"} - {match.awayScore ?? "-"}
              </p>
              <form action={recordMatchResultAction} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input type="hidden" name="redirectTo" value="/admin/tournaments" />
                <input type="hidden" name="matchId" value={match.id} />
                <Input aria-label="Goles local" name="homeScore" type="number" defaultValue={match.homeScore ?? 0} />
                <Input aria-label="Goles visitante" name="awayScore" type="number" defaultValue={match.awayScore ?? 0} />
                <Button type="submit" variant="secondary">
                  Guardar
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Registrar gol</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={registerGoalAction} className="grid gap-4">
              <input type="hidden" name="redirectTo" value="/admin/tournaments" />
              <MatchAndPlayerFields matches={matches} teams={teams} players={players} />
              <Input label="Minuto" name="minute" type="number" />
              <Button type="submit">Registrar gol</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registrar tarjeta</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={registerCardAction} className="grid gap-4">
              <input type="hidden" name="redirectTo" value="/admin/tournaments" />
              <MatchAndPlayerFields matches={matches} teams={teams} players={players} />
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Tipo
                <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="type">
                  <option value="YELLOW">Amarilla</option>
                  <option value="RED">Roja</option>
                </select>
              </label>
              <Input label="Minuto" name="minute" type="number" />
              <Button type="submit">Registrar tarjeta</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <StatsTable title="Tabla de posiciones" headers={["Equipo", "PJ", "G", "E", "P", "GF", "GC", "DG", "Pts"]}>
          {standings.map((standing) => (
            <tr key={standing.teamId} className="border-t border-slate-100">
              <td className="py-2">{standing.teamName}</td>
              <td>{standing.played}</td>
              <td>{standing.wins}</td>
              <td>{standing.draws}</td>
              <td>{standing.losses}</td>
              <td>{standing.goalsFor}</td>
              <td>{standing.goalsAgainst}</td>
              <td>{standing.goalDifference}</td>
              <td className="font-semibold">{standing.points}</td>
            </tr>
          ))}
        </StatsTable>

        <StatsTable title="Goleadores" headers={["Jugador", "Equipo", "Goles"]}>
          {scorers.map((scorer) => (
            <tr key={scorer.playerId} className="border-t border-slate-100">
              <td className="py-2">{scorer.playerName}</td>
              <td>{scorer.teamName}</td>
              <td className="font-semibold">{scorer.goals}</td>
            </tr>
          ))}
        </StatsTable>

        <StatsTable title="Tarjetas" headers={["Jugador", "Equipo", "A", "R"]}>
          {cards.map((card) => (
            <tr key={card.playerId} className="border-t border-slate-100">
              <td className="py-2">{card.playerName}</td>
              <td>{card.teamName}</td>
              <td>{card.yellowCards}</td>
              <td>{card.redCards}</td>
            </tr>
          ))}
        </StatsTable>
      </div>
    </div>
  );
}

function MatchAndPlayerFields({
  matches,
  teams,
  players
}: {
  matches: Awaited<ReturnType<typeof getTournamentMatches>>;
  teams: Awaited<ReturnType<typeof getAllTeams>>;
  players: Array<{
    id: string;
    name: string;
    teamId: string;
    teamName: string;
  }>;
}) {
  return (
    <>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Partido
        <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="matchId">
          {matches.map((match) => (
            <option key={match.id} value={match.id}>
              {match.homeTeamName} vs {match.awayTeamName}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Equipo
        <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="teamId">
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Jugador
        <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" name="playerId">
          <option value="">Sin jugador</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name} - {player.teamName}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

function StatsTable({
  title,
  headers,
  children
}: {
  title: string;
  headers: string[];
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="pb-2 pr-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
