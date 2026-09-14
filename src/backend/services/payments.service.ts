import {
  MatchStatus,
  PaymentPurpose,
  PaymentStatus,
  ReservationStatus,
  TeamSubscriptionStatus
} from "@prisma/client";
import { prisma } from "@/backend/db/prisma";
import { formatCurrency } from "@/frontend/utils/format";
import type { PaymentSummary } from "@/shared/types/payment";
import { mockPayments } from "@/backend/services/mock-data";
import {
  formatDate,
  paymentPurposeLabel,
  paymentStatusLabel,
  toNumber
} from "@/backend/services/service-utils";
import {
  sendPaymentConfirmation,
  sendReservationConfirmation
} from "@/backend/services/whatsapp.service";

const DEFAULT_CLIENT_ID = "client-1";

function mapPayment(payment: {
  id: string;
  reservationId: string | null;
  amount: unknown;
  currency: string;
  purpose: PaymentPurpose;
  status: PaymentStatus;
  provider: string | null;
  paidAt: Date | null;
  user: { name: string; phone: string | null } | null;
  reservation: { court: { name: string }; startsAt: Date } | null;
  teamSubscription: { team: { name: string }; plan: { name: string } } | null;
}): PaymentSummary {
  const description =
    payment.reservation
      ? `Anticipo reserva ${payment.reservation.court.name}`
      : payment.teamSubscription
        ? `Suscripcion ${payment.teamSubscription.plan.name} - ${payment.teamSubscription.team.name}`
        : "Pago registrado";

  return {
    id: payment.id,
    reservationId: payment.reservationId ?? undefined,
    description,
    amount: toNumber(payment.amount),
    currency: "COP",
    purpose: paymentPurposeLabel(payment.purpose),
    status: paymentStatusLabel(payment.status),
    provider: payment.provider === "wompi" || payment.provider === "mercadopago"
      ? payment.provider
      : "mock",
    customerName: payment.user?.name,
    paidAt: payment.paidAt ? formatDate(payment.paidAt) : undefined
  };
}

const paymentInclude = {
  user: true,
  reservation: { include: { court: true } },
  teamSubscription: { include: { team: true, plan: true } }
} as const;

export async function getClientPayments(userId = DEFAULT_CLIENT_ID) {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: paymentInclude,
      orderBy: { createdAt: "desc" }
    });

    return payments.map(mapPayment);
  } catch {
    return mockPayments.filter((payment) => payment.customerName === "Carlos Perez");
  }
}

export async function getAdminPayments() {
  try {
    const payments = await prisma.payment.findMany({
      include: paymentInclude,
      orderBy: { createdAt: "desc" }
    });

    return payments.map(mapPayment);
  } catch {
    return mockPayments;
  }
}

export async function simulateSuccessfulPayment(paymentId: string) {
  if (!paymentId) {
    throw new Error("Selecciona un pago valido.");
  }

  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.PAID,
      paidAt: new Date()
    },
    include: paymentInclude
  });

  if (payment.purpose === PaymentPurpose.RESERVATION && payment.reservationId) {
    await prisma.reservation.update({
      where: { id: payment.reservationId },
      data: { status: ReservationStatus.CONFIRMED }
    });

    if (payment.user?.phone && payment.reservation) {
      await sendPaymentConfirmation({
        to: payment.user.phone,
        variables: {
          name: payment.user.name,
          amount: formatCurrency(toNumber(payment.amount))
        }
      });

      await sendReservationConfirmation({
        to: payment.user.phone,
        variables: {
          name: payment.user.name,
          court: payment.reservation.court.name,
          date: formatDate(payment.reservation.startsAt)
        }
      });
    }
  }

  return mapPayment(payment);
}

export async function updatePaymentStatus(paymentId: string, status: PaymentStatus) {
  if (!paymentId) {
    throw new Error("Selecciona un pago valido.");
  }

  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      status,
      paidAt: status === PaymentStatus.PAID ? new Date() : null
    }
  });
}

function localDayBounds() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function localMonthBounds() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

async function paidRevenueBetween(start: Date, end: Date) {
  const result = await prisma.payment.aggregate({
    where: {
      status: PaymentStatus.PAID,
      paidAt: { gte: start, lte: end }
    },
    _sum: { amount: true }
  });

  return toNumber(result._sum.amount);
}

export async function getFinancialDashboard() {
  try {
    const { start: dayStart, end: dayEnd } = localDayBounds();
    const { start: monthStart, end: monthEnd } = localMonthBounds();

    const [
      dailyRevenue,
      monthlyRevenue,
      pendingPaymentAmount,
      reservationsToday,
      activeCourts,
      upcomingMatches,
      activeSubscriptions
    ] = await Promise.all([
      paidRevenueBetween(dayStart, dayEnd),
      paidRevenueBetween(monthStart, monthEnd),
      prisma.payment.aggregate({
        where: { status: PaymentStatus.PENDING },
        _sum: { amount: true }
      }),
      prisma.reservation.count({
        where: { startsAt: { gte: dayStart, lte: dayEnd } }
      }),
      prisma.court.count({ where: { status: "ACTIVE" } }),
      prisma.match.count({
        where: {
          status: MatchStatus.SCHEDULED,
          scheduledAt: { gte: new Date() }
        }
      }),
      prisma.teamSubscription.count({
        where: { status: TeamSubscriptionStatus.ACTIVE }
      })
    ]);

    return {
      reservationsToday,
      dailyRevenue: formatCurrency(dailyRevenue),
      monthlyRevenue: formatCurrency(monthlyRevenue),
      pendingPayments: formatCurrency(toNumber(pendingPaymentAmount._sum.amount)),
      reservationsByCourt: await getReservationsByCourtLabel(),
      topTimeSlots: await getTopTimeSlotsLabel(),
      frequentCustomers: await getFrequentCustomersLabel(),
      activeCourts,
      upcomingMatches,
      activeSubscriptions
    };
  } catch {
    return {
      reservationsToday: 2,
      dailyRevenue: formatCurrency(620000),
      monthlyRevenue: formatCurrency(18400000),
      pendingPayments: formatCurrency(1220000),
      reservationsByCourt: "Norte 42, Sur 37",
      topTimeSlots: "7:00 p.m. y 8:00 p.m.",
      frequentCustomers: "18 clientes",
      activeCourts: 3,
      upcomingMatches: 4,
      activeSubscriptions: 2
    };
  }
}

async function getReservationsByCourtLabel() {
  const reservations = await prisma.reservation.groupBy({
    by: ["courtId"],
    _count: { courtId: true },
    orderBy: { _count: { courtId: "desc" } },
    take: 3
  });

  const courts = await prisma.court.findMany({
    where: { id: { in: reservations.map((item) => item.courtId) } }
  });

  return reservations
    .map((item) => {
      const court = courts.find((current) => current.id === item.courtId);
      return `${court?.name ?? "Cancha"} ${item._count.courtId}`;
    })
    .join(", ") || "Sin reservas";
}

async function getTopTimeSlotsLabel() {
  const reservations = await prisma.reservation.findMany({
    select: { startsAt: true }
  });

  const counts = new Map<string, number>();

  reservations.forEach((reservation) => {
    const hour = reservation.startsAt.getHours().toString().padStart(2, "0");
    const label = `${hour}:00`;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([label]) => label)
    .join(" y ") || "Sin datos";
}

async function getFrequentCustomersLabel() {
  const count = await prisma.user.count({
    where: {
      reservations: {
        some: {}
      }
    }
  });

  return `${count} clientes`;
}

export async function createPaymentPlaceholder() {
  return {
    provider: "mock",
    status: "pending"
  };
}
