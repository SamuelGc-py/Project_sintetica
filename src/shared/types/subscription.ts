export type SubscriptionTier = "basic" | "premium" | "elite";

export type SubscriptionPlanSummary = {
  id: string;
  name: string;
  tier: SubscriptionTier;
  monthlyPrice: number;
  discountPercentage: number;
  hoursIncluded: number;
  weeklyFixedReservation: boolean;
  features: string[];
};

export type TeamSubscriptionSummary = {
  id: string;
  teamName: string;
  planName: string;
  status: "activa" | "en mora" | "cancelada" | "expirada";
  monthlyAmount: number;
  fixedCourtName?: string;
  fixedDayOfWeek?: number;
  fixedTime?: string;
};
