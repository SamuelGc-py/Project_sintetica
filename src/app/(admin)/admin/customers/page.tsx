import { PageHeader } from "@/frontend/components/layout/page-header";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { getCustomers } from "@/backend/services/users.service";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gestion de clientes"
        description="Clientes frecuentes, historial de reservas y contacto."
      />
      <div className="grid gap-4">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="grid gap-2 p-5 md:grid-cols-5 md:items-center">
              <p className="font-semibold">{customer.name}</p>
              <p className="text-sm text-slate-600">{customer.email}</p>
              <p className="text-sm text-slate-600">{customer.phone ?? "Sin telefono"}</p>
              <p className="text-sm text-slate-600">
                {customer.reservations} reservas
              </p>
              <p className="text-sm text-slate-600">{customer.teams} equipos</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
