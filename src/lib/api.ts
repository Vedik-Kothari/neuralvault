// =====================================================
// lib/api.ts
// All API calls to FastAPI backend.
// Single file — easy to find and modify any endpoint.
// =====================================================

import {
  LoginRequest, TokenResponse, User,
  ChatRequest, ChatResponse,
  AuditLog, IngestResponse,
} from "@/types";
import { getAuthHeaders, getToken } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Generic fetch wrapper ─────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Auth ──────────────────────────────────────────────
export async function apiLogin(data: LoginRequest): Promise<TokenResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail || "Login failed");
  }
  return res.json();
}

export async function apiGetMe(): Promise<User> {
  return apiFetch<User>("/auth/me");
}

export async function apiLogout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
}

// ── Chat ──────────────────────────────────────────────
export async function apiChat(data: ChatRequest): Promise<ChatResponse> {
  return apiFetch<ChatResponse>("/rag/chat", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetHistory(limit = 20): Promise<{ history: AuditLog[] }> {
  return apiFetch(`/rag/history?limit=${limit}`);
}

// ── Documents ────────────────────────────────────────
export async function apiUploadDocument(
  file: File,
  roleAccess: string[],
  department: string,
  onProgress?: (pct: number) => void
): Promise<{ id: string; filename: string; status: string }> {
  const token = getToken();
  const form  = new FormData();

  form.append("file",        file);
  form.append("role_access", roleAccess.join(","));
  form.append("department",  department);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.detail || "Upload failed"));
        } catch {
          reject(new Error("Upload failed"));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));

    xhr.open("POST", `${BASE}/documents/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(form);
  });
}

export async function apiIngestDocument(
  documentId: string
): Promise<IngestResponse> {
  return apiFetch<IngestResponse>(`/ingest/${documentId}`, {
    method: "POST",
  });
}

export async function apiListDocuments(): Promise<{
  documents: any[];
  total: number;
}> {
  return apiFetch("/documents/");
}

// ── Health ────────────────────────────────────────────
export async function apiHealth(): Promise<{ status: string }> {
  const res = await fetch(`${BASE}/health`);
  return res.json();
}