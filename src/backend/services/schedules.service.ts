import { prisma } from "@/backend/db/prisma";
import type {
  BlockedSlotSummary,
  ScheduleConfigSummary
} from "@/shared/types/reservation";
import { mockBlockedSlots, mockSchedules } from "@/backend/services/mock-data";
import {
  getNumber,
  normalizeOptional,
  parseLocalDateTime,
  toNumber
} from "@/backend/services/service-utils";

function mapSchedule(schedule: {
  id: string;
  courtId: string | null;
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
  slotMinutes: number;
  isActive: boolean;
  court: { name: string } | null;
}): ScheduleConfigSummary {
  return {
    id: schedule.id,
    courtId: schedule.courtId ?? undefined,
    courtName: schedule.court?.name,
    dayOfWeek: schedule.dayOfWeek,
    opensAt: schedule.opensAt,
    closesAt: schedule.closesAt,
    slotMinutes: schedule.slotMinutes,
    isActive: schedule.isActive
  };
}

function mapBlockedSlot(slot: {
  id: string;
  courtId: string;
  startsAt: Date;
  endsAt: Date;
  reason: string | null;
  court: { name: string };
}): BlockedSlotSummary {
  return {
    id: slot.id,
    courtId: slot.courtId,
    courtName: slot.court.name,
    startsAt: slot.startsAt.toISOString(),
    endsAt: slot.endsAt.toISOString(),
    reason: slot.reason ?? undefined
  };
}

export async function getScheduleConfigs() {
  try {
    const schedules = await prisma.scheduleConfig.findMany({
      include: { court: true },
      orderBy: [{ dayOfWeek: "asc" }, { opensAt: "asc" }]
    });

    return schedules.map(mapSchedule);
  } catch {
    return mockSchedules;
  }
}

export async function getBlockedSlots() {
  try {
    const slots = await prisma.blockedSlot.findMany({
      include: { court: true },
      orderBy: { startsAt: "asc" }
    });

    return slots.map(mapBlockedSlot);
  } catch {
    return mockBlockedSlots;
  }
}

export async function createScheduleConfigFromForm(formData: FormData) {
  const courtId = normalizeOptional(formData.get("courtId"));
  const dayOfWeek = getNumber(formData.get("dayOfWeek"), 1);
  const opensAt = String(formData.get("opensAt") ?? "06:00");
  const closesAt = String(formData.get("closesAt") ?? "23:00");
  const slotMinutes = getNumber(formData.get("slotMinutes"), 60);

  return prisma.scheduleConfig.create({
    data: {
      courtId,
      dayOfWeek,
      opensAt,
      closesAt,
      slotMinutes,
      isActive: true
    }
  });
}

export async function createBlockedSlotFromForm(formData: FormData) {
  const courtId = String(formData.get("courtId") ?? "");
  const date = String(formData.get("date") ?? "");
  const startsAtTime = String(formData.get("startsAt") ?? "");
  const endsAtTime = String(formData.get("endsAt") ?? "");
  const reason = normalizeOptional(formData.get("reason"));

  if (!courtId || !date || !startsAtTime || !endsAtTime) {
    throw new Error("Completa cancha, fecha y horas del bloqueo.");
  }

  return prisma.blockedSlot.create({
    data: {
      courtId,
      startsAt: parseLocalDateTime(date, startsAtTime),
      endsAt: parseLocalDateTime(date, endsAtTime),
      reason
    }
  });
}

export async function deleteBlockedSlot(slotId: string) {
  if (!slotId) {
    throw new Error("Selecciona un bloqueo valido.");
  }

  await prisma.blockedSlot.delete({ where: { id: slotId } });
}

export async function createPriceRuleFromForm(formData: FormData) {
  const courtId = String(formData.get("courtId") ?? "");
  const dayOfWeekRaw = normalizeOptional(formData.get("dayOfWeek"));
  const startsAt = normalizeOptional(formData.get("startsAt"));
  const endsAt = normalizeOptional(formData.get("endsAt"));
  const hourlyRate = getNumber(formData.get("hourlyRate"), 0);

  if (!courtId || hourlyRate <= 0) {
    throw new Error("Selecciona cancha y precio valido.");
  }

  return prisma.courtPriceRule.create({
    data: {
      courtId,
      dayOfWeek: dayOfWeekRaw ? Number(dayOfWeekRaw) : null,
      startsAt,
      endsAt,
      hourlyRate
    }
  });
}

export async function getPriceRules() {
  try {
    const rules = await prisma.courtPriceRule.findMany({
      include: { court: true },
      orderBy: { createdAt: "desc" }
    });

    return rules.map((rule) => ({
      id: rule.id,
      courtName: rule.court.name,
      dayOfWeek: rule.dayOfWeek,
      startsAt: rule.startsAt,
      endsAt: rule.endsAt,
      hourlyRate: toNumber(rule.hourlyRate),
      isActive: rule.isActive
    }));
  } catch {
    return [];
  }
}
