// =====================================================
// types/index.ts
// All TypeScript interfaces for the entire app.
// Define shapes once — use everywhere.
// =====================================================

export type Role = "intern" | "employee" | "manager" | "admin";

export interface User {
  id: string;
  email: string;
  role: Role;
  department: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ChatRequest {
  query: string;
  max_chunks?: number;
}

export interface ChatResponse {
  answer: string;
  access_granted: boolean;
  chunks_count: number;
  injection_detected: boolean;
  latency_ms: number;
  sources: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  access_granted?: boolean;
  injection_detected?: boolean;
  chunks_count?: number;
  sources?: string[];
  latency_ms?: number;
}

export interface Document {
  id: string;
  filename: string;
  file_type: string;
  role_access: Role[];
  department: string;
  status: "pending" | "processing" | "completed" | "failed";
  chunk_count: number;
  created_at: string;
}

export interface AuditLog {
  id?: string;
  query: string;
  user_role: Role;
  user_department: string;
  access_granted: boolean;
  chunks_retrieved: number;
  injection_detected: boolean;
  latency_ms: number;
  created_at: string;
}

export interface IngestResponse {
  document_id: string;
  filename: string;
  chunks_created: number;
  success: boolean;
  error: string | null;
  duration_seconds: number;
}

export interface SystemStatus {
  ai: "online" | "processing" | "offline";
  db: "connected" | "disconnected";
  latency: number;
}