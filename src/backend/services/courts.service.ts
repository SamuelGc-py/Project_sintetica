import { CourtStatus } from "@prisma/client";
import { prisma } from "@/backend/db/prisma";
import type { CourtSummary } from "@/shared/types/reservation";
import { mockCourts } from "@/backend/services/mock-data";
import {
  courtStatusLabel,
  getBoolean,
  getNumber,
  normalizeOptional,
  toNumber
} from "@/backend/services/service-utils";

function mapCourt(court: {
  id: string;
  name: string;
  type: string;
  location: string | null;
  hourlyRate: unknown;
  status: CourtStatus;
}): CourtSummary {
  return {
    id: court.id,
    name: court.name,
    type: court.type,
    location: court.location ?? "Sin sede",
    hourlyRate: toNumber(court.hourlyRate),
    status: courtStatusLabel(court.status)
  };
}

export async function getCourts({ activeOnly = false } = {}) {
  try {
    const courts = await prisma.court.findMany({
      where: activeOnly ? { status: CourtStatus.ACTIVE } : undefined,
      orderBy: { createdAt: "asc" }
    });

    return courts.map(mapCourt);
  } catch {
    return activeOnly
      ? mockCourts.filter((court) => court.status === "activa")
      : mockCourts;
  }
}

export async function getCourtById(courtId: string) {
  const court = await prisma.court.findUnique({
    where: { id: courtId }
  });

  return court ? mapCourt(court) : null;
}

export async function createCourtFromForm(formData: FormData) {
  const name = normalizeOptional(formData.get("name"));
  const type = normalizeOptional(formData.get("type")) ?? "Futbol 5";
  const location = normalizeOptional(formData.get("location"));
  const hourlyRate = getNumber(formData.get("hourlyRate"), 0);
  const isIndoor = getBoolean(formData.get("isIndoor"));

  if (!name) {
    throw new Error("El nombre de la cancha es obligatorio.");
  }

  if (hourlyRate <= 0) {
    throw new Error("El precio por hora debe ser mayor a cero.");
  }

  const court = await prisma.court.create({
    data: {
      name,
      type,
      location,
      hourlyRate,
      isIndoor,
      status: CourtStatus.ACTIVE,
      schedules: {
        create: [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
          dayOfWeek,
          opensAt: dayOfWeek === 0 ? "07:00" : "06:00",
          closesAt: dayOfWeek === 0 ? "22:00" : "23:00",
          slotMinutes: 60,
          isActive: true
        }))
      }
    }
  });

  return mapCourt(court);
}

export async function updateCourtFromForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = normalizeOptional(formData.get("name"));
  const type = normalizeOptional(formData.get("type")) ?? "Futbol 5";
  const location = normalizeOptional(formData.get("location"));
  const hourlyRate = getNumber(formData.get("hourlyRate"), 0);
  const status = String(formData.get("status") ?? "ACTIVE") as CourtStatus;

  if (!id || !name || hourlyRate <= 0) {
    throw new Error("Completa nombre y precio para actualizar la cancha.");
  }

  const court = await prisma.court.update({
    where: { id },
    data: {
      name,
      type,
      location,
      hourlyRate,
      status
    }
  });

  return mapCourt(court);
}

export async function deleteCourt(courtId: string) {
  if (!courtId) {
    throw new Error("Selecciona una cancha valida.");
  }

  const relatedRecords = await Promise.all([
    prisma.reservation.count({ where: { courtId } }),
    prisma.match.count({ where: { courtId } }),
    prisma.teamSubscription.count({ where: { fixedCourtId: courtId } })
  ]);

  if (relatedRecords.some((count) => count > 0)) {
    await prisma.court.update({
      where: { id: courtId },
      data: { status: CourtStatus.INACTIVE }
    });
    return;
  }

  await prisma.blockedSlot.deleteMany({ where: { courtId } });
  await prisma.scheduleConfig.deleteMany({ where: { courtId } });
  await prisma.courtPriceRule.deleteMany({ where: { courtId } });
  await prisma.court.delete({ where: { id: courtId } });
}
