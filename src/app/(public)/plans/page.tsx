import { MainLayout } from "@/frontend/components/layout/main-layout";
import { PageHeader } from "@/frontend/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { getSubscriptionPlans } from "@/backend/services/subscriptions.service";
import { formatCurrency } from "@/frontend/utils/format";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await getSubscriptionPlans();

  return (
    <MainLayout>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10">
        <PageHeader
          title="Planes para equipos"
          description="Planes mensuales con horas incluidas, descuentos y reserva fija semanal."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatCurrency(plan.monthlyPrice)}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {plan.hoursIncluded} horas incluidas · {plan.discountPercentage}% descuento
                </p>
                <ul className="mt-4 grid gap-2 text-sm text-slate-600">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
