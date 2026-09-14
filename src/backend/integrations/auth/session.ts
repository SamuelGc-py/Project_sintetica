import type { AppRole } from "@/backend/integrations/auth/roles";

export type AuthSession = {
  userId: string;
  role: AppRole;
  email: string;
  name: string;
};

export async function getCurrentSession(): Promise<AuthSession | null> {
  // TODO: Replace with Auth.js, Lucia or a custom JWT/session adapter.
  // For now the app uses a deterministic demo client to make the flows usable.
  return {
    userId: "client-1",
    role: "client",
    email: "carlos@cancha-pro.com",
    name: "Carlos Perez"
  };
}

export async function getCurrentAdminSession(): Promise<AuthSession> {
  return {
    userId: "admin-1",
    role: "admin",
    email: "admin@cancha-pro.com",
    name: "Admin Cancha Pro"
  };
}
