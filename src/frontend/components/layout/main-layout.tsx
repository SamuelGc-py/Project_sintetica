import type { ReactNode } from "react";
import { PublicNavbar } from "@/frontend/components/layout/public-navbar";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />
      {children}
    </div>
  );
}
