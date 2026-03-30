"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, XCircle, FileText, Loader2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { apiUploadDocument, apiIngestDocument } from "@/lib/api";
import { clsx } from "clsx";

const ROLES = ["intern","employee","manager","admin"] as const;

export default function UploadPage() {
  const [dragging,    setDragging]    = useState(false);
  const [file,        setFile]        = useState<File | null>(null);
  const [roles,       setRoles]       = useState<string[]>(["employee","manager","admin"]);
  const [department,  setDepartment]  = useState("engineering");
  const [progress,    setProgress]    = useState(0);
  const [status,      setStatus]      = useState<"idle"|"uploading"|"ingesting"|"done"|"error">("idle");
  const [result,      setResult]      = useState<any>(null);
  const [error,       setError]       = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const toggleRole = (r: string) => {
    setRoles(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  const handleUpload = async () => {
    if (!file || roles.length === 0) return;
    setStatus("uploading");
    setError("");
    setProgress(0);

    try {
      const doc = await apiUploadDocument(
        file, roles, department,
        (pct) => setProgress(pct)
      );
      setProgress(100);
      setStatus("ingesting");

      const ingest = await apiIngestDocument(doc.id);
      setResult(ingest);
      setStatus("done");
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setResult(null);
    setError("");
  };

  return (
    <AppShell showIntel={false}>
      <div className="h-full overflow-y-auto px-8 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-head text-2xl font-bold tracking-widest
                           text-white mb-2">
              INGESTION CANVAS
            </h1>
            <p className="text-sm text-muted">
              Upload documents into the secure knowledge vault
            </p>
          </motion.div>

          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
            className={clsx(
              "relative rounded-2xl border-2 border-dashed p-12",
              "flex flex-col items-center justify-center gap-4",
              "cursor-pointer transition-all duration-300",
              dragging
                ? "border-purple/80 bg-purple/10 scale-[1.01]"
                : file
                ? "border-green/40 bg-green/5"
                : "border-white/10 hover:border-purple/40 hover:bg-purple/5"
            )}
            style={dragging ? {
              boxShadow: "0 0 60px rgba(124,58,237,0.2)",
            } : {}}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />

            <motion.div
              animate={dragging ? { scale: 1.2 } : { scale: 1 }}
            >
              {file
                ? <FileText size={48} className="text-green" />
                : <Upload  size={48} className="text-muted" />}
            </motion.div>

            {file ? (
              <div className="text-center">
                <p className="text-sm font-semibold text-white">
                  {file.name}
                </p>
                <p className="text-xs text-muted mt-1">
                  {(file.size / 1024).toFixed(1)} KB ·{" "}
                  {file.type || "text/plain"}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-white font-medium">
                  Drop your document here
                </p>
                <p className="text-xs text-muted mt-1">
                  PDF · DOCX · TXT — max 10MB
                </p>
              </div>
            )}
          </motion.div>

          {/* Config */}
          <AnimatePresence>
            {file && status === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 space-y-5"
              >
                {/* Role access */}
                <div>
                  <label className="block text-[11px] font-bold tracking-widest
                                    uppercase text-muted mb-3">
                    Access Roles
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {ROLES.map(r => {
                      const colors: Record<string,string> = {
                        intern: "#06b6d4", employee: "#10b981",
                        manager: "#0ea5e9", admin: "#7c3aed",
                      };
                      const active = roles.includes(r);
                      return (
                        <motion.button
                          key={r}
                          onClick={() => toggleRole(r)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-xl text-xs font-bold
                                     uppercase tracking-widest transition-all"
                          style={{
                            background: active ? colors[r] + "22" : "transparent",
                            border: `1px solid ${active ? colors[r] + "66" : "rgba(255,255,255,0.1)"}`,
                            color: active ? colors[r] : "#8b949e",
                            boxShadow: active ? `0 0 15px ${colors[r]}22` : "none",
                          }}
                        >
                          {r}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-[11px] font-bold tracking-widest
                                    uppercase text-muted mb-2">
                    Department
                  </label>
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. engineering"
                    className="w-full px-4 py-2.5 rounded-xl text-sm
                               text-white placeholder-muted outline-none
                               transition-all font-ui"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(124,58,237,0.5)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  />
                </div>

                {/* Upload button */}
                <motion.button
                  onClick={handleUpload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold
                             text-white flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#0ea5e9)",
                    boxShadow: "0 0 40px rgba(124,58,237,0.3)",
                  }}
                >
                  <Upload size={16} />
                  Upload & Process Document
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress */}
          <AnimatePresence>
            {(status === "uploading" || status === "ingesting") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 glass p-6 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 size={18} className="text-purple animate-spin" />
                  <span className="text-sm font-medium text-white">
                    {status === "uploading"
                      ? "Uploading to vault..."
                      : "Processing & embedding..."}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg,#7c3aed,#0ea5e9)",
                    }}
                    animate={{ width: status === "ingesting" ? "90%" : `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-muted mt-2 text-right">
                  {status === "ingesting" ? "Generating embeddings..." : `${progress}%`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success */}
          <AnimatePresence>
            {status === "done" && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 rounded-2xl"
                style={{
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  boxShadow: "0 0 30px rgba(16,185,129,0.1)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle size={20} className="text-green" />
                  <span className="text-sm font-semibold text-green">
                    Document processed successfully
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-muted text-xs mb-1">Chunks created</p>
                    <p className="text-white font-mono font-bold text-lg">
                      {result.chunks_created}
                    </p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-muted text-xs mb-1">Duration</p>
                    <p className="text-white font-mono font-bold text-lg">
                      {result.duration_seconds?.toFixed(1)}s
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="mt-4 text-xs text-muted hover:text-white
                             transition-colors underline underline-offset-2"
                >
                  Upload another document
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 rounded-2xl flex items-center gap-3"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <XCircle size={18} className="text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-400">{error}</p>
                  <button
                    onClick={reset}
                    className="text-xs text-muted hover:text-white mt-1
                               transition-colors underline"
                  >
                    Try again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </AppShell>
  );
}