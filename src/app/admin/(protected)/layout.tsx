import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { CalendarClock, Clock, LayoutDashboard, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { requireAdmin, isClerkConfigured } from "@/lib/admin-auth";

// Authenticated admin content must never be statically cached or served stale.
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarClock },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/horaires", label: "Horaires", icon: Clock },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-xl text-ink">Administration non configurée</h1>
          <p className="mt-3 text-sm text-ink-soft">
            L&apos;authentification n&apos;est pas encore configurée. Consultez docs/DEPLOYMENT.md.
          </p>
        </div>
      </div>
    );
  }

  const session = await requireAdmin();
  if (!session) {
    redirect("/admin/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-row items-center justify-between border-b border-line bg-paper px-5 py-4 lg:w-60 lg:flex-col lg:items-stretch lg:justify-start lg:border-b-0 lg:border-r lg:py-8">
        <Link href="/admin" className="font-display text-lg font-semibold text-ink">
          Aux Trois Licornes
        </Link>
        <nav className="hidden lg:mt-10 lg:flex lg:flex-col lg:gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-parchment hover:text-ink"
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-ink-faint sm:inline">{session.email}</span>
          <UserButton />
        </div>
      </aside>

      <nav className="flex overflow-x-auto border-b border-line bg-paper px-3 py-2 lg:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-none items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium text-ink-soft"
          >
            <item.icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 bg-parchment p-5 sm:p-8">{children}</main>
    </div>
  );
}
