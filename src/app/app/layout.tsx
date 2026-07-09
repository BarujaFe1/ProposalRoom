import { redirect } from "next/navigation";
import { getCurrentUser, getSessionContext } from "@/lib/auth";
import { getPlan } from "@/billing/plans";
import { AppSidebar, AppTopbar } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const session = await getSessionContext();
  if (!session) redirect("/onboarding");

  const plan = getPlan(session.workspace.planId);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <AppSidebar workspaceName={session.workspace.name} planName={plan.name} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar userName={session.user.name} breadcrumb={session.workspace.name} />
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
