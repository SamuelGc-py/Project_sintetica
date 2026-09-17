import { UserPostLoginLayout } from "@/frontend/components/layout/user-postlogin-layout";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserPostLoginLayout>{children}</UserPostLoginLayout>;
}
