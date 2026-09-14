"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createBlockedSlotFromForm,
  createPriceRuleFromForm,
  createScheduleConfigFromForm,
  deleteBlockedSlot
} from "@/backend/services/schedules.service";
import { getErrorMessage } from "@/backend/services/service-utils";
import { getRedirectPath, withMessage } from "@/backend/actions/shared";

export async function createScheduleConfigAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/schedules");
  let target = withMessage(redirectTo, "success", "Horario creado.");

  try {
    await createScheduleConfigFromForm(formData);
    revalidatePath("/admin/schedules");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function createBlockedSlotAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/schedules");
  let target = withMessage(redirectTo, "success", "Horario bloqueado.");

  try {
    await createBlockedSlotFromForm(formData);
    revalidatePath("/admin/schedules");
    revalidatePath("/dashboard/reservations");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function deleteBlockedSlotAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/schedules");
  const slotId = String(formData.get("slotId") ?? "");
  let target = withMessage(redirectTo, "success", "Bloqueo eliminado.");

  try {
    await deleteBlockedSlot(slotId);
    revalidatePath("/admin/schedules");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function createPriceRuleAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/prices");
  let target = withMessage(redirectTo, "success", "Regla de precio creada.");

  try {
    await createPriceRuleFromForm(formData);
    revalidatePath("/admin/prices");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}
