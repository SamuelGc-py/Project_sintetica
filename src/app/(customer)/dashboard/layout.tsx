import { ClientSidebar } from "@/frontend/components/layout/client-sidebar";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50">
      <ClientSidebar />
      <main className="px-6 py-8 md:ml-64">{children}</main>
    </div>
  );
}
