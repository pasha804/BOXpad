import { useState } from "react";
import { Skeleton } from "@/components/Skeleton";
import { ChevronDown, PanelRight, Plus, UserCog, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaWhatsapp } from "react-icons/fa";

export interface Contact {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface Props {
  loaded: boolean;
  contact: Contact | null;
  /** Mobile: panel shown as drawer overlay */
  open?: boolean;
  onClose?: () => void;
}

export function DetailsPanel({ loaded, contact, open, onClose }: Props) {
  return (
    <>
      {/* Desktop: always visible */}
      <aside className="hidden lg:flex w-[300px] xl:w-[340px] shrink-0 flex-col border-l border-border bg-panel overflow-hidden">
        <PanelBody loaded={loaded} contact={contact} />
      </aside>

      {/* Mobile/Tablet: overlay drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          {/* Drawer */}
          <aside className="relative z-10 flex w-80 flex-col border-l border-border bg-panel shadow-xl overflow-hidden">
            <PanelBody loaded={loaded} contact={contact} onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}

function PanelBody({
  loaded,
  contact,
  onClose,
}: {
  loaded: boolean;
  contact: Contact | null;
  onClose?: () => void;
}) {
  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
        <h3 className="text-base font-semibold">Details</h3>
        <div className="flex items-center gap-1">
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md p-1.5 hover:bg-secondary lg:hidden"
              aria-label="Close details"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <button className="rounded-md p-1.5 hover:bg-secondary">
            <PanelRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <Section title="Chat Data" loaded={loaded} skeletonRows={2}>
          <Row label="Assignee" value="James West" icon />
          <Row label="Team" value="Sales Team" icon />
        </Section>

        <Section title="Contact Data" loaded={loaded} skeletonRows={4}>
          {contact && (
            <>
              <Row label="First Name" value={contact.firstName} />
              <Row label="Last Name" value={contact.lastName} />
              <Row label="Phone number" value={contact.phone} />
              <Row label="Email" value={contact.email} />
              <button className="px-5 pb-3 pt-1 text-left text-xs font-medium text-[oklch(0.55_0.22_260)]">
                See all
              </button>
            </>
          )}
        </Section>

        <Section title="Contact Labels" loaded={loaded} skeletonRows={1}>
          <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
            <Label color="oklch(0.7 0.15 240)">Closed Won</Label>
            <Label color="oklch(0.7 0.15 240)">Chicago</Label>
            <button className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[oklch(0.7_0.15_240)] text-[oklch(0.7_0.15_240)]">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </Section>

        <NotesSection loaded={loaded} />

        <Section title="Other Chats" loaded={loaded} skeletonRows={1}>
          <div className="flex items-center gap-3 px-5 pb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[oklch(0.65_0.2_15)]">
              <FaWhatsapp className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">Fit4Life</span>
                <span className="shrink-0 text-xs text-muted-foreground">08/08/25</span>
              </div>
              <p className="truncate text-xs text-muted-foreground">On my way!</p>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}

function Section({
  title,
  children,
  loaded,
  skeletonRows = 2,
}: {
  title: string;
  children: React.ReactNode;
  loaded: boolean;
  skeletonRows?: number;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-semibold"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
      </button>
      {open && (
        <>
          {!loaded
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-2.5">
                  <Skeleton width={70} />
                  <div className="flex items-center gap-2">
                    <div className="skeleton-shimmer h-4 w-4 rounded-full" />
                    <Skeleton width={80} />
                  </div>
                </div>
              ))
            : children}
        </>
      )}
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-2 text-sm gap-2">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 font-medium truncate min-w-0">
        {icon && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserCog className="h-3 w-3 text-muted-foreground" />
          </span>
        )}
        <span className="truncate">{value}</span>
      </span>
    </div>
  );
}

function Label({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-medium"
      style={{ borderColor: color, color }}
    >
      <Tag className="h-3 w-3 shrink-0" />
      {children}
    </span>
  );
}

function NotesSection({ loaded }: { loaded: boolean }) {
  const [open, setOpen] = useState(true);
  const [notes, setNotes] = useState<string[]>(["Strong potential for future upgrades"]);
  const [val, setVal] = useState("");

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-semibold"
      >
        Notes
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
      </button>
      {open && (
        <div className="space-y-2 px-5 pb-4">
          {!loaded ? (
            <Skeleton className="h-9 rounded-md" width="100%" />
          ) : (
            <>
              <input
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && val.trim()) {
                    setNotes((n) => [...n, val.trim()]);
                    setVal("");
                  }
                }}
                placeholder="Add a note"
                className="w-full rounded-md bg-note px-3 py-2 text-sm outline-none placeholder:text-[oklch(0.5_0.1_80)]"
              />
              {notes.map((n, i) => (
                <div
                  key={i}
                  className="rounded-md bg-note px-3 py-2 text-sm font-medium text-foreground"
                >
                  {n}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
