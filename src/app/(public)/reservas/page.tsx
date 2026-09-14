import { ReservationCalendarPlaceholder } from "@/frontend/components/reservations/reservation-calendar-placeholder";
import { ReservationSummary } from "@/frontend/components/reservations/reservation-summary";
import { MainLayout } from "@/frontend/components/layout/main-layout";
import { PageHeader } from "@/frontend/components/layout/page-header";

export default function ReservationsPage() {
  return (
    <MainLayout>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10">
        <PageHeader
          title="Reservar cancha"
          description="Flujo inicial para seleccionar fecha, hora, cancha y anticipo."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <ReservationCalendarPlaceholder />
          <ReservationSummary />
        </div>
      </section>
    </MainLayout>
  );
}
