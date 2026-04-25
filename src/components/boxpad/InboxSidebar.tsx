import { Inbox, Users, UserCog, ChevronDown, X } from "lucide-react";
import { Skeleton } from "@/components/Skeleton";
import { cn } from "@/lib/utils";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { useState } from "react";

interface Props {
  loaded: boolean;
  /** On mobile, sidebar is shown as a drawer when true */
  open?: boolean;
  onClose?: () => void;
}

const inboxItems = [
  { id: "my", label: "My Inbox", Icon: UserCog, count: null as number | null },
  { id: "all", label: "All", Icon: Users, count: 28 },
  { id: "unassigned", label: "Unassigned", Icon: Inbox, count: 5 },
];

const teams = [
  { name: "Sales", count: 7, color: "#34D399" },
  { name: "Customer Support", count: 16, color: "#60A5FA" },
];

const users = [
  "Sarah Williams",
  "Michael Johnson",
  "Emily Davis",
  "Christopher Miller",
  "Amanda Garcia",
  "Joshua Martinez",
  "Ashley Taylor",
  "Daniel Anderson",
  "Jessica Thomas",
];

function SidebarContent({ loaded, onClose }: { loaded: boolean; onClose?: () => void }) {
  const [active, setActive] = useState("my");

  return (
    <div className="flex h-full flex-col gap-1 overflow-y-auto scrollbar-thin p-3">
      {/* Header row: title + close on mobile */}
      <div className="flex items-center justify-between px-2 py-2">
        <h2 className="text-base font-semibold">Inbox</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary sm:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {inboxItems.map(({ id, label, Icon, count }) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          className={cn(
            "flex items-center justify-between rounded-md px-2 py-2 text-sm transition-colors",
            active === id ? "bg-secondary font-medium" : "hover:bg-secondary/60",
          )}
        >
          <span className="flex items-center gap-2.5">
            <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
            {label}
          </span>
          {count !== null && <span className="text-xs text-muted-foreground">{count}</span>}
        </button>
      ))}

      <Section title="Teams">
        {teams.map((t) => (
          <button
            key={t.name}
            className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-secondary/60"
          >
            <span className="flex items-center gap-2.5">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full shrink-0"
                style={{ backgroundColor: t.color }}
              >
                <Users className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
              </span>
              <span className="truncate">{t.name}</span>
            </span>
            <span className="text-xs text-muted-foreground shrink-0">{t.count}</span>
          </button>
        ))}
      </Section>

      <Section title="Users">
        {!loaded
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-2">
                <Skeleton className="h-6 w-full" />
              </div>
            ))
          : users.map((u, i) => (
              <button
                key={u}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-secondary/60"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                    <UserCog className="h-3 w-3 text-muted-foreground" />
                  </span>
                  <span className="truncate">{u}</span>
                </span>
                <span className="text-xs text-muted-foreground shrink-0 ml-1">
                  {((i * 3) % 11) + 1}
                </span>
              </button>
            ))}
      </Section>

      <Section title="Channels">
        <button className="flex items-center gap-2.5 rounded-md bg-secondary px-2 py-2 text-sm font-medium">
          <FaWhatsapp className="h-4 w-4 shrink-0 text-[oklch(0.7_0.18_150)]" />
          <span className="truncate">Fit4Life</span>
        </button>
        <button className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-secondary/60">
          <FaInstagram className="h-4 w-4 shrink-0 text-[oklch(0.65_0.22_20)]" />
          <span className="truncate">Fit4Life</span>
        </button>
      </Section>
    </div>
  );
}

export function InboxSidebar({ loaded, open, onClose }: Props) {
  return (
    <>
      {/* Desktop: always visible sidebar */}
      <aside className="hidden sm:flex w-[220px] lg:w-[240px] shrink-0 flex-col border-r border-border bg-panel overflow-hidden">
        <SidebarContent loaded={loaded} />
      </aside>

      {/* Mobile: overlay drawer */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          {/* Sidebar */}
          <aside className="relative z-10 flex w-72 flex-col bg-panel shadow-xl overflow-hidden">
            <SidebarContent loaded={loaded} onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-2 py-1.5 text-sm font-medium text-muted-foreground"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && <div className="flex flex-col gap-0.5">{children}</div>}
    </div>
  );
}
