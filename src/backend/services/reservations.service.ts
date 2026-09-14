import {
  CourtStatus,
  PaymentPurpose,
  PaymentStatus,
  ReservationStatus
} from "@prisma/client";
import { prisma } from "@/backend/db/prisma";
import type { ReservationSummary } from "@/shared/types/reservation";
import { getCourts } from "@/backend/services/courts.service";
import { mockReservations } from "@/backend/services/mock-data";
import {
  addMinutes,
  formatDate,
  formatTime,
  getNumber,
  normalizeOptional,
  parseLocalDateTime,
  paymentStatusLabel,
  reservationStatusLabel,
  toNumber
} from "@/backend/services/service-utils";

export const DEFAULT_SLOT_MINUTES = 60;
export const DEFAULT_CLIENT_ID = "client-1";

function mapReservation(reservation: {
  id: string;
  userId: string;
  courtId: string;
  startsAt: Date;
  durationMinutes: number;
  totalAmount: unknown;
  depositAmount: unknown;
  status: ReservationStatus;
  notes: string | null;
  court: { name: string };
  user: { name: string };
  payments: Array<{ status: PaymentStatus }>;
}): ReservationSummary {
  return {
    id: reservation.id,
    courtId: reservation.courtId,
    userId: reservation.userId,
    courtName: reservation.court.name,
    customerName: reservation.user.name,
    date: formatDate(reservation.startsAt),
    startTime: formatTime(reservation.startsAt),
    startsAt: reservation.startsAt.toISOString(),
    durationMinutes: reservation.durationMinutes,
    totalAmount: toNumber(reservation.totalAmount),
    depositAmount: toNumber(reservation.depositAmount),
    status: reservationStatusLabel(reservation.status),
    paymentStatus: reservation.payments[0]
      ? paymentStatusLabel(reservation.payments[0].status)
      : undefined,
    notes: reservation.notes ?? undefined
  };
}

function startOfLocalDay(date: string) {
  return new Date(`${date}T00:00:00-05:00`);
}

function endOfLocalDay(date: string) {
  return new Date(`${date}T23:59:59-05:00`);
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

function overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && endA > startB;
}

export async function getAvailableCourts() {
  return getCourts({ activeOnly: true });
}

export async function getClientReservations(userId = DEFAULT_CLIENT_ID) {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        court: true,
        user: true,
        payments: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      orderBy: { startsAt: "asc" }
    });

    return reservations.map(mapReservation);
  } catch {
    return mockReservations.filter((reservation) => reservation.userId === userId);
  }
}

export async function getAdminReservations() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        court: true,
        user: true,
        payments: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      orderBy: { startsAt: "asc" }
    });

    return reservations.map(mapReservation);
  } catch {
    return mockReservations;
  }
}

export async function getAvailableSlots(courtId: string, date: string) {
  if (!courtId || !date) {
    return ["18:00", "19:00", "20:00", "21:00"];
  }

  try {
    const referenceDate = new Date(`${date}T12:00:00-05:00`);
    const dayOfWeek = referenceDate.getDay();

    const schedules = await prisma.scheduleConfig.findMany({
      where: {
        OR: [{ courtId }, { courtId: null }],
        dayOfWeek,
        isActive: true
      },
      orderBy: { courtId: "desc" }
    });

    const schedule = schedules[0] ?? {
      opensAt: "06:00",
      closesAt: "23:00",
      slotMinutes: DEFAULT_SLOT_MINUTES
    };

    const dayStart = startOfLocalDay(date);
    const dayEnd = endOfLocalDay(date);

    const [reservations, blockedSlots] = await Promise.all([
      prisma.reservation.findMany({
        where: {
          courtId,
          status: { not: ReservationStatus.CANCELLED },
          startsAt: { gte: dayStart, lte: dayEnd }
        }
      }),
      prisma.blockedSlot.findMany({
        where: {
          courtId,
          startsAt: { lt: dayEnd },
          endsAt: { gt: dayStart }
        }
      })
    ]);

    const slots: string[] = [];
    const opens = timeToMinutes(schedule.opensAt);
    const closes = timeToMinutes(schedule.closesAt);

    for (
      let current = opens;
      current + schedule.slotMinutes <= closes;
      current += schedule.slotMinutes
    ) {
      const time = minutesToTime(current);
      const startsAt = parseLocalDateTime(date, time);
      const endsAt = addMinutes(startsAt, schedule.slotMinutes);

      const isReserved = reservations.some((reservation) =>
        overlaps(
          startsAt,
          endsAt,
          reservation.startsAt,
          addMinutes(reservation.startsAt, reservation.durationMinutes)
        )
      );

      const isBlocked = blockedSlots.some((slot) =>
        overlaps(startsAt, endsAt, slot.startsAt, slot.endsAt)
      );

      if (!isReserved && !isBlocked) {
        slots.push(time);
      }
    }

    return slots;
  } catch {
    return ["18:00", "19:00", "20:00", "21:00"];
  }
}

export async function calculateReservationPrice(
  courtId: string,
  date: string,
  time: string,
  durationMinutes = DEFAULT_SLOT_MINUTES
) {
  const startsAt = parseLocalDateTime(date, time);
  const dayOfWeek = startsAt.getDay();

  const court = await prisma.court.findUnique({
    where: { id: courtId },
    include: {
      priceRules: {
        where: {
          isActive: true,
          OR: [{ dayOfWeek }, { dayOfWeek: null }]
        }
      }
    }
  });

  if (!court || court.status !== CourtStatus.ACTIVE) {
    throw new Error("La cancha seleccionada no esta disponible.");
  }

  const timeMinutes = timeToMinutes(time);
  const matchingRule = court.priceRules.find((rule) => {
    const starts = rule.startsAt ? timeToMinutes(rule.startsAt) : 0;
    const ends = rule.endsAt ? timeToMinutes(rule.endsAt) : 24 * 60;
    return starts <= timeMinutes && timeMinutes < ends;
  });

  const hourlyRate = matchingRule
    ? toNumber(matchingRule.hourlyRate)
    : toNumber(court.hourlyRate);
  const totalAmount = Math.round(hourlyRate * (durationMinutes / 60));
  const depositAmount = Math.ceil(totalAmount * 0.3 / 1000) * 1000;

  return {
    hourlyRate,
    totalAmount,
    depositAmount
  };
}

export async function isReservationSlotAvailable({
  courtId,
  startsAt,
  durationMinutes
}: {
  courtId: string;
  startsAt: Date;
  durationMinutes: number;
}) {
  const endsAt = addMinutes(startsAt, durationMinutes);
  const dayStart = new Date(startsAt);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(startsAt);
  dayEnd.setHours(23, 59, 59, 999);

  const [reservations, blockedSlots] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        courtId,
        status: { not: ReservationStatus.CANCELLED },
        startsAt: { gte: dayStart, lte: dayEnd }
      }
    }),
    prisma.blockedSlot.findMany({
      where: {
        courtId,
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt }
      }
    })
  ]);

  const isReserved = reservations.some((reservation) =>
    overlaps(
      startsAt,
      endsAt,
      reservation.startsAt,
      addMinutes(reservation.startsAt, reservation.durationMinutes)
    )
  );

  const isBlocked = blockedSlots.some((slot) =>
    overlaps(startsAt, endsAt, slot.startsAt, slot.endsAt)
  );

  return !isReserved && !isBlocked;
}

export async function createReservationFromForm(formData: FormData) {
  const userId = normalizeOptional(formData.get("userId")) ?? DEFAULT_CLIENT_ID;
  const courtId = String(formData.get("courtId") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const durationMinutes = getNumber(formData.get("durationMinutes"), DEFAULT_SLOT_MINUTES);
  const notes = normalizeOptional(formData.get("notes"));

  if (!courtId || !date || !time) {
    throw new Error("Selecciona cancha, fecha y hora.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("No existe el cliente demo. Ejecuta el seed de Prisma.");
  }

  const startsAt = parseLocalDateTime(date, time);
  const available = await isReservationSlotAvailable({
    courtId,
    startsAt,
    durationMinutes
  });

  if (!available) {
    throw new Error("Ese horario ya esta ocupado o bloqueado.");
  }

  const price = await calculateReservationPrice(
    courtId,
    date,
    time,
    durationMinutes
  );

  return prisma.$transaction(async (transaction) => {
    const reservation = await transaction.reservation.create({
      data: {
        userId,
        courtId,
        startsAt,
        durationMinutes,
        totalAmount: price.totalAmount,
        depositAmount: price.depositAmount,
        status: ReservationStatus.PENDING,
        notes
      }
    });

    await transaction.payment.create({
      data: {
        userId,
        reservationId: reservation.id,
        amount: price.depositAmount,
        currency: "COP",
        purpose: PaymentPurpose.RESERVATION,
        status: PaymentStatus.PENDING,
        provider: "mock",
        providerReference: `mock-reservation-${reservation.id}`
      }
    });

    return reservation;
  });
}

export async function updateReservationStatus(
  reservationId: string,
  status: ReservationStatus
) {
  if (!reservationId) {
    throw new Error("Selecciona una reserva valida.");
  }

  return prisma.reservation.update({
    where: { id: reservationId },
    data: { status }
  });
}

export async function createReservationPlaceholder() {
  return {
    status: "pending"
  };
}
