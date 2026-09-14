import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import type { TournamentSummary } from "@/shared/types/tournament";
import { formatCurrency } from "@/frontend/utils/format";

export function TournamentCard({
  tournament
}: {
  tournament: TournamentSummary;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{tournament.name}</CardTitle>
          <Badge>{tournament.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-slate-600">
        <p>{tournament.description}</p>
        <p>{tournament.registeredTeams} equipos inscritos</p>
        <p>Inscripcion: {formatCurrency(tournament.inscriptionFee)}</p>
      </CardContent>
    </Card>
  );
}
