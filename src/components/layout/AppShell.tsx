"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CommandStrip from "./CommandStrip";
import IntelPanel from "./IntelPanel";
import CursorGlow from "@/components/ui/CursorGlow";
import { useStore } from "@/store/useStore";
import { getToken, getUser } from "@/lib/auth";
import { apiHealth } from "@/lib/api";

interface Props {
  children: ReactNode;
  showIntel?: boolean;
}

export default function AppShell({ children, showIntel = true }: Props) {
  const router = useRouter();
  const { setUser, setSystemStatus } = useStore();

  useEffect(() => {
    // Auth guard
    const token = getToken();
    if (!token) { router.replace("/login"); return; }

    // Load user from localStorage
    const user = getUser();
    if (user) setUser(user);

    // Check backend health
    const checkHealth = async () => {
      try {
        await apiHealth();
        setSystemStatus({ ai: "online", db: "connected" });
      } catch {
        setSystemStatus({ ai: "offline", db: "disconnected" });
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [router, setUser, setSystemStatus]);

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      <CursorGlow />

      {/* Left: Command Strip */}
      <CommandStrip />

      {/* Center: Main content */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={typeof window !== "undefined" ? window.location.pathname : ""}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Right: Intelligence Wing */}
      {showIntel && <IntelPanel />}
    </div>
  );
}