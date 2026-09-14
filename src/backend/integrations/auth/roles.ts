export const roles = ["admin", "client", "superadmin"] as const;

export type AppRole = (typeof roles)[number];

export function canAccessAdmin(role: AppRole) {
  return role === "admin" || role === "superadmin";
}
