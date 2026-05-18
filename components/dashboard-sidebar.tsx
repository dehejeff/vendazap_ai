"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { LogoutButton } from "@/components/logout-button";

const items = [
  { href: "/painel", label: "Painel", icon: "dashboard" },
  { href: "/painel/conversas", label: "Conversas", icon: "chat_bubble" },
  { href: "/painel/catalogo", label: "Catálogo", icon: "inventory_2" },
  { href: "/painel/whatsapp", label: "Ajustes", icon: "settings" },
] as const;

function SidebarIcon({ name }: { name: string }) {
  const common = "h-[1.15rem] w-[1.15rem]";

  if (name === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5.5 5.5h5v5h-5z" />
        <path d="M13.5 5.5h5v8h-5z" />
        <path d="M5.5 13.5h5v5h-5z" />
        <path d="M13.5 16.5h5v2h-5z" />
      </svg>
    );
  }

  if (name === "chat_bubble") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 8h12" strokeLinecap="round" />
        <path d="M6 12h8" strokeLinecap="round" />
        <path d="M6 16h5" strokeLinecap="round" />
        <path d="M5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H11l-4.5 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9A1.5 1.5 0 0 1 5.5 4Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "inventory_2") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 6.5h12" strokeLinecap="round" />
        <path d="M6 11.5h12" strokeLinecap="round" />
        <path d="M6 16.5h8" strokeLinecap="round" />
        <path d="M5.5 4h13a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4.5v2.5" strokeLinecap="round" />
      <path d="M9.75 4.5h4.5" strokeLinecap="round" />
      <path d="M6 18V9.75A2.75 2.75 0 0 1 8.75 7h6.5A2.75 2.75 0 0 1 18 9.75V18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 18v-4h4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DashboardSidebar({ storeName }: { storeName?: string }) {
  const pathname = usePathname();
  const sidebarStoreName = storeName?.trim() || "Loja ativa";

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[#bbcbb9]/60 bg-[#f0f3ff] shadow-sm md:flex">
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="px-4 py-5">
          <BrandLogo size="sm" theme="light" />
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#6c7b6b]">
            {sidebarStoreName}
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/painel" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#25d366] text-[#005523]"
                    : "text-[#3c4a3d] hover:bg-[#dee8ff]"
                }`}
              >
                <SidebarIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-[#bbcbb9]/40 pt-4">
          <div className="px-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </aside>
  );
}
