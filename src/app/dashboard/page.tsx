"use client";
import { RefreshCw } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart2, Shield, Lock,
  AlertTriangle, CheckCircle,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useStore } from "@/store/useStore";
import { apiGetHistory } from "@/lib/api";
import { AuditLog } from "@/types";
import GlowCard from "@/components/ui/GlowCard";

function KpiCard({
  icon: Icon, label, value, color, delay,
}: {
  icon: any; label: string; value: number | string;
  color: string; delay: number;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (typeof value !== "number") return;
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplayed(value); clearInterval(timer); }
      else setDisplayed(start);
    }, 40);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <GlowCard
        glowColor={color + "33"}
        className="p-5 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-5"
          style={{ background: color }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <Icon size={18} style={{ color }} />
            <div
              className="w-2 h-2 rounded-full animate-led-blink"
              style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            />
          </div>
          <div
            className="text-3xl font-head font-bold mb-1"
            style={{ color }}
          >
            {typeof value === "number" ? displayed : value}
          </div>
          <div className="text-xs font-bold tracking-widest uppercase text-muted">
            {label}
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

export default function DashboardPage() {
  const user = useStore(s => s.user);
  const [logs,    setLogs]    = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch function (reusable) ──
  const fetchLogs = useCallback(() => {
    setLoading(true);
    apiGetHistory(50)
      .then(d => setLogs(d.history || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Initial load + auto-refresh every 30s ──
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  if (user?.role !== "admin") {
    return (
      <AppShell showIntel={false}>
        <div className="flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-10 rounded-3xl max-w-sm"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
              boxShadow: "0 0 60px rgba(239,68,68,0.1)",
            }}
          >
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="font-head text-xl font-bold text-red-400 mb-2">
              ACCESS DENIED
            </h2>
            <p className="text-sm text-muted">
              Dashboard requires admin role.
              <br />
              Your role:{" "}
              <span className="text-white font-semibold">{user?.role}</span>
            </p>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  const total      = logs.length;
  const granted    = logs.filter(l => l.access_granted).length;
  const denied     = total - granted;
  const injections = logs.filter(l => l.injection_detected).length;

  return (
    <AppShell showIntel={false}>
      <div className="h-full overflow-y-auto px-8 py-8">

        {/* ── Header with refresh button ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="font-head text-2xl font-bold tracking-widest
                           text-white mb-2">
              SYSTEM INTELLIGENCE
            </h1>
            <p className="text-sm text-muted">
              Real-time audit logs and security metrics
            </p>
          </div>

          {/* Refresh button */}
          <motion.button
            onClick={fetchLogs}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       text-sm font-medium transition-all disabled:opacity-50"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.3)",
              color: "#a78bfa",
            }}
          >
            <motion.div
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={loading
                ? { duration: 1, repeat: Infinity, ease: "linear" }
                : { duration: 0.3 }}
            >
              <RefreshCw size={14} />
            </motion.div>
            {loading ? "Refreshing..." : "Refresh"}
          </motion.button>
        </motion.div>

        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <KpiCard icon={BarChart2}     label="Total Queries"      value={total}      color="#0ea5e9" delay={0}   />
          <KpiCard icon={CheckCircle}   label="Access Granted"     value={granted}    color="#10b981" delay={0.1} />
          <KpiCard icon={Lock}          label="Access Denied"      value={denied}     color="#f59e0b" delay={0.2} />
          <KpiCard icon={AlertTriangle} label="Injections Blocked" value={injections} color="#ef4444" delay={0.3} />
        </div>

        {/* ── Audit table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-5
                          border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-purple" />
              <span className="text-sm font-semibold text-white">
                Audit Log
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">
                Auto-refreshes every 30s
              </span>
              <span className="text-xs text-muted">
                Last {Math.min(50, total)} of {total} queries
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="skeleton h-10 rounded-xl" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-muted text-sm">
              No queries yet. Start chatting to see audit logs here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    {["Time","Query","Role","Status","Latency"].map(h => (
                      <th key={h}
                          className="px-5 py-3 text-left text-[10px]
                                     font-bold tracking-widest uppercase
                                     text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-white/[0.03]
                                 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3 text-xs font-mono text-muted
                                     whitespace-nowrap">
                        {log.created_at?.slice(0,16).replace("T"," ")}
                      </td>
                      <td className="px-5 py-3 text-xs text-white/80
                                     max-w-[200px] truncate">
                        {log.query?.slice(0,50)}
                        {(log.query?.length || 0) > 50 ? "..." : ""}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[10px] font-bold uppercase
                                         px-2 py-0.5 rounded-md"
                              style={{
                                background: "rgba(124,58,237,0.12)",
                                border: "1px solid rgba(124,58,237,0.25)",
                                color: "#a78bfa",
                              }}>
                          {log.user_role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {log.injection_detected ? (
                          <span className="flex items-center gap-1
                                           text-[11px] text-red-400">
                            <AlertTriangle size={10} /> Blocked
                          </span>
                        ) : log.access_granted ? (
                          <span className="flex items-center gap-1
                                           text-[11px] text-green">
                            <CheckCircle size={10} /> Granted
                          </span>
                        ) : (
                          <span className="flex items-center gap-1
                                           text-[11px] text-amber">
                            <Lock size={10} /> Denied
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs font-mono text-muted">
                        {(log.latency_ms || 0).toFixed(0)}ms
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}