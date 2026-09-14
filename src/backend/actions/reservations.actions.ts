"use server";

import { ReservationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createReservationFromForm,
  updateReservationStatus
} from "@/backend/services/reservations.service";
import { getErrorMessage } from "@/backend/services/service-utils";
import { getRedirectPath, withMessage } from "@/backend/actions/shared";

export async function createReservationAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/dashboard/reservations");
  let target = withMessage(redirectTo, "success", "Reserva creada. Se genero un pago pendiente.");

  try {
    await createReservationFromForm(formData);
    revalidatePath("/dashboard/reservations");
    revalidatePath("/admin/reservations");
    revalidatePath("/dashboard/payments");
    revalidatePath("/admin/payments");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function updateReservationStatusAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/reservations");
  const reservationId = String(formData.get("reservationId") ?? "");
  const status = String(formData.get("status") ?? "PENDING") as ReservationStatus;
  let target = withMessage(redirectTo, "success", "Estado de reserva actualizado.");

  try {
    await updateReservationStatus(reservationId, status);
    revalidatePath("/admin/reservations");
    revalidatePath("/dashboard/reservations");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}
