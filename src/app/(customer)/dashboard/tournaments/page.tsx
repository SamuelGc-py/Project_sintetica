import { TournamentCard } from "@/frontend/components/tournaments/tournament-card";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import {
  getCardsTable,
  getPublicTournaments,
  getScorers,
  getTournamentMatches,
  getTournamentStandings
} from "@/backend/services/tournaments.service";

export const dynamic = "force-dynamic";

export default async function ClientTournamentsPage() {
  const [tournaments, matches, standings, scorers, cards] = await Promise.all([
    getPublicTournaments(),
    getTournamentMatches(),
    getTournamentStandings(),
    getScorers(),
    getCardsTable()
  ]);

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Torneos inscritos"
        description="Inscripciones, calendario de partidos y estadisticas."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Partidos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {matches.map((match) => (
              <div key={match.id} className="rounded-md bg-slate-50 p-3 text-sm">
                <p className="font-semibold">
                  {match.homeTeamName} vs {match.awayTeamName}
                </p>
                <p className="text-slate-600">
                  {match.homeScore ?? "-"} - {match.awayScore ?? "-"} · {match.status}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabla de posiciones</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-2">Equipo</th>
                  <th>Pts</th>
                  <th>DG</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((standing) => (
                  <tr key={standing.teamId} className="border-t border-slate-100">
                    <td className="py-2">{standing.teamName}</td>
                    <td className="font-semibold">{standing.points}</td>
                    <td>{standing.goalDifference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Goleadores</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {scorers.map((scorer) => (
              <p key={scorer.playerId}>
                {scorer.playerName} · {scorer.teamName} · {scorer.goals} goles
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tarjetas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {cards.map((card) => (
              <p key={card.playerId}>
                {card.playerName} · Amarillas {card.yellowCards} · Rojas {card.redCards}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
