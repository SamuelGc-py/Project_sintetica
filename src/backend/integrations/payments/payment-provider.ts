import type { PaymentPurpose } from "@/shared/types/payment";

export type CreatePaymentIntentInput = {
  amount: number;
  currency: "COP";
  purpose: PaymentPurpose;
  reference: string;
};

export type PaymentIntent = {
  provider: "wompi" | "mercadopago" | "mock";
  reference: string;
  checkoutUrl?: string;
};

export async function createPaymentIntent(
  input: CreatePaymentIntentInput
): Promise<PaymentIntent> {
  // TODO: Implement Wompi or MercadoPago checkout creation.
  return {
    provider: "mock",
    reference: input.reference
  };
}
