import { getCourts } from "@/backend/services/courts.service";
import { ReservationForm } from "@/frontend/components/reservations/reservation-form";
import { MainLayout } from "@/frontend/components/layout/main-layout";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { StatusMessage } from "@/frontend/components/ui/status-message";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReservationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const courts = await getCourts({ activeOnly: true });

  return (
    <MainLayout>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10">
        <PageHeader
          title="Reservar Cancha en Linea"
          description="Selecciona tu cancha, fecha y horario. La reserva se guarda en tiempo real en la base de datos."
        />
        <StatusMessage params={params} />
        <ReservationForm courts={courts} />
      </section>
    </MainLayout>
  );
}
