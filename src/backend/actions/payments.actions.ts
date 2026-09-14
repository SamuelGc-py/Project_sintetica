"use server";

import { PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  simulateSuccessfulPayment,
  updatePaymentStatus
} from "@/backend/services/payments.service";
import { getErrorMessage } from "@/backend/services/service-utils";
import { getRedirectPath, withMessage } from "@/backend/actions/shared";

export async function simulatePaymentAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/dashboard/payments");
  const paymentId = String(formData.get("paymentId") ?? "");
  let target = withMessage(redirectTo, "success", "Pago simulado como exitoso.");

  try {
    await simulateSuccessfulPayment(paymentId);
    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/reservations");
    revalidatePath("/admin/payments");
    revalidatePath("/admin/reservations");
    revalidatePath("/admin");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function updatePaymentStatusAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/payments");
  const paymentId = String(formData.get("paymentId") ?? "");
  const status = String(formData.get("status") ?? "PENDING") as PaymentStatus;
  let target = withMessage(redirectTo, "success", "Estado de pago actualizado.");

  try {
    await updatePaymentStatus(paymentId, status);
    revalidatePath("/admin/payments");
    revalidatePath("/dashboard/payments");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}
