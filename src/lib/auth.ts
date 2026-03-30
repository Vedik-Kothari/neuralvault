// =====================================================
// lib/auth.ts
// Token storage and auth helpers.
// Uses localStorage — persists across page refreshes.
// =====================================================

import { User } from "@/types";

const TOKEN_KEY = "neuralvault_token";
const USER_KEY  = "neuralvault_user";

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(TOKEN_KEY);

  if (!token || token === "undefined" || token === "null") {
    return null;
  }

  return token;
}

export function saveUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      try { return JSON.parse(raw); }
      catch { return null; }
    }
  }
  return null;
}

export function clearAuth(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type":  "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
}