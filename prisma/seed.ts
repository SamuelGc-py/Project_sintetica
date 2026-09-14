import {
  CardType,
  CourtStatus,
  MatchStatus,
  PaymentPurpose,
  PaymentStatus,
  PrismaClient,
  ReservationStatus,
  Role,
  SubscriptionTier,
  TeamSubscriptionStatus,
  TournamentStatus
} from "@prisma/client";

const prisma = new PrismaClient();

function nextDateAt(daysFromNow: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main() {
  await prisma.goal.deleteMany();
  await prisma.card.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.blockedSlot.deleteMany();
  await prisma.scheduleConfig.deleteMany();
  await prisma.courtPriceRule.deleteMany();
  await prisma.match.deleteMany();
  await prisma.tournamentTeam.deleteMany();
  await prisma.teamSubscription.deleteMany();
  await prisma.player.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.team.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.court.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      id: "admin-1",
      name: "Admin Cancha Pro",
      email: "admin@cancha-pro.com",
      phone: "+57 300 100 0000",
      role: Role.ADMIN
    }
  });

  const clientOne = await prisma.user.create({
    data: {
      id: "client-1",
      name: "Carlos Perez",
      email: "carlos@cancha-pro.com",
      phone: "+57 300 200 0000",
      role: Role.CLIENT
    }
  });

  const clientTwo = await prisma.user.create({
    data: {
      id: "client-2",
      name: "Laura Gomez",
      email: "laura@cancha-pro.com",
      phone: "+57 310 300 0000",
      role: Role.CLIENT
    }
  });

  const northCourt = await prisma.court.create({
    data: {
      id: "court-north",
      name: "Cancha Norte",
      type: "Futbol 5",
      location: "Sede principal",
      hourlyRate: "90000",
      capacity: 10,
      status: CourtStatus.ACTIVE
    }
  });

  const southCourt = await prisma.court.create({
    data: {
      id: "court-south",
      name: "Cancha Sur",
      type: "Futbol 7",
      location: "Sede principal",
      hourlyRate: "120000",
      capacity: 14,
      status: CourtStatus.ACTIVE
    }
  });

  const eliteCourt = await prisma.court.create({
    data: {
      id: "court-elite",
      name: "Cancha Elite",
      type: "Futbol 5 cubierta",
      location: "Sede cubierta",
      hourlyRate: "110000",
      capacity: 10,
      isIndoor: true,
      status: CourtStatus.ACTIVE
    }
  });

  for (const court of [northCourt, southCourt, eliteCourt]) {
    await prisma.scheduleConfig.createMany({
      data: [1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => ({
        courtId: court.id,
        dayOfWeek,
        opensAt: dayOfWeek === 0 ? "07:00" : "06:00",
        closesAt: dayOfWeek === 0 ? "22:00" : "23:00",
        slotMinutes: 60,
        isActive: true
      }))
    });
  }

  await prisma.courtPriceRule.createMany({
    data: [
      {
        courtId: northCourt.id,
        dayOfWeek: null,
        startsAt: "18:00",
        endsAt: "22:00",
        hourlyRate: "95000"
      },
      {
        courtId: southCourt.id,
        dayOfWeek: 6,
        startsAt: "17:00",
        endsAt: "22:00",
        hourlyRate: "130000"
      }
    ]
  });

  const basicPlan = await prisma.subscriptionPlan.create({
    data: {
      id: "plan-basic",
      name: "Plan Basico",
      tier: SubscriptionTier.BASIC,
      monthlyPrice: "180000",
      discountPercentage: "5",
      hoursIncluded: 4,
      weeklyFixedReservation: false,
      features: ["Reservas recurrentes", "Historial de pagos", "Soporte basico"]
    }
  });

  const premiumPlan = await prisma.subscriptionPlan.create({
    data: {
      id: "plan-premium",
      name: "Plan Premium",
      tier: SubscriptionTier.PREMIUM,
      monthlyPrice: "280000",
      discountPercentage: "10",
      hoursIncluded: 6,
      weeklyFixedReservation: true,
      features: ["Reserva fija semanal", "Descuentos", "Recordatorios por WhatsApp"]
    }
  });

  await prisma.subscriptionPlan.create({
    data: {
      id: "plan-elite",
      name: "Plan Elite",
      tier: SubscriptionTier.ELITE,
      monthlyPrice: "420000",
      discountPercentage: "15",
      hoursIncluded: 10,
      weeklyFixedReservation: true,
      features: ["Prioridad horaria", "Reportes del equipo", "Beneficios en torneos"]
    }
  });

  const barrioFc = await prisma.team.create({
    data: {
      id: "team-barrio-fc",
      name: "Barrio FC",
      captainId: clientOne.id,
      contactPhone: clientOne.phone,
      city: "Bogota",
      players: {
        create: [
          {
            id: "player-barrio-1",
            name: "Juan Rodriguez",
            documentNumber: "1001001001",
            jerseyNumber: 10,
            position: "Delantero"
          },
          {
            id: "player-barrio-2",
            name: "Mateo Diaz",
            documentNumber: "1001001002",
            jerseyNumber: 1,
            position: "Arquero"
          }
        ]
      }
    }
  });

  const laDiez = await prisma.team.create({
    data: {
      id: "team-la-diez",
      name: "La 10",
      captainId: clientTwo.id,
      contactPhone: clientTwo.phone,
      city: "Medellin",
      players: {
        create: [
          {
            id: "player-la10-1",
            name: "Andres Marin",
            documentNumber: "1002001001",
            jerseyNumber: 9,
            position: "Delantero"
          },
          {
            id: "player-la10-2",
            name: "Sebastian Ruiz",
            documentNumber: "1002001002",
            jerseyNumber: 5,
            position: "Defensa"
          }
        ]
      }
    }
  });

  const subscription = await prisma.teamSubscription.create({
    data: {
      id: "subscription-barrio-premium",
      teamId: barrioFc.id,
      planId: premiumPlan.id,
      fixedCourtId: northCourt.id,
      status: TeamSubscriptionStatus.ACTIVE,
      fixedDayOfWeek: 3,
      fixedTime: "20:00",
      monthlyAmount: premiumPlan.monthlyPrice
    }
  });

  await prisma.teamSubscription.create({
    data: {
      id: "subscription-la10-basic",
      teamId: laDiez.id,
      planId: basicPlan.id,
      status: TeamSubscriptionStatus.ACTIVE,
      monthlyAmount: basicPlan.monthlyPrice
    }
  });

  const tournament = await prisma.tournament.create({
    data: {
      id: "tournament-night-cup",
      name: "Copa Nocturna",
      description: "Torneo de futbol 5 con fase de grupos y eliminatorias.",
      status: TournamentStatus.IN_PROGRESS,
      startDate: nextDateAt(-7, 18),
      endDate: nextDateAt(30, 22),
      inscriptionFee: "180000",
      teams: {
        create: [
          { teamId: barrioFc.id },
          { teamId: laDiez.id }
        ]
      }
    }
  });

  const playedMatch = await prisma.match.create({
    data: {
      id: "match-night-1",
      tournamentId: tournament.id,
      courtId: eliteCourt.id,
      homeTeamId: barrioFc.id,
      awayTeamId: laDiez.id,
      scheduledAt: nextDateAt(-1, 20),
      homeScore: 3,
      awayScore: 2,
      status: MatchStatus.PLAYED
    }
  });

  await prisma.goal.createMany({
    data: [
      {
        matchId: playedMatch.id,
        teamId: barrioFc.id,
        playerId: "player-barrio-1",
        minute: 12
      },
      {
        matchId: playedMatch.id,
        teamId: barrioFc.id,
        playerId: "player-barrio-1",
        minute: 31
      },
      {
        matchId: playedMatch.id,
        teamId: laDiez.id,
        playerId: "player-la10-1",
        minute: 44
      }
    ]
  });

  await prisma.card.createMany({
    data: [
      {
        matchId: playedMatch.id,
        teamId: laDiez.id,
        playerId: "player-la10-2",
        type: CardType.YELLOW,
        minute: 21
      },
      {
        matchId: playedMatch.id,
        teamId: barrioFc.id,
        playerId: "player-barrio-1",
        type: CardType.RED,
        minute: 49
      }
    ]
  });

  const confirmedReservation = await prisma.reservation.create({
    data: {
      id: "reservation-confirmed-1",
      userId: clientOne.id,
      courtId: northCourt.id,
      startsAt: nextDateAt(1, 19),
      durationMinutes: 60,
      totalAmount: "90000",
      depositAmount: "30000",
      status: ReservationStatus.CONFIRMED,
      notes: "Reserva de ejemplo confirmada"
    }
  });

  const pendingReservation = await prisma.reservation.create({
    data: {
      id: "reservation-pending-1",
      userId: clientOne.id,
      courtId: southCourt.id,
      startsAt: nextDateAt(2, 20),
      durationMinutes: 60,
      totalAmount: "120000",
      depositAmount: "40000",
      status: ReservationStatus.PENDING,
      notes: "Pendiente de anticipo"
    }
  });

  await prisma.payment.createMany({
    data: [
      {
        id: "payment-reservation-paid",
        userId: clientOne.id,
        reservationId: confirmedReservation.id,
        amount: confirmedReservation.depositAmount,
        currency: "COP",
        purpose: PaymentPurpose.RESERVATION,
        status: PaymentStatus.PAID,
        provider: "mock",
        providerReference: "mock-paid-001",
        paidAt: new Date()
      },
      {
        id: "payment-reservation-pending",
        userId: clientOne.id,
        reservationId: pendingReservation.id,
        amount: pendingReservation.depositAmount,
        currency: "COP",
        purpose: PaymentPurpose.RESERVATION,
        status: PaymentStatus.PENDING,
        provider: "mock",
        providerReference: "mock-pending-001"
      },
      {
        id: "payment-subscription-pending",
        userId: clientOne.id,
        teamSubscriptionId: subscription.id,
        amount: subscription.monthlyAmount,
        currency: "COP",
        purpose: PaymentPurpose.SUBSCRIPTION,
        status: PaymentStatus.PENDING,
        provider: "mock",
        providerReference: "mock-subscription-001"
      }
    ]
  });

  await prisma.blockedSlot.create({
    data: {
      courtId: eliteCourt.id,
      startsAt: nextDateAt(3, 18),
      endsAt: nextDateAt(3, 20),
      reason: "Mantenimiento programado"
    }
  });

  console.log(`Seed listo. Admin: ${admin.email}. Cliente demo: ${clientOne.email}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
