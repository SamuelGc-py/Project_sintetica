export type PaymentStatus = "pendiente" | "pagado" | "fallido" | "reembolsado";

export type PaymentPurpose = "reserva" | "suscripcion" | "torneo";

export type PaymentSummary = {
  id: string;
  reservationId?: string;
  description: string;
  amount: number;
  currency: "COP";
  purpose: PaymentPurpose;
  status: PaymentStatus;
  provider?: "wompi" | "mercadopago" | "mock";
  customerName?: string;
  paidAt?: string;
};
