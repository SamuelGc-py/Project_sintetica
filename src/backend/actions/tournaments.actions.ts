"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createMatchFromForm,
  createTournamentFromForm,
  deleteTournament,
  enrollTeamFromForm,
  recordMatchResultFromForm,
  registerCardFromForm,
  registerGoalFromForm,
  updateTournamentFromForm
} from "@/backend/services/tournaments.service";
import { getErrorMessage } from "@/backend/services/service-utils";
import { getRedirectPath, withMessage } from "@/backend/actions/shared";

function revalidateTournamentPaths() {
  revalidatePath("/admin/tournaments");
  revalidatePath("/dashboard/tournaments");
  revalidatePath("/torneos");
}

export async function createTournamentAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/tournaments");
  let target = withMessage(redirectTo, "success", "Torneo creado.");

  try {
    await createTournamentFromForm(formData);
    revalidateTournamentPaths();
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function updateTournamentAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/tournaments");
  let target = withMessage(redirectTo, "success", "Torneo actualizado.");

  try {
    await updateTournamentFromForm(formData);
    revalidateTournamentPaths();
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function deleteTournamentAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/tournaments");
  const tournamentId = String(formData.get("tournamentId") ?? "");
  let target = withMessage(redirectTo, "success", "Torneo eliminado.");

  try {
    await deleteTournament(tournamentId);
    revalidateTournamentPaths();
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function enrollTeamAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/tournaments");
  let target = withMessage(redirectTo, "success", "Equipo inscrito.");

  try {
    await enrollTeamFromForm(formData);
    revalidateTournamentPaths();
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function createMatchAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/tournaments");
  let target = withMessage(redirectTo, "success", "Partido creado.");

  try {
    await createMatchFromForm(formData);
    revalidateTournamentPaths();
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function recordMatchResultAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/tournaments");
  let target = withMessage(redirectTo, "success", "Resultado registrado.");

  try {
    await recordMatchResultFromForm(formData);
    revalidateTournamentPaths();
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function registerGoalAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/tournaments");
  let target = withMessage(redirectTo, "success", "Gol registrado.");

  try {
    await registerGoalFromForm(formData);
    revalidateTournamentPaths();
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}

export async function registerCardAction(formData: FormData) {
  const redirectTo = getRedirectPath(formData, "/admin/tournaments");
  let target = withMessage(redirectTo, "success", "Tarjeta registrada.");

  try {
    await registerCardFromForm(formData);
    revalidateTournamentPaths();
  } catch (error) {
    target = withMessage(redirectTo, "error", getErrorMessage(error));
  }

  redirect(target);
}
