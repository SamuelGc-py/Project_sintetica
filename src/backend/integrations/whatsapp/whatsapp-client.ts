export type WhatsAppTemplate =
  | "reservation-confirmation"
  | "match-reminder"
  | "payment-confirmation"
  | "schedule-change";

export type SendWhatsAppMessageInput = {
  to: string;
  template: WhatsAppTemplate;
  variables: Record<string, string>;
};

export async function sendWhatsAppMessage(
  input: SendWhatsAppMessageInput
): Promise<{ queued: boolean; template: WhatsAppTemplate }> {
  // TODO: Connect to WhatsApp Cloud API or a provider like Twilio.
  console.log("[whatsapp:mock]", {
    to: input.to,
    template: input.template,
    variables: input.variables
  });

  return {
    queued: true,
    template: input.template
  };
}
