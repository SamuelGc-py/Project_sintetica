import {
  sendWhatsAppMessage,
  type SendWhatsAppMessageInput
} from "@/backend/integrations/whatsapp/whatsapp-client";

export async function sendReservationConfirmation(
  input: Omit<SendWhatsAppMessageInput, "template">
) {
  return sendWhatsAppMessage({
    ...input,
    template: "reservation-confirmation"
  });
}

export async function sendMatchReminder(
  input: Omit<SendWhatsAppMessageInput, "template">
) {
  return sendWhatsAppMessage({
    ...input,
    template: "match-reminder"
  });
}

export async function sendPaymentConfirmation(
  input: Omit<SendWhatsAppMessageInput, "template">
) {
  return sendWhatsAppMessage({
    ...input,
    template: "payment-confirmation"
  });
}

export async function sendScheduleChange(
  input: Omit<SendWhatsAppMessageInput, "template">
) {
  return sendWhatsAppMessage({
    ...input,
    template: "schedule-change"
  });
}
