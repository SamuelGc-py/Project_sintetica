export type ReservationStatus =
  | "pendiente"
  | "confirmada"
  | "cancelada"
  | "completada";

export type CourtSummary = {
  id: string;
  name: string;
  type: string;
  location: string;
  hourlyRate: number;
  status: "activa" | "mantenimiento" | "inactiva";
};

export type ReservationSummary = {
  id: string;
  courtId: string;
  userId: string;
  courtName: string;
  customerName?: string;
  date: string;
  startTime: string;
  startsAt: string;
  durationMinutes: number;
  totalAmount: number;
  depositAmount: number;
  status: ReservationStatus;
  paymentStatus?: string;
  notes?: string;
};

export type ScheduleConfigSummary = {
  id: string;
  courtId?: string;
  courtName?: string;
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
  slotMinutes: number;
  isActive: boolean;
};

export type BlockedSlotSummary = {
  id: string;
  courtId: string;
  courtName: string;
  startsAt: string;
  endsAt: string;
  reason?: string;
};
