import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/Skeleton";
import {
  MoreVertical,
  Moon,
  Image as ImageIcon,
  Play,
  MessageSquare,
  Smile,
  CornerDownLeft,
  Zap,
  Mic,
  Archive,
  ChevronLeft,
  PanelRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  id: number;
  text: string;
  sender: "in" | "out";
  time: string;
}

interface Props {
  loaded: boolean;
  contactName: string;
  messages: Message[];
  /** Mobile: callback to go back to conversation list */
  onBack?: () => void;
  /** Mobile: callback to show details panel */
  onShowDetails?: () => void;
}

export function ChatWindow({
  loaded,
  contactName,
  messages: initial,
  onBack,
  onShowDetails,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initial);
  }, [initial]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        text: input,
        sender: "out",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-1 flex-col bg-panel min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 sm:px-5 py-3.5">
        <div className="flex items-center gap-2 min-w-0">
          {/* Back button on mobile */}
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-md p-1.5 hover:bg-secondary shrink-0 lg:hidden"
              aria-label="Back to conversations"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {loaded ? (
            <h3 className="truncate text-base font-semibold">{contactName}</h3>
          ) : (
            <Skeleton width={140} className="h-4" />
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onShowDetails && (
            <button
              onClick={onShowDetails}
              className="rounded-md p-2 hover:bg-secondary lg:hidden"
              aria-label="Show details"
            >
              <PanelRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <button className="rounded-md p-2 hover:bg-secondary">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="rounded-md p-2 hover:bg-secondary">
            <Moon className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="rounded-md bg-foreground p-2">
            <Archive className="h-4 w-4 text-background" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="scrollbar-thin flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        {!loaded ? (
          <div className="space-y-5">
            <div className="flex justify-center">
              <Skeleton width={90} className="h-5 rounded-full" />
            </div>
            {[60, 75, 50, 70, 55, 45, 65].map((w, i) => (
              <div key={i} className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}>
                <Skeleton className="h-12 rounded-xl" width={`${w * 3}px`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                28 August 2025
              </span>
            </div>
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-1",
                  m.sender === "out" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.sender === "in"
                      ? "bg-bubble-in text-foreground"
                      : "bg-bubble-out text-bubble-out-foreground",
                  )}
                >
                  {m.text}
                </div>
                <span className="px-2 text-[10px] text-muted-foreground">{m.time}</span>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="rounded-xl border border-border bg-panel-muted p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type something...."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-muted-foreground overflow-x-auto scrollbar-thin">
              <IconBtn>
                <ImageIcon className="h-4 w-4" />
              </IconBtn>
              <IconBtn>
                <Play className="h-4 w-4" />
              </IconBtn>
              <IconBtn>
                <MessageSquare className="h-4 w-4" />
              </IconBtn>
              <IconBtn>
                <Smile className="h-4 w-4" />
              </IconBtn>
              <IconBtn>
                <CornerDownLeft className="h-4 w-4" />
              </IconBtn>
            </div>
            <div className="flex shrink-0 items-center gap-0.5 text-muted-foreground">
              <IconBtn onClick={send}>
                <Zap className="h-4 w-4" />
              </IconBtn>
              <IconBtn>
                <Mic className="h-4 w-4" />
              </IconBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md p-1.5 hover:bg-secondary hover:text-foreground shrink-0"
    >
      {children}
    </button>
  );
}
