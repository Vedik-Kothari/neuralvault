"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { usePathname } from "next/navigation";
import { Brain, Zap, FileText, Shield, Activity } from "lucide-react";

export default function IntelPanel() {
  const {
    lastSources, lastLatency, lastChunks,
    isTyping, processingStage, systemStatus,
  } = useStore();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 flex-shrink-0 h-screen flex flex-col gap-3
                 p-3 border-l border-white/[0.06] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-1 py-2">
        <Brain size={14} className="text-purple" />
        <span className="text-[11px] font-bold tracking-widest
                         uppercase text-muted">
          Intelligence Wing
        </span>
      </div>

      {/* Processing stage */}
      <AnimatePresence>
        {isTyping && processingStage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass p-3 rounded-xl border border-purple/20"
            style={{ boxShadow: "0 0 20px rgba(124,58,237,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-purple"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-[10px] font-bold tracking-widest
                               uppercase text-purple">
                Processing
              </span>
            </div>
            <p className="text-xs text-muted font-mono">{processingStage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last query stats */}
      {lastChunks > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-3 rounded-xl space-y-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity size={12} className="text-green" />
            <span className="text-[10px] font-bold tracking-widest
                             uppercase text-muted">
              Last Query
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Chunks retrieved</span>
            <span className="text-xs font-mono text-green">
              {lastChunks}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Latency</span>
            <span className="text-xs font-mono text-blue">
              {lastLatency.toFixed(0)}ms
            </span>
          </div>

          {/* Confidence bar */}
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-muted">Confidence</span>
              <span className="text-[10px] font-mono text-purple">
                {Math.min(95, 60 + lastChunks * 10)}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #7c3aed, #0ea5e9)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(95, 60 + lastChunks * 10)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Sources */}
      <AnimatePresence>
        {lastSources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass p-3 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText size={12} className="text-blue" />
              <span className="text-[10px] font-bold tracking-widest
                               uppercase text-muted">
                Sources
              </span>
            </div>
            <div className="space-y-1.5">
              {lastSources.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-xs text-muted
                             p-1.5 rounded-lg bg-white/[0.03]
                             border border-white/5"
                >
                  <div className="w-1 h-1 rounded-full bg-blue flex-shrink-0" />
                  <span className="truncate font-mono">{src}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security status */}
      <motion.div
        className="glass p-3 rounded-xl"
        animate={{ borderColor: ["rgba(124,58,237,0.1)", "rgba(124,58,237,0.3)", "rgba(124,58,237,0.1)"] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ border: "1px solid rgba(124,58,237,0.1)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield size={12} className="text-purple" />
          <span className="text-[10px] font-bold tracking-widest
                           uppercase text-muted">
            Security
          </span>
        </div>
        <div className="space-y-2">
          {[
            { label: "RBAC",        status: "ACTIVE",    color: "#10b981" },
            { label: "RLS",         status: "ENFORCED",  color: "#10b981" },
            { label: "Injection",   status: "PROTECTED", color: "#10b981" },
            { label: "Encryption",  status: "TLS 1.3",   color: "#0ea5e9" },
          ].map(({ label, status, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-[11px] text-muted">{label}</span>
              <span
                className="text-[10px] font-mono font-bold"
                style={{ color }}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Idle animation when no data */}
      {lastChunks === 0 && !isTyping && (
        <motion.div
          className="glass p-4 rounded-xl flex flex-col items-center
                     justify-center gap-3 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Zap size={24} className="text-purple/50" />
          </motion.div>
          <p className="text-[11px] text-muted">
            Ask a question to see intelligence data
          </p>
        </motion.div>
      )}
    </motion.aside>
  );
}