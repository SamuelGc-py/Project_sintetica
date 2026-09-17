import { ClientSidebar } from "@/frontend/components/layout/client-sidebar";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50">
      <ClientSidebar />
      <main className="min-h-screen px-4 pb-10 pt-24 sm:px-6 md:mr-72 md:px-10 md:pt-24">{children}</main>
    </div>
  );
}
