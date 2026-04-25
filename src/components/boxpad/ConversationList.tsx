import { Skeleton } from "@/components/Skeleton";
import { PanelLeft, SquarePen, ListFilter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Conversation {
  id: number;
  name: string;
  preview: string;
  time: string;
  avatarColor: string;
}

interface Props {
  loaded: boolean;
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
  /** Mobile: show back button to return to sidebar */
  onShowSidebar?: () => void;
}

export function ConversationList({
  loaded,
  conversations,
  activeId,
  onSelect,
  onShowSidebar,
}: Props) {
  return (
    <div className="flex w-full h-full flex-col bg-panel overflow-hidden">
      {/* Header */}
      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2 min-w-0">
          <button
            className="rounded-md p-1.5 hover:bg-secondary shrink-0"
            onClick={onShowSidebar}
            aria-label="Open sidebar"
          >
            <PanelLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <h3 className="truncate text-sm font-semibold">Michael Johnson</h3>
        </div>
        <button className="rounded-md p-1.5 hover:bg-secondary shrink-0" aria-label="New">
          <SquarePen className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-border p-3">
        <div className="flex items-center gap-2 rounded-md border border-border bg-panel-muted px-3 py-2">
          <svg
            className="h-4 w-4 shrink-0 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            placeholder="Search Chat"
            className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <ListFilter className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
      </div>

      {/* Filter bar */}
      {loaded ? (
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 text-xs">
          <button className="flex items-center gap-1 font-medium">
            Open <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button className="flex items-center gap-1 font-medium">
            Newest <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <Skeleton width={60} />
          <Skeleton width={60} />
        </div>
      )}

      {/* Conversation list */}
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {!loaded
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-border px-4 py-3">
                <div className="skeleton-shimmer h-9 w-9 shrink-0 rounded-full" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton width="70%" />
                  <Skeleton width="90%" />
                </div>
                <Skeleton width={32} className="shrink-0" />
              </div>
            ))
          : conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-secondary/40",
                  activeId === c.id && "bg-secondary/70",
                )}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: c.avatarColor }}
                >
                  {c.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{c.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.preview}</p>
                </div>
              </button>
            ))}
      </div>
    </div>
  );
}
