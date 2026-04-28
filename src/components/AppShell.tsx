import { useState, useEffect, ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthContext";

/** Mobile-frame app shell: top app bar, side drawer, bottom nav, page transitions. */
interface AppShellProps {
  children: ReactNode;
  /** Choose which bottom nav set to show. */
  navSet?: "user" | "admin" | "none";
  /** Show top app bar. */
  topBar?: boolean;
  /** Custom title for top bar. */
  title?: string;
  /** Show back button instead of menu. */
  back?: boolean;
  /** Custom right action. */
  rightAction?: ReactNode;
  /** Hide the dot grid background. */
  noGrid?: boolean;
  /** Replace default header entirely. */
  customHeader?: ReactNode;
  /** Hide bottom nav (alias for navSet=none). */
  noNav?: boolean;
}

const userNav = [
  { to: "/archive", label: "Archive", icon: "folder" },
  { to: "/quiz", label: "Quiz", icon: "quiz" },
  { to: "/journey", label: "Chapters", icon: "history_edu" },
  { to: "/profile", label: "Profile", icon: "person" },
];
const adminNav = [
  { to: "/admin", label: "Overview", icon: "dashboard" },
  { to: "/admin/users", label: "Users", icon: "group" },
  { to: "/admin/maintenance", label: "Systems", icon: "dns" },
  { to: "/admin/logs", label: "Logs", icon: "terminal" },
];

const baseDrawerLinks = [
  { to: "/discover", label: "Discover", icon: "explore", roles: ["member"] as const },
  { to: "/journey", label: "Historical Journey", icon: "history_edu", roles: ["member"] as const },
  { to: "/contribute", label: "Contribute a Memory", icon: "add_circle", roles: ["member"] as const },
  { to: "/quiz", label: "Heritage Quiz", icon: "quiz", roles: ["member"] as const },
  { to: "/daleel", label: "Daleel Assistant", icon: "auto_awesome", roles: ["member"] as const },
  { to: "/vr", label: "VR Immersion", icon: "view_in_ar", roles: ["member"] as const },
  { to: "/profile", label: "Master Storyteller", icon: "workspace_premium", roles: ["admin"] as const },
  { to: "/admin", label: "Admin Console", icon: "shield_person", roles: ["admin"] as const },
];

export const AppShell = ({
  children,
  navSet = "user",
  topBar = true,
  title,
  back,
  rightAction,
  noGrid,
  customHeader,
  noNav,
}: AppShellProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  // Close drawer on route change
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  const nav = noNav ? "none" : navSet;
  const items = nav === "admin" ? adminNav : nav === "user" ? userNav : [];
  const drawerLinks = baseDrawerLinks.filter((l) =>
    role ? (l.roles as ReadonlyArray<string>).includes(role) : l.roles.includes("member" as never)
  );

  return (
    <div className="min-h-screen w-full bg-surface-dim flex justify-center">
      {/* Mobile frame */}
      <div className="relative w-full max-w-[420px] min-h-screen bg-surface overflow-hidden border-x border-border/20 flex flex-col">
        {/* Dot grid texture */}
        {!noGrid && (
          <div className="absolute inset-0 dot-grid pointer-events-none opacity-40" />
        )}

        {/* Header */}
        {customHeader ? (
          customHeader
        ) : topBar ? (
          <header className="relative z-30 flex items-center justify-between px-5 py-4 bg-surface/90 backdrop-blur-sm">
            <button
              onClick={() => (back ? navigate(-1) : setDrawerOpen(true))}
              className="w-10 h-10 -ml-2 flex items-center justify-center text-primary rounded-full hover:bg-surface-high/60 transition-colors"
              aria-label={back ? "Back" : "Open menu"}
            >
              <Icon name={back ? "arrow_back" : "menu"} size={26} />
            </button>
            <div className="flex flex-col items-center">
              {title ? (
                <h1 className="font-serif font-bold text-primary text-xl tracking-wider">
                  {title}
                </h1>
              ) : (
                <>
                  <h1 className="font-serif font-bold text-primary text-xl tracking-[0.18em]">
                    THAKIRA
                  </h1>
                </>
              )}
            </div>
            <div className="w-10 h-10 -mr-2 flex items-center justify-center">
              {rightAction ?? (
                <NavLink to="/profile" aria-label="Profile">
                  <div className="w-9 h-9 rounded-full bg-surface-highest ghost-border overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <Icon name="person" filled className="text-primary" size={20} />
                    </div>
                  </div>
                </NavLink>
              )}
            </div>
          </header>
        ) : null}

        {/* Page content */}
        <main className="relative z-10 flex-1 overflow-y-auto pb-32 page-enter" key={location.pathname}>
          {children}
        </main>

        {/* Bottom Nav */}
        {nav !== "none" && (
          <nav className="absolute bottom-0 inset-x-0 z-40">
            <div className="mx-3 mb-3 rounded-[1.75rem] bg-surface-low/95 backdrop-blur-xl ghost-border shadow-elevated">
              <div className="grid grid-cols-4 px-2 py-2">
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/admin"}
                    className={({ isActive }) =>
                      cn(
                        "flex flex-col items-center justify-center gap-1 py-2 rounded-2xl text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            "flex items-center justify-center w-12 h-9 rounded-full transition-all duration-300",
                            isActive && "bg-primary glow-soft"
                          )}
                        >
                          <Icon name={item.icon} filled={isActive} size={22} />
                        </span>
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
        )}

        {/* Drawer overlay */}
        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
          >
            <aside
              onClick={(e) => e.stopPropagation()}
              className="drawer-enter absolute left-0 top-0 bottom-0 w-[78%] max-w-[320px] bg-surface-low ghost-border shadow-elevated p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-primary tracking-wider">
                    THAKIRA
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
                    Heritage Preserved
                  </p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-9 h-9 rounded-full hover:bg-surface-high/60 flex items-center justify-center text-muted-foreground"
                  aria-label="Close menu"
                >
                  <Icon name="close" size={22} />
                </button>
              </div>

              <div className="gold-divider mb-6" />

              <nav className="flex flex-col gap-1 flex-1 overflow-y-auto no-scrollbar">
                {drawerLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all",
                        isActive
                          ? "bg-primary/10 text-primary glow-soft"
                          : "text-foreground/80 hover:bg-surface-high/60"
                      )
                    }
                  >
                    <Icon name={l.icon} className="text-primary" size={22} />
                    <span className="font-medium text-sm tracking-wide">{l.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="gold-divider my-4" />
              <button
                onClick={async () => {
                  setDrawerOpen(false);
                  await logout();
                  navigate("/login");
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-crimson hover:bg-crimson/10 transition-colors text-sm"
              >
                <Icon name="logout" size={20} />
                <span>Sign out</span>
              </button>
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 text-center mt-4">
                Archival Protocol v4.0
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
