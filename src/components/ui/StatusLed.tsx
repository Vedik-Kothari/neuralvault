"use client";

interface Props {
  status: "online" | "processing" | "offline" | "connected" | "disconnected";
  label: string;
}

const colors = {
  online:       "bg-green-400",
  processing:   "bg-amber-400",
  offline:      "bg-red-500",
  connected:    "bg-green-400",
  disconnected: "bg-red-500",
};

const glows = {
  online:       "shadow-[0_0_8px_#10b981]",
  processing:   "shadow-[0_0_8px_#f59e0b] animate-led-blink",
  offline:      "shadow-[0_0_8px_#ef4444]",
  connected:    "shadow-[0_0_8px_#10b981]",
  disconnected: "shadow-[0_0_8px_#ef4444]",
};

export default function StatusLed({ status, label }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0
          ${colors[status]} ${glows[status]}`}
      />
      <span className="text-xs font-mono text-muted">{label}</span>
      <span
        className="text-xs font-mono ml-auto"
        style={{ color: status === "online" || status === "connected"
          ? "#10b981" : status === "processing"
          ? "#f59e0b" : "#ef4444" }}
      >
        {status.toUpperCase()}
      </span>
    </div>
  );
}