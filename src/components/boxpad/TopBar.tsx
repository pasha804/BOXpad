import {
  Inbox as InboxIcon,
  Users,
  Sparkles,
  Network,
  Target,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const teams = [
  { name: "Sales", count: 7, color: "#34D399" },
  { name: "Customer Support", count: 16, color: "#60A5FA" },
];

const navItems = [
  { id: "inbox", label: "Inbox", Icon: InboxIcon },
  { id: "contacts", label: "Contacts", Icon: Users },
  { id: "ai", label: "AI Employees", Icon: Sparkles },
  { id: "workflows", label: "Workflows", Icon: Network },
  { id: "campaigns", label: "Campaigns", Icon: Target },
];

interface Props {
  onOpenSidebar?: () => void;
  onOpenDetails?: () => void;
}

export function TopBar({ onOpenSidebar, onOpenDetails }: Props) {
  const [active, setActive] = useState("inbox");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-panel px-3 sm:px-5 relative z-40">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          {/* Hamburger for mobile */}
          <button
            className="flex sm:hidden items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Brand */}
          <div className="flex items-center shrink-0">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#007AFF]">BOXpad</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-0.5 overflow-x-auto scrollbar-thin">
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                  active === id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Actions + Avatar */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary sm:hidden"
              aria-label="Open sidebar"
            >
              <InboxIcon className="h-5 w-5" />
            </button>
          )}
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
          </button>
          <div className="flex items-center gap-2 rounded-full">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#EF4444] text-xs sm:text-sm font-semibold text-white shadow-sm">
              M
            </div>
            <span className="hidden lg:block text-sm font-medium">Michael Johnson</span>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-30 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          {/* Drawer */}
          <nav className="relative z-10 flex w-64 flex-col gap-1 bg-panel p-4 shadow-xl">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </p>
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActive(id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active === id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
