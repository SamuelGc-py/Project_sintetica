import { prisma } from "@/backend/db/prisma";
import type { TeamSummary } from "@/shared/types/user";
import { mockTeams } from "@/backend/services/mock-data";
import { getNumber, normalizeOptional } from "@/backend/services/service-utils";

function mapTeam(team: {
  id: string;
  name: string;
  contactPhone: string | null;
  city: string | null;
  captain: { name: string } | null;
  players: Array<{
    id: string;
    name: string;
    documentNumber: string | null;
    jerseyNumber: number | null;
    position: string | null;
  }>;
  subscriptions: Array<{ status: string; plan: { name: string } }>;
}): TeamSummary {
  const activeSubscription = team.subscriptions.find(
    (subscription) => subscription.status === "ACTIVE"
  );

  return {
    id: team.id,
    name: team.name,
    captainName: team.captain?.name,
    contactPhone: team.contactPhone ?? undefined,
    city: team.city ?? undefined,
    activePlanName: activeSubscription?.plan.name,
    players: team.players.map((player) => ({
      id: player.id,
      name: player.name,
      documentNumber: player.documentNumber ?? undefined,
      jerseyNumber: player.jerseyNumber ?? undefined,
      position: player.position ?? undefined
    }))
  };
}

const teamInclude = {
  captain: true,
  players: { orderBy: { createdAt: "asc" } },
  subscriptions: {
    include: { plan: true },
    orderBy: { createdAt: "desc" }
  }
} as const;

export async function getClientTeams(userId = "client-1") {
  try {
    const teams = await prisma.team.findMany({
      where: { captainId: userId },
      include: teamInclude,
      orderBy: { createdAt: "desc" }
    });

    return teams.map(mapTeam);
  } catch {
    return mockTeams;
  }
}

export async function getAllTeams() {
  try {
    const teams = await prisma.team.findMany({
      include: teamInclude,
      orderBy: { createdAt: "desc" }
    });

    return teams.map(mapTeam);
  } catch {
    return mockTeams;
  }
}

export async function createTeamFromForm(formData: FormData) {
  const name = normalizeOptional(formData.get("name"));
  const captainId = normalizeOptional(formData.get("captainId")) ?? "client-1";
  const contactPhone = normalizeOptional(formData.get("contactPhone"));
  const city = normalizeOptional(formData.get("city"));

  if (!name) {
    throw new Error("El nombre del equipo es obligatorio.");
  }

  return prisma.team.create({
    data: {
      name,
      captainId,
      contactPhone,
      city
    }
  });
}

export async function updateTeamFromForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = normalizeOptional(formData.get("name"));
  const contactPhone = normalizeOptional(formData.get("contactPhone"));
  const city = normalizeOptional(formData.get("city"));

  if (!id || !name) {
    throw new Error("Selecciona un equipo y escribe su nombre.");
  }

  return prisma.team.update({
    where: { id },
    data: {
      name,
      contactPhone,
      city
    }
  });
}

export async function addPlayerFromForm(formData: FormData) {
  const teamId = String(formData.get("teamId") ?? "");
  const name = normalizeOptional(formData.get("name"));
  const documentNumber = normalizeOptional(formData.get("documentNumber"));
  const jerseyNumber = getNumber(formData.get("jerseyNumber"), 0);
  const position = normalizeOptional(formData.get("position"));

  if (!teamId || !name) {
    throw new Error("Selecciona un equipo y escribe el nombre del jugador.");
  }

  return prisma.player.create({
    data: {
      teamId,
      name,
      documentNumber,
      jerseyNumber: jerseyNumber > 0 ? jerseyNumber : null,
      position
    }
  });
}
