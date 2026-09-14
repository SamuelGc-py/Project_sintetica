export type UserRole = "admin" | "client" | "superadmin";

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
};

export type PlayerSummary = {
  id: string;
  name: string;
  documentNumber?: string;
  jerseyNumber?: number;
  position?: string;
};

export type TeamSummary = {
  id: string;
  name: string;
  captainName?: string;
  contactPhone?: string;
  city?: string;
  players: PlayerSummary[];
  activePlanName?: string;
};
