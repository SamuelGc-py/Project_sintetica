import {
  CardType,
  MatchStatus,
  TournamentStatus
} from "@prisma/client";
import { prisma } from "@/backend/db/prisma";
import type {
  CardSummary,
  ScorerSummary,
  TournamentMatchSummary,
  TournamentStanding,
  TournamentSummary
} from "@/shared/types/tournament";
import {
  mockCards,
  mockMatches,
  mockScorers,
  mockStandings,
  mockTournaments
} from "@/backend/services/mock-data";
import {
  getNumber,
  matchStatusLabel,
  normalizeOptional,
  parseLocalDateTime,
  toNumber,
  tournamentStatusLabel
} from "@/backend/services/service-utils";

function mapTournament(tournament: {
  id: string;
  name: string;
  description: string | null;
  inscriptionFee: unknown;
  status: TournamentStatus;
  teams: unknown[];
}): TournamentSummary {
  return {
    id: tournament.id,
    name: tournament.name,
    description: tournament.description ?? "Sin descripcion",
    status: tournamentStatusLabel(tournament.status),
    registeredTeams: tournament.teams.length,
    inscriptionFee: toNumber(tournament.inscriptionFee)
  };
}

function mapMatch(match: {
  id: string;
  scheduledAt: Date | null;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  tournament: { name: string };
  court: { name: string } | null;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
}): TournamentMatchSummary {
  return {
    id: match.id,
    tournamentName: match.tournament.name,
    courtName: match.court?.name,
    homeTeamId: match.homeTeamId,
    homeTeamName: match.homeTeam.name,
    awayTeamId: match.awayTeamId,
    awayTeamName: match.awayTeam.name,
    scheduledAt: match.scheduledAt?.toISOString(),
    homeScore: match.homeScore ?? undefined,
    awayScore: match.awayScore ?? undefined,
    status: matchStatusLabel(match.status)
  };
}

export async function getPublicTournaments() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: { teams: true },
      orderBy: { createdAt: "desc" }
    });

    return tournaments.map(mapTournament);
  } catch {
    return mockTournaments;
  }
}

export async function getTournamentMatches(tournamentId?: string) {
  try {
    const matches = await prisma.match.findMany({
      where: tournamentId ? { tournamentId } : undefined,
      include: {
        tournament: true,
        court: true,
        homeTeam: true,
        awayTeam: true
      },
      orderBy: { scheduledAt: "asc" }
    });

    return matches.map(mapMatch);
  } catch {
    return mockMatches;
  }
}

export async function getTournamentStandings(tournamentId?: string): Promise<TournamentStanding[]> {
  try {
    const tournament = await prisma.tournament.findFirst({
      where: tournamentId ? { id: tournamentId } : undefined,
      include: {
        teams: { include: { team: true } },
        matches: true
      },
      orderBy: { createdAt: "desc" }
    });

    if (!tournament) {
      return [];
    }

    const standings = new Map<string, TournamentStanding>();

    tournament.teams.forEach((item) => {
      standings.set(item.teamId, {
        teamId: item.teamId,
        teamName: item.team.name,
        played: 0,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0
      });
    });

    tournament.matches
      .filter(
        (match) =>
          match.status === MatchStatus.PLAYED &&
          match.homeScore !== null &&
          match.awayScore !== null
      )
      .forEach((match) => {
        const home = standings.get(match.homeTeamId);
        const away = standings.get(match.awayTeamId);

        if (!home || !away || match.homeScore === null || match.awayScore === null) {
          return;
        }

        home.played += 1;
        away.played += 1;
        home.goalsFor += match.homeScore;
        home.goalsAgainst += match.awayScore;
        away.goalsFor += match.awayScore;
        away.goalsAgainst += match.homeScore;

        if (match.homeScore > match.awayScore) {
          home.wins += 1;
          home.points += 3;
          away.losses += 1;
        } else if (match.homeScore < match.awayScore) {
          away.wins += 1;
          away.points += 3;
          home.losses += 1;
        } else {
          home.draws += 1;
          away.draws += 1;
          home.points += 1;
          away.points += 1;
        }
      });

    return Array.from(standings.values())
      .map((standing) => ({
        ...standing,
        goalDifference: standing.goalsFor - standing.goalsAgainst
      }))
      .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
  } catch {
    return mockStandings;
  }
}

export async function getScorers(): Promise<ScorerSummary[]> {
  try {
    const goals = await prisma.goal.findMany({
      include: {
        player: true,
        team: true
      }
    });

    const scorers = new Map<string, ScorerSummary>();

    goals.forEach((goal) => {
      const key = goal.playerId ?? `${goal.teamId}-unknown`;
      const current = scorers.get(key) ?? {
        playerId: key,
        playerName: goal.player?.name ?? "Jugador sin registrar",
        teamName: goal.team.name,
        goals: 0
      };

      current.goals += 1;
      scorers.set(key, current);
    });

    return Array.from(scorers.values()).sort((a, b) => b.goals - a.goals);
  } catch {
    return mockScorers;
  }
}

export async function getCardsTable(): Promise<CardSummary[]> {
  try {
    const cards = await prisma.card.findMany({
      include: {
        player: true,
        team: true
      }
    });

    const table = new Map<string, CardSummary>();

    cards.forEach((card) => {
      const key = card.playerId ?? `${card.teamId}-unknown`;
      const current = table.get(key) ?? {
        playerId: key,
        playerName: card.player?.name ?? "Jugador sin registrar",
        teamName: card.team.name,
        yellowCards: 0,
        redCards: 0
      };

      if (card.type === CardType.YELLOW) {
        current.yellowCards += 1;
      } else {
        current.redCards += 1;
      }

      table.set(key, current);
    });

    return Array.from(table.values()).sort(
      (a, b) => b.redCards - a.redCards || b.yellowCards - a.yellowCards
    );
  } catch {
    return mockCards;
  }
}

export async function createTournamentFromForm(formData: FormData) {
  const name = normalizeOptional(formData.get("name"));
  const description = normalizeOptional(formData.get("description"));
  const inscriptionFee = getNumber(formData.get("inscriptionFee"), 0);

  if (!name) {
    throw new Error("El nombre del torneo es obligatorio.");
  }

  return prisma.tournament.create({
    data: {
      name,
      description,
      inscriptionFee,
      status: TournamentStatus.OPEN
    }
  });
}

export async function updateTournamentFromForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = normalizeOptional(formData.get("name"));
  const status = String(formData.get("status") ?? "OPEN") as TournamentStatus;

  if (!id || !name) {
    throw new Error("Selecciona un torneo y escribe su nombre.");
  }

  return prisma.tournament.update({
    where: { id },
    data: {
      name,
      description: normalizeOptional(formData.get("description")),
      inscriptionFee: getNumber(formData.get("inscriptionFee"), 0),
      status
    }
  });
}

export async function deleteTournament(tournamentId: string) {
  if (!tournamentId) {
    throw new Error("Selecciona un torneo valido.");
  }

  const matches = await prisma.match.findMany({
    where: { tournamentId },
    select: { id: true }
  });
  const matchIds = matches.map((match) => match.id);

  await prisma.goal.deleteMany({ where: { matchId: { in: matchIds } } });
  await prisma.card.deleteMany({ where: { matchId: { in: matchIds } } });
  await prisma.match.deleteMany({ where: { tournamentId } });
  await prisma.tournamentTeam.deleteMany({ where: { tournamentId } });
  await prisma.tournament.delete({ where: { id: tournamentId } });
}

export async function enrollTeamFromForm(formData: FormData) {
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const teamId = String(formData.get("teamId") ?? "");

  if (!tournamentId || !teamId) {
    throw new Error("Selecciona torneo y equipo.");
  }

  return prisma.tournamentTeam.upsert({
    where: { tournamentId_teamId: { tournamentId, teamId } },
    update: {},
    create: { tournamentId, teamId }
  });
}

export async function createMatchFromForm(formData: FormData) {
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const courtId = normalizeOptional(formData.get("courtId"));
  const homeTeamId = String(formData.get("homeTeamId") ?? "");
  const awayTeamId = String(formData.get("awayTeamId") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");

  if (!tournamentId || !homeTeamId || !awayTeamId || homeTeamId === awayTeamId) {
    throw new Error("Selecciona torneo y dos equipos diferentes.");
  }

  return prisma.match.create({
    data: {
      tournamentId,
      courtId,
      homeTeamId,
      awayTeamId,
      scheduledAt: date && time ? parseLocalDateTime(date, time) : null,
      status: MatchStatus.SCHEDULED
    }
  });
}

export async function recordMatchResultFromForm(formData: FormData) {
  const matchId = String(formData.get("matchId") ?? "");
  const homeScore = getNumber(formData.get("homeScore"), 0);
  const awayScore = getNumber(formData.get("awayScore"), 0);

  if (!matchId) {
    throw new Error("Selecciona un partido valido.");
  }

  return prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore,
      awayScore,
      status: MatchStatus.PLAYED
    }
  });
}

export async function registerGoalFromForm(formData: FormData) {
  const matchId = String(formData.get("matchId") ?? "");
  const teamId = String(formData.get("teamId") ?? "");
  const playerId = normalizeOptional(formData.get("playerId"));
  const minute = getNumber(formData.get("minute"), 0);

  if (!matchId || !teamId) {
    throw new Error("Selecciona partido y equipo.");
  }

  const goal = await prisma.goal.create({
    data: {
      matchId,
      teamId,
      playerId,
      minute: minute > 0 ? minute : null
    }
  });

  if (playerId) {
    await prisma.player.update({
      where: { id: playerId },
      data: { goals: { increment: 1 } }
    });
  }

  return goal;
}

export async function registerCardFromForm(formData: FormData) {
  const matchId = String(formData.get("matchId") ?? "");
  const teamId = String(formData.get("teamId") ?? "");
  const playerId = normalizeOptional(formData.get("playerId"));
  const type = String(formData.get("type") ?? "YELLOW") as CardType;
  const minute = getNumber(formData.get("minute"), 0);

  if (!matchId || !teamId) {
    throw new Error("Selecciona partido y equipo.");
  }

  const card = await prisma.card.create({
    data: {
      matchId,
      teamId,
      playerId,
      type,
      minute: minute > 0 ? minute : null
    }
  });

  if (playerId) {
    await prisma.player.update({
      where: { id: playerId },
      data:
        type === CardType.YELLOW
          ? { yellowCards: { increment: 1 } }
          : { redCards: { increment: 1 } }
    });
  }

  return card;
}

export async function createTournamentPlaceholder() {
  return {
    status: "draft"
  };
}
