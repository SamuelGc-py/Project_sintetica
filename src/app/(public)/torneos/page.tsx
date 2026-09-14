import { MainLayout } from "@/frontend/components/layout/main-layout";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { TournamentCard } from "@/frontend/components/tournaments/tournament-card";
import { getPublicTournaments } from "@/backend/services/tournaments.service";

export const dynamic = "force-dynamic";

export default async function TournamentsPage() {
  const tournaments = await getPublicTournaments();

  return (
    <MainLayout>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10">
        <PageHeader
          title="Torneos"
          description="Estructura lista para inscripciones, partidos y estadisticas."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
