"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCourtFromForm,
  deleteCourt,
  updateCourtFromForm
} from "@/backend/services/courts.service";
import { getErrorMessage } from "@/backend/services/service-utils";
import { getRedirectPath, withMessage } from "@/backend/actions/shared";

export async function createCourtAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/courts");
  let target = withMessage(redirectTo, "success", "Cancha creada.");

  try {
    await createCourtFromForm(formData);
    revalidatePath("/admin/courts");
    revalidatePath("/dashboard/courts");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function updateCourtAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/courts");
  let target = withMessage(redirectTo, "success", "Cancha actualizada.");

  try {
    await updateCourtFromForm(formData);
    revalidatePath("/admin/courts");
    revalidatePath("/dashboard/courts");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function deleteCourtAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/courts");
  const courtId = String(formData.get("courtId") ?? "");
  let target = withMessage(redirectTo, "success", "Cancha eliminada o marcada inactiva.");

  try {
    await deleteCourt(courtId);
    revalidatePath("/admin/courts");
    revalidatePath("/dashboard/courts");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}
