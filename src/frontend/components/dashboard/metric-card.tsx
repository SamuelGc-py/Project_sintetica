import { Card, CardContent } from "@/frontend/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string | number;
};

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-slate-600">{label}</p>
        <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      </CardContent>
    </Card>
  );
}
