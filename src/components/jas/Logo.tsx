import { motion } from "motion/react";

export const LOGO_URL = "";

type Size = "sm" | "md" | "lg" | "xl";
const SIZES: Record<Size, { div: string; text: string }> = {
  sm: { div: "h-8 w-8", text: "text-xs" },
  md: { div: "h-10 w-10", text: "text-sm" },
  lg: { div: "h-14 w-14", text: "text-base" },
  xl: { div: "h-24 w-24", text: "text-2xl" },
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
      className={`relative inline-flex items-center justify-center rounded-full bg-primary ${SIZES[size].div} ${className}`}
    >
      <span className={`font-black text-white ${SIZES[size].text}`}>JAS</span>
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
