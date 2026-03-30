"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
  MessageSquare, Upload, LayoutDashboard,
  LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { clearAuth } from "@/lib/auth";
import StatusLed from "@/components/ui/StatusLed";
import { clsx } from "clsx";

const ROLE_GLOW = {
  admin:    { color: "#7c3aed", border: "border-purple/40",  bg: "bg-purple/10"  },
  manager:  { color: "#0ea5e9", border: "border-blue/40",    bg: "bg-blue/10"    },
  employee: { color: "#10b981", border: "border-green/40",   bg: "bg-green/10"   },
  intern:   { color: "#06b6d4", border: "border-cyan/40",    bg: "bg-cyan/10"    },
} as const;

type Role = keyof typeof ROLE_GLOW;

const NAV = [
  { href: "/chat",      icon: MessageSquare,   label: "Chat",      id: "chat"      },
  { href: "/upload",    icon: Upload,          label: "Upload",    id: "upload"    },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
];

export default function CommandStrip() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, systemStatus, sidebarCollapsed, toggleSidebar } = useStore();

  const role: Role =
  user?.role && user.role in ROLE_GLOW
    ? (user.role as Role)
    : "intern";
  const roleStyle = ROLE_GLOW[role];
  const avatar    = user?.email?.[0]?.toUpperCase() ?? "U";

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  // Heartbeat bars
  const bars = Array.from({ length: 12 }, (_, i) => i);

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 220 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={clsx(
        "relative flex flex-col h-screen flex-shrink-0 z-40",
        "glass-strong border-r",
        roleStyle.border,
      )}
      style={{
        boxShadow: `inset -1px 0 0 ${roleStyle.color}22,
                    0 0 40px ${roleStyle.color}11`,
      }}
    >
      {/* Role glow line */}
      <div
        className="absolute top-0 right-0 w-px h-full pointer-events-none"
        style={{
          background: `linear-gradient(to bottom,
            transparent, ${roleStyle.color}66, transparent)`,
        }}
      />

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-50 w-6 h-6 rounded-full
           glass border border-white/10 flex items-center
           justify-center text-muted hover:text-white
           transition-colors"
      >
        {sidebarCollapsed
          ? <ChevronRight size={12} />
          : <ChevronLeft  size={12} />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 p-4 pb-0 h-16 flex-shrink-0">
        <motion.div
          className="w-9 h-9 rounded-xl flex items-center justify-center
                     text-lg flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, #7c3aed, #0ea5e9)`,
            boxShadow:  `0 0 20px #7c3aed55`,
          }}
          animate={{ boxShadow: ["0 0 20px #7c3aed55", "0 0 35px #7c3aed88", "0 0 20px #7c3aed55"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚡
        </motion.div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-head text-sm font-bold tracking-widest
                         text-white whitespace-nowrap"
            >
              NEURALVAULT
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* User card */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={clsx(
              "mx-3 mt-4 p-3 rounded-xl border",
              roleStyle.border, roleStyle.bg
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center
                           text-xs font-bold text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${roleStyle.color}, #0ea5e9)` }}
              >
                {avatar}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold tracking-widest uppercase
                           px-2 py-0.5 rounded-full border"
                style={{
                  color: roleStyle.color,
                  borderColor: roleStyle.color + "44",
                  background: roleStyle.color + "15",
                }}
              >
                ◆ {role}
              </span>
              <span className="text-[10px] text-muted truncate">
                {user?.department}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav label */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] font-bold tracking-widest uppercase
                       text-muted px-4 mt-5 mb-2"
          >
            Navigation
          </motion.p>
        )}
      </AnimatePresence>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-2 mt-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href ||
            (href === "/chat" && pathname === "/");
          return (
            <motion.button
              key={href}
              onClick={() => router.push(href)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "border transition-all duration-200 text-left w-full",
                active
                  ? "border-purple/40 text-white"
                  : "border-transparent text-muted hover:text-white hover:bg-white/5"
              )}
              style={active ? {
                background: `linear-gradient(135deg, #7c3aed22, #0ea5e918)`,
                boxShadow: `0 0 20px #7c3aed18`,
              } : {}}
            >
              <Icon size={16} className="flex-shrink-0" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute right-0 w-0.5 h-6 rounded-l"
                  style={{
                    background: `linear-gradient(to bottom, #7c3aed, #0ea5e9)`,
                    boxShadow: `0 0 8px #7c3aed`,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* System status */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-3 p-3 rounded-xl border border-white/5
                       bg-white/[0.02] space-y-2"
          >
            <p className="text-[10px] font-bold tracking-widest
                          uppercase text-muted mb-2">
              System
            </p>
            <StatusLed status={systemStatus.ai} label="AI Engine" />
            <StatusLed status={systemStatus.db} label="Database" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neural heartbeat */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-3 p-3 rounded-xl border border-white/5
                       bg-white/[0.02]"
          >
            <p className="text-[10px] font-bold tracking-widest
                          uppercase text-muted mb-2">
              Neural Heartbeat
            </p>
            <div className="flex items-end gap-0.5 h-6">
              {bars.map((i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ background: roleStyle.color + "88" }}
                  animate={{ scaleY: [0.2, Math.random() * 0.8 + 0.2, 0.2] }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay: i * 0.06,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout */}
      <div className="p-2 mb-2">
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                     border border-transparent w-full text-red-400
                     hover:bg-red-500/10 hover:border-red-500/20
                     transition-all duration-200"
        >
          <LogOut size={16} className="flex-shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}