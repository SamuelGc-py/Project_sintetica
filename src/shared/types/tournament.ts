export type TournamentStatus =
  | "borrador"
  | "inscripciones abiertas"
  | "en curso"
  | "finalizado"
  | "cancelado";

export type TournamentSummary = {
  id: string;
  name: string;
  description: string;
  status: TournamentStatus;
  registeredTeams: number;
  inscriptionFee: number;
};

export type TournamentStanding = {
  teamId: string;
  teamName: string;
  played: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

export type TournamentMatchSummary = {
  id: string;
  tournamentName: string;
  courtName?: string;
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  scheduledAt?: string;
  homeScore?: number;
  awayScore?: number;
  status: "programado" | "jugado" | "cancelado";
};

export type ScorerSummary = {
  playerId: string;
  playerName: string;
  teamName: string;
  goals: number;
};

export type CardSummary = {
  playerId: string;
  playerName: string;
  teamName: string;
  yellowCards: number;
  redCards: number;
};
