// =====================================================
// store/useStore.ts
// Zustand global state.
// One store for everything — simple and fast.
// =====================================================

import { create } from "zustand";
import { User, Message, SystemStatus } from "@/types";

interface AppState {
  // ── Auth ──
  user: User | null;
  setUser: (user: User | null) => void;

  // ── Chat ──
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  isTyping: boolean;
  setIsTyping: (v: boolean) => void;

  // ── Intel Panel ──
  lastSources: string[];
  setLastSources: (s: string[]) => void;
  lastLatency: number;
  setLastLatency: (ms: number) => void;
  lastChunks: number;
  setLastChunks: (n: number) => void;

  // ── System ──
  systemStatus: SystemStatus;
  setSystemStatus: (s: Partial<SystemStatus>) => void;

  // ── UI ──
  activePage: "chat" | "upload" | "dashboard";
  setActivePage: (p: "chat" | "upload" | "dashboard") => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  processingStage: string;
  setProcessingStage: (s: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // ── Auth ──
  user: null,
  setUser: (user) => set({ user }),

  // ── Chat ──
  messages: [],
  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  isTyping: false,
  setIsTyping: (v) => set({ isTyping: v }),

  // ── Intel Panel ──
  lastSources:  [],
  setLastSources:  (s) => set({ lastSources: s }),
  lastLatency:  0,
  setLastLatency:  (ms) => set({ lastLatency: ms }),
  lastChunks:   0,
  setLastChunks:   (n) => set({ lastChunks: n }),

  // ── System ──
  systemStatus: { ai: "online", db: "connected", latency: 0 },
  setSystemStatus: (s) =>
    set((prev) => ({ systemStatus: { ...prev.systemStatus, ...s } })),

  // ── UI ──
  activePage: "chat",
  setActivePage: (p) => set({ activePage: p }),
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  processingStage: "",
  setProcessingStage: (s) => set({ processingStage: s }),
}));