"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addPlayerFromForm,
  createTeamFromForm,
  updateTeamFromForm
} from "@/backend/services/teams.service";
import { getErrorMessage } from "@/backend/services/service-utils";
import { getRedirectPath, withMessage } from "@/backend/actions/shared";

export async function createTeamAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/dashboard/teams");
  let target = withMessage(redirectTo, "success", "Equipo creado.");

  try {
    await createTeamFromForm(formData);
    revalidatePath("/dashboard/teams");
    revalidatePath("/admin/teams");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function updateTeamAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/dashboard/teams");
  let target = withMessage(redirectTo, "success", "Equipo actualizado.");

  try {
    await updateTeamFromForm(formData);
    revalidatePath("/dashboard/teams");
    revalidatePath("/admin/teams");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function addPlayerAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/dashboard/teams");
  let target = withMessage(redirectTo, "success", "Jugador agregado.");

  try {
    await addPlayerFromForm(formData);
    revalidatePath("/dashboard/teams");
    revalidatePath("/admin/teams");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}
