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

/** Cinematic intro sequence — auto-dismisses with smooth fade into homepage. */
export function LoadingScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(id);
  }, []);

  // Floating intro particles (independent of background ParticleField).
  const particles = Array.from({ length: 28 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 60 + Math.random() * 40,
    delay: Math.random() * 0.8,
    dur: 1.6 + Math.random() * 1.4,
    size: 2 + Math.random() * 4,
  }));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(18px)", scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background overflow-hidden"
        >
          {/* Morphing mesh background */}
          <motion.div
            className="absolute inset-0 bg-mesh animate-morph"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.95, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Expanding orange glow rings */}
          {[0, 0.25, 0.5].map((d, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary/30"
              initial={{ width: 80, height: 80, opacity: 0.7 }}
              animate={{ width: 720, height: 720, opacity: 0 }}
              transition={{ duration: 2.4, delay: d, ease: "easeOut", repeat: Infinity }}
            />
          ))}

          {/* Central orange radial glow burst */}
          <motion.div
            aria-hidden
            className="absolute w-[60vmin] h-[60vmin] rounded-full"
            style={{ background: "radial-gradient(circle, oklch(0.78 0.18 55 / 0.55), transparent 60%)" }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0.7], scale: [0.4, 1.1, 1] }}
            transition={{ duration: 1.6, times: [0, 0.5, 1], ease: "easeOut" }}
          />

          {/* Floating intro particles rising */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute rounded-full bg-primary/70"
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, boxShadow: "0 0 12px oklch(0.78 0.18 55 / 0.9)" }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: -160 - Math.random() * 120 }}
                transition={{ duration: p.dur, delay: p.delay, ease: "easeOut", repeat: Infinity, repeatDelay: 0.4 }}
              />
            ))}
          </div>

          {/* Sweeping blur light bar */}
          <motion.div
            aria-hidden
            className="absolute inset-y-0 w-[40vw] -skew-x-12 blur-2xl"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.78 0.18 55 / 0.35), transparent)" }}
            initial={{ x: "-60vw" }}
            animate={{ x: "120vw" }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Logo reveal */}
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -40, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, rotate: 0, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-primary/40 blur-3xl scale-150 animate-pulse-dot" />
              <div className="relative">
                <Logo size="xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.1em", filter: "blur(8px)" }}
              animate={{ opacity: 1, letterSpacing: "0.4em", filter: "blur(0px)" }}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] sm:text-xs font-bold tracking-[0.4em] text-gradient-primary animate-gradient uppercase"
            >
              Job Alert Service
            </motion.div>

            <div className="w-64 h-[3px] rounded-full bg-secondary/60 overflow-hidden mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
                className="h-full bg-gradient-to-r from-primary via-primary-glow to-primary shadow-glow"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-[10px] font-semibold tracking-[0.3em] text-muted-foreground"
            >
              WELCOME
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}