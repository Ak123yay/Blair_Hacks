import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardUser } from "@/lib/dashboard/user";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
};

export default async function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const dashboardUser = await getDashboardUser();
  
  if (!dashboardUser) {
    redirect("/login");
  }
  
  return <DashboardShell user={dashboardUser}>{children}</DashboardShell>;
}