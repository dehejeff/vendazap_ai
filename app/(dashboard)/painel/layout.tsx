import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard-topbar";
import { BrandLogo } from "@/components/brand-logo";
import { LogoutButton } from "@/components/logout-button";
import { PainelNav } from "@/components/painel-nav";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  if (!session) {
    redirect("/entrar");
  }

  return (
    <div className="dashboard-shell dashboard-grid min-h-screen text-[#163322]">
      <DashboardSidebar storeName={session.storeName} />

      <div className="md:ml-64">
        <div className="border-b border-[#e1e3e4] bg-[rgba(248,250,251,0.92)] md:hidden">
          <div className="container-shell flex items-center justify-between gap-3 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <BrandLogo size="sm" theme="light" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-[#00d981]/20 bg-[#00d981]/10 px-3 py-1.5 text-[11px] font-semibold text-[#005931]">
                <span className="h-2 w-2 rounded-full bg-[#006d3e]" />
                Conectado
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <DashboardTopbar />
        </div>

        <main className="container-shell relative z-10 py-4 pb-32 sm:py-6 sm:pb-8 md:max-w-none md:px-6 md:py-6 lg:px-8">
          <div className="space-y-6 sm:space-y-6 md:space-y-5">
            <PainelNav />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
