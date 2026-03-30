"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { apiLogin, apiGetMe } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";
import { useStore } from "@/store/useStore";
import CursorGlow from "@/components/ui/CursorGlow";

const TEST_ACCOUNTS = [
  { email: "admin@test.com",    role: "admin",    color: "#7c3aed" },
  { email: "manager@test.com",  role: "manager",  color: "#0ea5e9" },
  { email: "employee@test.com", role: "employee", color: "#10b981" },
  { email: "intern@test.com",   role: "intern",   color: "#06b6d4" },
];

export default function LoginPage() {
  const router   = useRouter();
  const setUser  = useStore((s) => s.setUser);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await apiLogin({ email: email.trim(), password });
      saveToken(token.access_token);
      const user = await apiGetMe();
      saveUser(user);
      setUser(user);
      router.replace("/chat");
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const fillAccount = (acc: { email: string }) => {
    setEmail(acc.email);
    setPassword("Test1234!");
    setError("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full relative overflow-hidden py-10">
      <CursorGlow />

      {/* Background orbs (pure CSS animated) */}
      {[
        { color: "#7c3aed", x: "10%",  y: "20%", size: 500, delay: "0s" },
        { color: "#0ea5e9", x: "80%",  y: "70%", size: 400, delay: "2s" },
        { color: "#f472b6", x: "50%",  y: "10%", size: 300, delay: "4s" },
      ].map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none animate-float"
          style={{
            width: orb.size, height: orb.size,
            left: orb.x, top: orb.y,
            background: orb.color,
            filter: "blur(120px)",
            opacity: 0.1,
            animationDelay: orb.delay,
            animationDuration: "12s"
          }}
        />
      ))}

      {/* Login card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 transition-all duration-500 transform translate-y-0 opacity-100"
        style={{ animation: "counter-up 0.5s ease-out forwards" }}
      >
        <div
          className="glass-strong rounded-3xl p-10"
          style={{ boxShadow: "0 0 100px rgba(124,58,237,0.15), 0 0 40px rgba(0,0,0,0.5)" }}
        >
          {/* Brand */}
          <div className="text-center mb-10">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl animate-glow-pulse"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
                boxShadow: "0 0 50px #7c3aed66",
              }}
            >
              ⚡
            </div>
            <h1 className="font-head text-2xl font-bold tracking-widest text-white mb-2">
              NEURALVAULT
            </h1>
            <p className="text-sm text-muted">
              Enterprise Knowledge, Secured by AI
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-muted mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-muted outline-none transition-all duration-200 font-ui"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(124,58,237,0.6)";
                  e.target.style.boxShadow = "0 0 20px rgba(124,58,237,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-muted mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-muted outline-none transition-all duration-200 font-ui"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(124,58,237,0.6)";
                  e.target.style.boxShadow = "0 0 20px rgba(124,58,237,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                style={{ animation: "counter-up 0.3s ease-out forwards" }}
              >
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
                boxShadow: "0 0 40px rgba(124,58,237,0.4)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign in to NeuralVault →"
              )}
            </button>
          </form>

          {/* Test accounts */}
          <div className="mt-6">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted text-center mb-3">
              Quick Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TEST_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillAccount(acc)}
                  className="p-2 rounded-lg text-left transition-all hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: acc.color + "10",
                    border: `1px solid ${acc.color}33`,
                  }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: acc.color }}>
                    {acc.role}
                  </div>
                  <div className="text-[10px] text-muted truncate mt-0.5">
                    {acc.email}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}