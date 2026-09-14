import {
  PaymentPurpose,
  PaymentStatus,
  ReservationStatus,
  SubscriptionTier,
  TeamSubscriptionStatus
} from "@prisma/client";
import { prisma } from "@/backend/db/prisma";
import type {
  SubscriptionPlanSummary,
  TeamSubscriptionSummary
} from "@/shared/types/subscription";
import { mockPlans, mockTeamSubscriptions } from "@/backend/services/mock-data";
import {
  getBoolean,
  getNumber,
  normalizeOptional,
  parseLocalDateTime,
  teamSubscriptionStatusLabel,
  toNumber
} from "@/backend/services/service-utils";
import { isReservationSlotAvailable } from "@/backend/services/reservations.service";

function mapPlan(plan: {
  id: string;
  name: string;
  tier: SubscriptionTier;
  monthlyPrice: unknown;
  discountPercentage: unknown;
  hoursIncluded: number;
  weeklyFixedReservation: boolean;
  features: string[];
}): SubscriptionPlanSummary {
  return {
    id: plan.id,
    name: plan.name,
    tier: plan.tier.toLowerCase() as SubscriptionPlanSummary["tier"],
    monthlyPrice: toNumber(plan.monthlyPrice),
    discountPercentage: toNumber(plan.discountPercentage),
    hoursIncluded: plan.hoursIncluded,
    weeklyFixedReservation: plan.weeklyFixedReservation,
    features: plan.features
  };
}

function mapSubscription(subscription: {
  id: string;
  status: TeamSubscriptionStatus;
  monthlyAmount: unknown;
  fixedDayOfWeek: number | null;
  fixedTime: string | null;
  team: { name: string };
  plan: { name: string };
  fixedCourt: { name: string } | null;
}): TeamSubscriptionSummary {
  return {
    id: subscription.id,
    teamName: subscription.team.name,
    planName: subscription.plan.name,
    status: teamSubscriptionStatusLabel(subscription.status),
    monthlyAmount: toNumber(subscription.monthlyAmount),
    fixedCourtName: subscription.fixedCourt?.name,
    fixedDayOfWeek: subscription.fixedDayOfWeek ?? undefined,
    fixedTime: subscription.fixedTime ?? undefined
  };
}

export async function getSubscriptionPlans() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { monthlyPrice: "asc" }
    });

    return plans.map(mapPlan);
  } catch {
    return mockPlans;
  }
}

export async function getTeamSubscriptions() {
  try {
    const subscriptions = await prisma.teamSubscription.findMany({
      include: {
        team: true,
        plan: true,
        fixedCourt: true
      },
      orderBy: { createdAt: "desc" }
    });

    return subscriptions.map(mapSubscription);
  } catch {
    return mockTeamSubscriptions;
  }
}

export async function getClientTeamSubscriptions(userId = "client-1") {
  try {
    const subscriptions = await prisma.teamSubscription.findMany({
      where: {
        team: { captainId: userId }
      },
      include: {
        team: true,
        plan: true,
        fixedCourt: true
      },
      orderBy: { createdAt: "desc" }
    });

    return subscriptions.map(mapSubscription);
  } catch {
    return mockTeamSubscriptions;
  }
}

export async function createPlanFromForm(formData: FormData) {
  const name = normalizeOptional(formData.get("name"));
  const tier = String(formData.get("tier") ?? "BASIC") as SubscriptionTier;
  const monthlyPrice = getNumber(formData.get("monthlyPrice"), 0);
  const discountPercentage = getNumber(formData.get("discountPercentage"), 0);
  const hoursIncluded = getNumber(formData.get("hoursIncluded"), 0);
  const weeklyFixedReservation = getBoolean(formData.get("weeklyFixedReservation"));
  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((feature) => feature.trim())
    .filter(Boolean);

  if (!name || monthlyPrice <= 0) {
    throw new Error("Completa nombre y precio mensual del plan.");
  }

  const plan = await prisma.subscriptionPlan.upsert({
    where: { tier },
    update: {
      name,
      monthlyPrice,
      discountPercentage,
      hoursIncluded,
      weeklyFixedReservation,
      features
    },
    create: {
      name,
      tier,
      monthlyPrice,
      discountPercentage,
      hoursIncluded,
      weeklyFixedReservation,
      features
    }
  });

  return mapPlan(plan);
}

export async function updatePlanFromForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = normalizeOptional(formData.get("name"));
  const monthlyPrice = getNumber(formData.get("monthlyPrice"), 0);
  const discountPercentage = getNumber(formData.get("discountPercentage"), 0);
  const hoursIncluded = getNumber(formData.get("hoursIncluded"), 0);
  const weeklyFixedReservation = getBoolean(formData.get("weeklyFixedReservation"));
  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((feature) => feature.trim())
    .filter(Boolean);

  if (!id || !name || monthlyPrice <= 0) {
    throw new Error("Completa los datos del plan.");
  }

  const plan = await prisma.subscriptionPlan.update({
    where: { id },
    data: {
      name,
      monthlyPrice,
      discountPercentage,
      hoursIncluded,
      weeklyFixedReservation,
      features
    }
  });

  return mapPlan(plan);
}

export async function deletePlan(planId: string) {
  const subscriptions = await prisma.teamSubscription.count({
    where: { planId }
  });

  if (subscriptions > 0) {
    throw new Error("No puedes eliminar un plan con suscripciones asociadas.");
  }

  await prisma.subscriptionPlan.delete({ where: { id: planId } });
}

export async function createTeamSubscriptionFromForm(formData: FormData) {
  const teamId = String(formData.get("teamId") ?? "");
  const planId = String(formData.get("planId") ?? "");
  const fixedCourtId = normalizeOptional(formData.get("fixedCourtId"));
  const fixedDayOfWeek = getNumber(formData.get("fixedDayOfWeek"), -1);
  const fixedTime = normalizeOptional(formData.get("fixedTime"));

  if (!teamId || !planId) {
    throw new Error("Selecciona equipo y plan.");
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId }
  });

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { captain: true }
  });

  if (!plan || !team) {
    throw new Error("El plan o equipo seleccionado no existe.");
  }

  const subscription = await prisma.teamSubscription.create({
    data: {
      teamId,
      planId,
      fixedCourtId,
      fixedDayOfWeek: fixedDayOfWeek >= 0 ? fixedDayOfWeek : null,
      fixedTime,
      monthlyAmount: plan.monthlyPrice,
      status: TeamSubscriptionStatus.ACTIVE
    }
  });

  await prisma.payment.create({
    data: {
      userId: team.captainId,
      teamSubscriptionId: subscription.id,
      amount: plan.monthlyPrice,
      currency: "COP",
      purpose: PaymentPurpose.SUBSCRIPTION,
      status: PaymentStatus.PENDING,
      provider: "mock",
      providerReference: `mock-subscription-${subscription.id}`
    }
  });

  if (fixedCourtId && fixedDayOfWeek >= 0 && fixedTime && team.captainId) {
    await createNextFixedReservation({
      courtId: fixedCourtId,
      userId: team.captainId,
      fixedDayOfWeek,
      fixedTime,
      teamName: team.name
    });
  }

  return subscription;
}

async function createNextFixedReservation({
  courtId,
  userId,
  fixedDayOfWeek,
  fixedTime,
  teamName
}: {
  courtId: string;
  userId: string;
  fixedDayOfWeek: number;
  fixedTime: string;
  teamName: string;
}) {
  const date = new Date();
  const daysUntilSlot = (fixedDayOfWeek - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilSlot);
  const datePart = date.toISOString().slice(0, 10);
  const startsAt = parseLocalDateTime(datePart, fixedTime);

  const available = await isReservationSlotAvailable({
    courtId,
    startsAt,
    durationMinutes: 60
  });

  if (!available) {
    return;
  }

  await prisma.reservation.create({
    data: {
      userId,
      courtId,
      startsAt,
      durationMinutes: 60,
      totalAmount: 0,
      depositAmount: 0,
      status: ReservationStatus.CONFIRMED,
      notes: `Reserva fija semanal del equipo ${teamName}`
    }
  });
}

export async function cancelTeamSubscription(subscriptionId: string) {
  if (!subscriptionId) {
    throw new Error("Selecciona una suscripcion valida.");
  }

  return prisma.teamSubscription.update({
    where: { id: subscriptionId },
    data: { status: TeamSubscriptionStatus.CANCELLED }
  });
}

export async function createTeamSubscriptionPlaceholder() {
  return {
    status: "active"
  };
}
