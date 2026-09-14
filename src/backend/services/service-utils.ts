import type {
  CourtStatus,
  MatchStatus,
  PaymentPurpose,
  PaymentStatus,
  ReservationStatus,
  TeamSubscriptionStatus,
  TournamentStatus
} from "@prisma/client";

export function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }

  return 0;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Bogota"
  }).format(date);
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Bogota"
  }).format(date);
}

export function parseLocalDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00-05:00`);
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function normalizeOptional(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : undefined;
}

export function getNumber(value: FormDataEntryValue | null, fallback = 0) {
  const number = Number(value ?? fallback);
  return Number.isFinite(number) ? number : fallback;
}

export function getBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export function courtStatusLabel(status: CourtStatus) {
  const labels = {
    ACTIVE: "activa",
    MAINTENANCE: "mantenimiento",
    INACTIVE: "inactiva"
  } as const;

  return labels[status];
}

export function reservationStatusLabel(status: ReservationStatus) {
  const labels = {
    PENDING: "pendiente",
    CONFIRMED: "confirmada",
    CANCELLED: "cancelada",
    COMPLETED: "completada"
  } as const;

  return labels[status];
}

export function paymentStatusLabel(status: PaymentStatus) {
  const labels = {
    PENDING: "pendiente",
    PAID: "pagado",
    FAILED: "fallido",
    REFUNDED: "reembolsado"
  } as const;

  return labels[status];
}

export function paymentPurposeLabel(purpose: PaymentPurpose) {
  const labels = {
    RESERVATION: "reserva",
    SUBSCRIPTION: "suscripcion",
    TOURNAMENT: "torneo"
  } as const;

  return labels[purpose];
}

export function tournamentStatusLabel(status: TournamentStatus) {
  const labels = {
    DRAFT: "borrador",
    OPEN: "inscripciones abiertas",
    IN_PROGRESS: "en curso",
    FINISHED: "finalizado",
    CANCELLED: "cancelado"
  } as const;

  return labels[status];
}

export function matchStatusLabel(status: MatchStatus) {
  const labels = {
    SCHEDULED: "programado",
    PLAYED: "jugado",
    CANCELLED: "cancelado"
  } as const;

  return labels[status];
}

export function teamSubscriptionStatusLabel(status: TeamSubscriptionStatus) {
  const labels = {
    ACTIVE: "activa",
    PAST_DUE: "en mora",
    CANCELLED: "cancelada",
    EXPIRED: "expirada"
  } as const;

  return labels[status];
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "No se pudo completar la accion.";
}
