import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./Logo";

/** Cursor-follow radial glow that sits above the page background. */
export function CursorGlow() {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] mix-blend-multiply"
      style={{
        background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, oklch(0.78 0.18 55 / 0.18), transparent 60%)`,
        transition: "background-position 60ms linear",
      }}
    />
  );
}

/** Slow-floating particle field rendered as fixed SVG. */
export function ParticleField({ count = 22 }: { count?: number }) {
  const dots = Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: 1.5 + Math.random() * 3.5,
    dur: 10 + Math.random() * 14,
    delay: -Math.random() * 12,
  }));
  return (
    <svg aria-hidden className="pointer-events-none fixed inset-0 z-[3] w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <radialGradient id="pg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.78 0.18 55)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="oklch(0.78 0.18 55)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map((d) => (
        <circle key={d.id} cx={d.x} cy={d.y} r={d.r / 6} fill="url(#pg)">
          <animate attributeName="cy" values={`${d.y};${Math.max(0, d.y - 15)};${d.y}`} dur={`${d.dur}s`} begin={`${d.delay}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur={`${d.dur}s`} begin={`${d.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/** Initial cinematic loading screen — auto-dismisses. */
export function LoadingScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(id);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
        >
          <div className="absolute inset-0 bg-mesh opacity-80" />
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -25 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
            >
              <Logo size="xl" />
            </motion.div>
            <div className="w-56 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
                className="h-full w-1/2 bg-gradient-to-r from-primary to-primary-glow"
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-semibold tracking-[0.3em] text-gradient-primary animate-gradient"
            >
              LOADING…
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}