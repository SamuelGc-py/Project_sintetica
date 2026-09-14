"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  cancelTeamSubscription,
  createPlanFromForm,
  createTeamSubscriptionFromForm,
  deletePlan,
  updatePlanFromForm
} from "@/backend/services/subscriptions.service";
import { getErrorMessage } from "@/backend/services/service-utils";
import { getRedirectPath, withMessage } from "@/backend/actions/shared";

export async function createPlanAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/plans");
  let target = withMessage(redirectTo, "success", "Plan guardado.");

  try {
    await createPlanFromForm(formData);
    revalidatePath("/admin/plans");
    revalidatePath("/plans");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function updatePlanAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/plans");
  let target = withMessage(redirectTo, "success", "Plan actualizado.");

  try {
    await updatePlanFromForm(formData);
    revalidatePath("/admin/plans");
    revalidatePath("/plans");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function deletePlanAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/plans");
  const planId = String(formData.get("planId") ?? "");
  let target = withMessage(redirectTo, "success", "Plan eliminado.");

  try {
    await deletePlan(planId);
    revalidatePath("/admin/plans");
    revalidatePath("/plans");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function createTeamSubscriptionAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/subscriptions");
  let target = withMessage(redirectTo, "success", "Suscripcion creada.");

  try {
    await createTeamSubscriptionFromForm(formData);
    revalidatePath("/admin/subscriptions");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reservations");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function cancelTeamSubscriptionAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/subscriptions");
  const subscriptionId = String(formData.get("subscriptionId") ?? "");
  let target = withMessage(redirectTo, "success", "Suscripcion cancelada.");

  try {
    await cancelTeamSubscription(subscriptionId);
    revalidatePath("/admin/subscriptions");
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}
