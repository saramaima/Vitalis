import { Link, useNavigate } from "@tanstack/react-router";
import {
  Apple,
  Bell,
  CalendarDays,
  Droplets,
  Dumbbell,
  LayoutDashboard,
  LineChart,
  LogOut,
  Scale,
  Settings,
  Target,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Logo } from "@/components/site-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  apiGet,
  apiPost,
  clearStoredUser,
  clearToken,
  getStoredUser,
  setStoredUser,
  type ApiUser,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Meals", to: "/meals", icon: Apple },
  { label: "Exercise", to: "/exercise", icon: Dumbbell },
  { label: "Water", to: "/water", icon: Droplets },
  { label: "Weight", to: "/weight", icon: Scale },
  { label: "Progress", to: "/progress", icon: LineChart },
  { label: "Goals", to: "/goals", icon: Target },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(() => getStoredUser());

  useEffect(() => {
    apiGet<ApiUser>("/user")
      .then((u) => {
        setCurrentUser(u);
        setStoredUser(u);
      })
      .catch(() => undefined);
  }, []);

  const initials = (currentUser?.name ?? "Vitalis User")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Logo className="px-2" />
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{
                className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <item.icon className="size-[18px] shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={async () => {
            try {
              await apiPost("/auth/logout");
            } finally {
              clearToken();
              clearStoredUser();
              navigate({ to: "/login" });
            }
          }}
          className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="size-[18px]" />
          Log out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 border-b border-border bg-card/85 px-5 py-4 backdrop-blur lg:px-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-bold sm:text-2xl">{title}</h1>
              <p className="truncate text-sm text-muted-foreground">
                {subtitle ??
                  `Welcome back, ${currentUser?.name ?? "there"} — here's your day so far.`}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex">
                <CalendarDays className="size-4" />
                {new Date().toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </button>
              <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
                <Bell className="size-[18px]" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
              </Button>
              <Avatar className="size-9 border border-border">
                <AvatarFallback className="bg-primary-soft text-sm font-semibold text-accent-foreground">
                  {initials || "VU"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
        </header>

        <main className="min-w-0 flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {nav.slice(0, 5).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{ className: "text-primary" }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function SectionCard({
  title,
  action,
  className,
  children,
}: {
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("surface-card surface-card-hover p-5 sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="truncate font-display text-base font-bold sm:text-lg">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
