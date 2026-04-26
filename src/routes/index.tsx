import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoadingSkeletonScreen } from "@/components/LoadingSkeletonScreen";
import { TopBar } from "@/components/boxpad/TopBar";
import { InboxSidebar } from "@/components/boxpad/InboxSidebar";
import { ConversationList, type Conversation } from "@/components/boxpad/ConversationList";
import { ChatWindow, type Message } from "@/components/boxpad/ChatWindow";
import { DetailsPanel, type Contact } from "@/components/boxpad/DetailsPanel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "BOXpad — Unified Customer Inbox" },
      {
        name: "description",
        content:
          "BOXpad: AI-powered customer support inbox with smart routing, workflows, and unified channels.",
      },
    ],
  }),
} as Parameters<typeof createFileRoute>[0]);

// ─── Static data ────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "oklch(0.7 0.15 290)",
  "oklch(0.8 0.15 80)",
  "oklch(0.7 0.18 30)",
  "oklch(0.75 0.15 20)",
  "oklch(0.7 0.18 350)",
  "oklch(0.7 0.18 60)",
  "oklch(0.7 0.15 200)",
  "oklch(0.75 0.15 130)",
  "oklch(0.7 0.18 250)",
  "oklch(0.75 0.15 60)",
];

const TIMES = [
  "23:23",
  "23:16",
  "22:28",
  "20:43",
  "17:37",
  "16:01",
  "13:44",
  "09:02",
  "Yesterday",
  "08:08",
];

const PREVIEWS = [
  "Oh my god 😍 I'll try it ASAP, thank…",
  "Good Evening, Emily! Hope you are…",
  "Thank you for signing up Frank! If t…",
  "I am sending you the report right a…",
  "Thank you for filling out our survey!",
  "I will update you soon Isabella!",
  "Hello James! Let's collaborate on…",
  "Hi Katherine, looking forward to our…",
  "Hey Lucas! Ready for the holiday…",
  "On my way!",
];

/** Olivia Mckinsey conversation thread (matches the Figma design) */
const SAMPLE_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "in",
    text: "Hi, I recently joined Fit4Life and I'm trying to access my workout plan, but I can't login. Can you help?",
    time: "23:08",
  },
  {
    id: 2,
    sender: "out",
    text: "Hello Olivia 👋 I'm Michael, your AI customer support assistant. Let's fix this quickly. Could you confirm the email address?",
    time: "23:08",
  },
  {
    id: 3,
    sender: "in",
    text: "Yes, it's olivia.Mckinsey@gmail.com",
    time: "23:16",
  },
  {
    id: 4,
    sender: "out",
    text: "Thanks! Looks like your reset wasn't completed. I've sent a new link — please check your inbox.",
    time: "23:16",
  },
  { id: 5, sender: "in", text: "I see it. resetting now…", time: "23:17" },
  { id: 6, sender: "in", text: "Done! I'm logged in. Thanks!", time: "23:20" },
  {
    id: 7,
    sender: "out",
    text: 'Perfect 🎉 Your plan is ready under "My Programs". Since you\'re starting out, I suggest our Premium Guide — it boosts results and is 20% off here 👉 www.Fit4Life.com/Premium',
    time: "23:20",
  },
  {
    id: 8,
    sender: "in",
    text: "Oh my god 😍 I'll try it ASAP, thank you so much!!",
    time: "23:23",
  },
];

// ─── Timing constants ────────────────────────────────────────────────────────

const INTRO_SCREEN_DURATION_MS = 4000;
const APP_SKELETON_DURATION_MS = 2500;

// ─── Mobile view states ──────────────────────────────────────────────────────
// On mobile we show one panel at a time:
//   "list"   → ConversationList fills the screen
//   "chat"   → ChatWindow fills the screen (sidebar hidden, details accessible via button)
type MobileView = "list" | "chat";

// ─── Main component ──────────────────────────────────────────────────────────

function Index() {
  const [showIntroScreen, setShowIntroScreen] = useState(true);
  const [showAppSkeleton, setShowAppSkeleton] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  // Mobile UI state
  const [mobileView, setMobileView] = useState<MobileView>("list");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  // ── Phase timers ─────────────────────────────────────────────────────────

  useEffect(() => {
    const introTimer = setTimeout(() => setShowIntroScreen(false), INTRO_SCREEN_DURATION_MS);
    const skeletonTimer = setTimeout(
      () => setShowAppSkeleton(false),
      INTRO_SCREEN_DURATION_MS + APP_SKELETON_DURATION_MS,
    );
    return () => {
      clearTimeout(introTimer);
      clearTimeout(skeletonTimer);
    };
  }, []);

  // ── API fetch (dummyjson.com/users) ──────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://dummyjson.com/users?limit=10");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        const convs: Conversation[] = data.users.map(
          (u: { id: number; firstName: string; lastName: string }, i: number) => ({
            id: u.id,
            // First contact is always Olivia to match the Figma design
            name: i === 0 ? "Olivia Mckinsey" : `${u.firstName} ${u.lastName}`,
            preview: PREVIEWS[i] ?? "Hello there!",
            time: TIMES[i] ?? "—",
            avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
          }),
        );

        setTimeout(() => {
          if (cancelled) return;
          setConversations(convs);
          setActiveId(convs[0].id);
          // Contact details for Olivia (first conversation)
          setContact({
            firstName: "Olivia",
            lastName: "Mckinsey",
            phone: "+1 (312) 555-0134",
            email: "olivia.Mckinsey@gmail.com",
          });
          setDataReady(true);
        }, 250);
      } catch (err) {
        if (cancelled) return;
        console.error("API fetch failed, using fallback data:", err);
        setFetchError("Could not load contacts. Using cached data.");

        // Graceful fallback — app still works
        const convs: Conversation[] = PREVIEWS.map((p, i) => ({
          id: i + 1,
          name: i === 0 ? "Olivia Mckinsey" : `Contact ${i + 1}`,
          preview: p,
          time: TIMES[i],
          avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
        }));
        setConversations(convs);
        setActiveId(convs[0].id);
        setContact({
          firstName: "Olivia",
          lastName: "Mckinsey",
          phone: "+1 (312) 555-0134",
          email: "olivia.Mckinsey@gmail.com",
        });
        setDataReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Derived state ─────────────────────────────────────────────────────────

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;
  const showLoadedApp = dataReady && !showIntroScreen && !showAppSkeleton;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectConversation = (id: number) => {
    setActiveId(id);
    const selectedUser = conversations.find((c) => c.id === id);
    if (selectedUser) {
      // In a real app, we'd fetch specific contact details by ID
      // Here we map the conversation data back to the Contact format
      setContact({
        firstName: selectedUser.name.split(" ")[0],
        lastName: selectedUser.name.split(" ").slice(1).join(" ") || "—",
        phone: "+1 (312) 555-0134", // Placeholder as dummyjson doesn't provide consistent phones in simple fetch
        email: `${selectedUser.name.toLowerCase().replace(" ", ".")}@example.com`,
      });
    }
    // On mobile, jump to chat view after selecting
    setMobileView("chat");
  };

  // ── Shared dashboard layout helper ────────────────────────────────────────

  const renderDashboard = (loaded: boolean, convs: Conversation[], selId: number | null) => (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <TopBar
        onOpenSidebar={() => setMobileSidebarOpen(true)}
        onOpenDetails={() => setMobileDetailsOpen(true)}
      />

      {/* Error toast if API fallback was used */}
      {fetchError && showLoadedApp && (
        <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-700 flex items-center justify-between">
          <span>⚠️ {fetchError}</span>
          <button
            onClick={() => setFetchError(null)}
            className="ml-4 font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar: hidden on mobile, overlay drawer; visible sm+ */}
        <InboxSidebar
          loaded={loaded}
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/*
         * Responsive content area:
         * - Mobile:  show ConversationList OR ChatWindow (one at a time)
         * - sm+:     ConversationList + ChatWindow side by side
         * - lg+:     + DetailsPanel on the right
         */}

        {/* Conversation List */}
        <div
          className={cn(
            "flex-1 min-w-0 overflow-hidden sm:flex-none sm:w-[280px] lg:w-[320px] border-r border-border bg-panel transition-all",
            mobileView === "list" ? "flex" : "hidden sm:flex",
          )}
        >
          <ConversationList
            loaded={loaded}
            conversations={convs}
            activeId={selId}
            onSelect={handleSelectConversation}
            onShowSidebar={() => setMobileSidebarOpen(true)}
          />
        </div>

        {/* Chat Window */}
        <div
          className={cn(
            "flex-1 min-w-0 overflow-hidden bg-panel transition-all",
            mobileView === "chat" ? "flex" : "hidden sm:flex",
          )}
        >
          <div className="flex h-full w-full flex-col">
            <ChatWindow
              loaded={loaded}
              contactName={activeConv?.name ?? "Olivia Mckinsey"}
              messages={loaded ? SAMPLE_MESSAGES : []}
              onBack={() => setMobileView("list")}
              onShowDetails={() => setMobileDetailsOpen(true)}
            />
          </div>
        </div>

        {/* DetailsPanel: always hidden on mobile unless drawer, visible lg+ */}
        <DetailsPanel
          loaded={loaded}
          contact={contact}
          open={mobileDetailsOpen}
          onClose={() => setMobileDetailsOpen(false)}
        />
      </div>
    </div>
  );

  // ── Intro screen phase ────────────────────────────────────────────────────

  if (showIntroScreen) {
    return <LoadingSkeletonScreen preview={renderDashboard(false, [], null)} />;
  }

  // ── Skeleton phase ────────────────────────────────────────────────────────

  if (!showLoadedApp) {
    return <div className="min-h-screen overflow-hidden">{renderDashboard(false, [], null)}</div>;
  }

  // ── Loaded dashboard ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen overflow-hidden">{renderDashboard(true, conversations, activeId)}</div>
  );
}
