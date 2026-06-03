import { motion } from "motion/react";
import logoAsset from "@/assets/jas-logo.png.asset.json";

export const LOGO_URL = logoAsset.url;

type Size = "sm" | "md" | "lg" | "xl";
const SIZES: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-24 w-24",
};

export function Logo({
  size = "md",
  withWordmark = false,
  reveal = false,
  className = "",
}: {
  size?: Size;
  withWordmark?: boolean;
  reveal?: boolean;
  className?: string;
}) {
  const img = (
    <motion.div
      whileHover={{ scale: 1.08, rotate: -3 }}
      transition={{ type: "spring", stiffness: 280, damping: 16 }}
      className={`relative inline-flex ${SIZES[size]} ${className}`}
    >
      <span className="absolute inset-0 rounded-full bg-primary/40 blur-xl opacity-60 group-hover:opacity-100 animate-pulse-dot pointer-events-none" />
      <motion.img
        src={LOGO_URL}
        alt="JOB ALERT SERVICE"
        initial={reveal ? { scale: 0.4, opacity: 0, rotate: -25 } : false}
        animate={reveal ? { scale: 1, opacity: 1, rotate: 0 } : undefined}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.05 }}
        className="relative w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(255,107,0,0.45)]"
        draggable={false}
      />
    </motion.div>
  );

  if (!withWordmark) return <span className="group inline-flex">{img}</span>;

  return (
    <span className="group inline-flex items-center gap-2">
      {img}
      <motion.span
        initial={reveal ? { opacity: 0, x: -8 } : false}
        animate={reveal ? { opacity: 1, x: 0 } : undefined}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="font-black tracking-tight text-gradient-primary animate-gradient"
      >
        JOB ALERT SERVICE
      </motion.span>
    </span>
  );
}