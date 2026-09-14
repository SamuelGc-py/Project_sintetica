import type {
  BlockedSlotSummary,
  CourtSummary,
  ReservationSummary,
  ScheduleConfigSummary
} from "@/shared/types/reservation";
import type { PaymentSummary } from "@/shared/types/payment";
import type { SubscriptionPlanSummary, TeamSubscriptionSummary } from "@/shared/types/subscription";
import type {
  CardSummary,
  ScorerSummary,
  TournamentMatchSummary,
  TournamentStanding,
  TournamentSummary
} from "@/shared/types/tournament";
import type { TeamSummary, UserSummary } from "@/shared/types/user";

export const mockUsers: UserSummary[] = [
  {
    id: "client-1",
    name: "Carlos Perez",
    email: "carlos@cancha-pro.com",
    phone: "+57 300 200 0000",
    role: "client"
  },
  {
    id: "client-2",
    name: "Laura Gomez",
    email: "laura@cancha-pro.com",
    phone: "+57 310 300 0000",
    role: "client"
  }
];

export const mockCourts: CourtSummary[] = [
  {
    id: "court-north",
    name: "Cancha Norte",
    type: "Futbol 5",
    location: "Sede principal",
    hourlyRate: 90000,
    status: "activa"
  },
  {
    id: "court-south",
    name: "Cancha Sur",
    type: "Futbol 7",
    location: "Sede principal",
    hourlyRate: 120000,
    status: "activa"
  },
  {
    id: "court-elite",
    name: "Cancha Elite",
    type: "Futbol 5 cubierta",
    location: "Sede cubierta",
    hourlyRate: 110000,
    status: "activa"
  }
];

export const mockReservations: ReservationSummary[] = [
  {
    id: "reservation-confirmed-1",
    courtId: "court-north",
    userId: "client-1",
    courtName: "Cancha Norte",
    customerName: "Carlos Perez",
    date: "2026-05-09",
    startTime: "7:00 p.m.",
    startsAt: "2026-05-09T19:00:00.000Z",
    durationMinutes: 60,
    totalAmount: 90000,
    depositAmount: 30000,
    status: "confirmada",
    paymentStatus: "pagado"
  },
  {
    id: "reservation-pending-1",
    courtId: "court-south",
    userId: "client-1",
    courtName: "Cancha Sur",
    customerName: "Carlos Perez",
    date: "2026-05-10",
    startTime: "8:00 p.m.",
    startsAt: "2026-05-10T20:00:00.000Z",
    durationMinutes: 60,
    totalAmount: 120000,
    depositAmount: 40000,
    status: "pendiente",
    paymentStatus: "pendiente"
  }
];

export const mockPayments: PaymentSummary[] = [
  {
    id: "payment-reservation-paid",
    reservationId: "reservation-confirmed-1",
    description: "Anticipo reserva Cancha Norte",
    amount: 30000,
    currency: "COP",
    purpose: "reserva",
    status: "pagado",
    provider: "mock",
    customerName: "Carlos Perez"
  },
  {
    id: "payment-reservation-pending",
    reservationId: "reservation-pending-1",
    description: "Anticipo reserva Cancha Sur",
    amount: 40000,
    currency: "COP",
    purpose: "reserva",
    status: "pendiente",
    provider: "mock",
    customerName: "Carlos Perez"
  }
];

export const mockPlans: SubscriptionPlanSummary[] = [
  {
    id: "plan-basic",
    name: "Plan Basico",
    tier: "basic",
    monthlyPrice: 180000,
    discountPercentage: 5,
    hoursIncluded: 4,
    weeklyFixedReservation: false,
    features: ["Reservas recurrentes", "Historial de pagos", "Soporte basico"]
  },
  {
    id: "plan-premium",
    name: "Plan Premium",
    tier: "premium",
    monthlyPrice: 280000,
    discountPercentage: 10,
    hoursIncluded: 6,
    weeklyFixedReservation: true,
    features: ["Reserva fija semanal", "Descuentos", "Recordatorios por WhatsApp"]
  },
  {
    id: "plan-elite",
    name: "Plan Elite",
    tier: "elite",
    monthlyPrice: 420000,
    discountPercentage: 15,
    hoursIncluded: 10,
    weeklyFixedReservation: true,
    features: ["Prioridad horaria", "Reportes del equipo", "Beneficios en torneos"]
  }
];

export const mockTeams: TeamSummary[] = [
  {
    id: "team-barrio-fc",
    name: "Barrio FC",
    captainName: "Carlos Perez",
    contactPhone: "+57 300 200 0000",
    city: "Bogota",
    activePlanName: "Plan Premium",
    players: [
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
];

export const mockTeamSubscriptions: TeamSubscriptionSummary[] = [
  {
    id: "subscription-barrio-premium",
    teamName: "Barrio FC",
    planName: "Plan Premium",
    status: "activa",
    monthlyAmount: 280000,
    fixedCourtName: "Cancha Norte",
    fixedDayOfWeek: 3,
    fixedTime: "20:00"
  }
];

export const mockTournaments: TournamentSummary[] = [
  {
    id: "tournament-night-cup",
    name: "Copa Nocturna",
    description: "Torneo de futbol 5 con fase de grupos y eliminatorias.",
    status: "en curso",
    registeredTeams: 2,
    inscriptionFee: 180000
  }
];

export const mockMatches: TournamentMatchSummary[] = [
  {
    id: "match-night-1",
    tournamentName: "Copa Nocturna",
    courtName: "Cancha Elite",
    homeTeamId: "team-barrio-fc",
    homeTeamName: "Barrio FC",
    awayTeamId: "team-la-diez",
    awayTeamName: "La 10",
    scheduledAt: "2026-05-07T20:00:00.000Z",
    homeScore: 3,
    awayScore: 2,
    status: "jugado"
  }
];

export const mockStandings: TournamentStanding[] = [
  {
    teamId: "team-barrio-fc",
    teamName: "Barrio FC",
    played: 1,
    points: 3,
    wins: 1,
    draws: 0,
    losses: 0,
    goalsFor: 3,
    goalsAgainst: 2,
    goalDifference: 1
  },
  {
    teamId: "team-la-diez",
    teamName: "La 10",
    played: 1,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 1,
    goalsFor: 2,
    goalsAgainst: 3,
    goalDifference: -1
  }
];

export const mockScorers: ScorerSummary[] = [
  {
    playerId: "player-barrio-1",
    playerName: "Juan Rodriguez",
    teamName: "Barrio FC",
    goals: 2
  }
];

export const mockCards: CardSummary[] = [
  {
    playerId: "player-la10-2",
    playerName: "Sebastian Ruiz",
    teamName: "La 10",
    yellowCards: 1,
    redCards: 0
  }
];

export const mockSchedules: ScheduleConfigSummary[] = [
  {
    id: "schedule-1",
    courtId: "court-north",
    courtName: "Cancha Norte",
    dayOfWeek: 1,
    opensAt: "06:00",
    closesAt: "23:00",
    slotMinutes: 60,
    isActive: true
  }
];

export const mockBlockedSlots: BlockedSlotSummary[] = [
  {
    id: "blocked-1",
    courtId: "court-elite",
    courtName: "Cancha Elite",
    startsAt: "2026-05-11T18:00:00.000Z",
    endsAt: "2026-05-11T20:00:00.000Z",
    reason: "Mantenimiento programado"
  }
];
