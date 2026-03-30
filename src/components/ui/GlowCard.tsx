"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { clsx } from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

export default function GlowCard({
  children,
  className,
  glowColor = "rgba(124,58,237,0.4)",
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={clsx("glass cursor-default", className)}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Glow overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          opacity: 0,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
}