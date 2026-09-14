import { PageHeader } from "@/frontend/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { getCourts } from "@/backend/services/courts.service";
import { formatCurrency } from "@/frontend/utils/format";

export const dynamic = "force-dynamic";

export default async function ClientCourtsPage() {
  const courts = await getCourts({ activeOnly: true });

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Canchas disponibles"
        description="Listado inicial preparado para conectar disponibilidad real."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {courts.map((court) => (
          <Card key={court.id}>
            <CardHeader>
              <CardTitle>{court.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-600">
              <Badge>{court.status}</Badge>
              <p>{court.type}</p>
              <p>{court.location}</p>
              <p className="font-semibold text-ink">
                {formatCurrency(court.hourlyRate)} / hora
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
