"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (getToken()) {
      router.replace("/chat");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-purple"
            style={{
              animation: `typing-dot 1.2s ease infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}