"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Copy, Check, Lock, AlertTriangle } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useStore } from "@/store/useStore";
import { apiChat } from "@/lib/api";
import { Message } from "@/types";
import { clsx } from "clsx";

const STAGES = [
  "Analyzing query...",
  "Applying security filters...",
  "Retrieving authorized documents...",
  "Generating response...",
];

const SUGGESTIONS = [
  "What is the bonus policy for senior engineers?",
  "How many WFH days do employees get?",
  "What is the annual learning budget?",
  "Explain the performance review process.",
];

function TypingIndicator({ stage }: { stage: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3 mb-6"
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center
                      text-sm flex-shrink-0"
           style={{ background: "linear-gradient(135deg,#7c3aed,#0ea5e9)",
                    boxShadow: "0 0 15px #7c3aed44" }}>
        ⚡
      </div>
      <div className="glass p-4 rounded-2xl rounded-tl-sm max-w-sm"
           style={{ boxShadow: "0 0 20px rgba(124,58,237,0.1)" }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-purple"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i*0.15 }}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-muted">{stage}</span>
        </div>
      </div>
    </motion.div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (msg.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end mb-6"
      >
        <div className="bubble-user px-4 py-3 max-w-[70%]">
          <p className="text-sm leading-relaxed">{msg.content}</p>
        </div>
      </motion.div>
    );
  }

  const denied   = msg.access_granted === false;
  const injected = msg.injection_detected === true;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 mb-6 group"
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center
                      text-sm flex-shrink-0 mt-1"
           style={{ background: "linear-gradient(135deg,#7c3aed,#0ea5e9)",
                    boxShadow: "0 0 15px #7c3aed44" }}>
        ⚡
      </div>
      <div className="flex-1 max-w-[85%]">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <span className="text-xs font-semibold text-white">NeuralVault</span>
          {injected ? (
            <span className="flex items-center gap-1 text-[10px] text-red-400">
              <AlertTriangle size={10} /> Injection blocked
            </span>
          ) : denied ? (
            <span className="flex items-center gap-1 text-[10px] text-red-400">
              <Lock size={10} /> Access restricted
            </span>
          ) : (
            <span className="text-[10px] text-green">
              ✓ {msg.chunks_count} chunks · {msg.latency_ms?.toFixed(0)}ms
            </span>
          )}
        </div>

        {/* Bubble */}
        <div className={clsx(
          "relative px-5 py-4 rounded-2xl rounded-tl-sm",
          injected || denied ? "bubble-denied" : "bubble-ai"
        )}>
          {/* Copy button */}
          <button
            onClick={copy}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100
                       transition-opacity p-1.5 rounded-lg bg-white/5
                       hover:bg-white/10 text-muted hover:text-white"
          >
            {copied
              ? <Check size={12} className="text-green" />
              : <Copy  size={12} />}
          </button>

          <p className="text-sm leading-relaxed text-white/90 pr-6">
            {msg.content}
          </p>

          {/* Sources */}
          {msg.sources && msg.sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3
                            border-t border-white/5">
              {msg.sources.map((src, i) => (
                <span key={i}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md"
                  style={{
                    background: "rgba(14,165,233,0.1)",
                    border: "1px solid rgba(14,165,233,0.2)",
                    color: "#0ea5e9",
                  }}>
                  📄 {src}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ChatPage() {
  const {
    messages, addMessage, isTyping,
    setIsTyping, setProcessingStage,
    setLastSources, setLastLatency, setLastChunks,
  } = useStore();

  const [input,  setInput]  = useState("");
  const [stage,  setStage]  = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const query = input.trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    addMessage(userMsg);
    setInput("");
    setIsTyping(true);

    // Cycle through stages
    for (let i = 0; i < STAGES.length; i++) {
      setStage(STAGES[i]);
      setProcessingStage(STAGES[i]);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const data = await apiChat({ query, max_chunks: 5 });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        access_granted:     data.access_granted,
        injection_detected: data.injection_detected,
        chunks_count:       data.chunks_count,
        sources:            data.sources,
        latency_ms:         data.latency_ms,
      };

      addMessage(aiMsg);
      setLastSources(data.sources || []);
      setLastLatency(data.latency_ms || 0);
      setLastChunks(data.chunks_count || 0);

    } catch (err: any) {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${err.message}`,
        timestamp: new Date(),
        access_granted: false,
      });
    } finally {
      setIsTyping(false);
      setStage("");
      setProcessingStage("");
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center
                           h-full gap-6 text-center"
              >
                <motion.div
                  animate={{ scale: [1,1.05,1], opacity:[0.7,1,0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl"
                >
                  ⚡
                </motion.div>
                <div>
                  <h2 className="font-head text-xl font-bold tracking-wide
                                 text-white mb-2">
                    KNOWLEDGE NEXUS
                  </h2>
                  <p className="text-sm text-muted max-w-md">
                    Query your authorized knowledge base.
                    Role-based access enforced on every request.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => { setInput(s); textRef.current?.focus(); }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="text-xs px-3 py-2 rounded-xl text-muted
                                 hover:text-white transition-colors"
                      style={{
                        background: "rgba(124,58,237,0.08)",
                        border: "1px solid rgba(124,58,237,0.2)",
                      }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          <AnimatePresence>
            {isTyping && <TypingIndicator stage={stage} />}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input dock */}
        <div className="px-6 pb-6 pt-2">
          <motion.div
            className="flex items-end gap-3 rounded-2xl p-3"
            style={{
              background: "rgba(13,18,32,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 40px rgba(0,0,0,0.4)",
            }}
            animate={isTyping ? {
              borderColor: ["rgba(124,58,237,0.2)", "rgba(124,58,237,0.6)", "rgba(124,58,237,0.2)"],
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <textarea
              ref={textRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKey}
              placeholder="Ask anything from your knowledge base..."
              rows={1}
              disabled={isTyping}
              className="flex-1 bg-transparent outline-none text-sm
                         text-white placeholder-muted resize-none
                         py-1 font-ui"
              style={{ maxHeight: 120 }}
            />
            <motion.button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl flex items-center
           justify-center flex-shrink-0
           disabled:opacity-40 transition-all"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#0ea5e9)",
                boxShadow: "0 0 20px rgba(124,58,237,0.4)",
              }}
            >
              <Send size={16} className="text-white" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}