import { AdminSidebar } from "@/frontend/components/layout/admin-sidebar";

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="px-6 py-8 md:ml-72">{children}</main>
    </div>
  );
}
