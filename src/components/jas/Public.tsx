import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { toast } from "sonner";
import { CheckCircle, Star, Quote, ChevronLeft, ChevronRight, Users, Briefcase, Globe, Award, Zap, Shield, TrendingUp, Target, Heart, MessageCircle } from "lucide-react";
import { Lang, RTL_LANGS, LANGS, t } from "@/lib/i18n";
import { actions, COUNTRIES, CURRENCY, PRESET_FIELDS, useStore, type PlanName } from "@/lib/store";
import { Logo } from "./Logo";

const WA = "https://wa.me/97333740941";
const PLATFORMS = ["LinkedIn Jobs","Indeed","Glassdoor","Bayt.com","Naukrigulf","GulfTalent","Google Jobs","ZipRecruiter","Monster","Jooble"];

function useCountUp(target: number, duration = 1800) {
  const [v, setV] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);
  return { v, start: () => setStarted(true) };
}

// Smooth scroll utility
function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function PublicScreen({ onLogin }: { onLogin: () => void }) {
  const s = useStore();
  const lang = s.lang;
  const isRTL = RTL_LANGS.includes(lang);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden">
      <PremiumNavbar lang={lang} onLogin={onLogin} />
      <Hero lang={lang} />
      <Stats lang={lang} />
      <Marquee />
      <HowItWorks lang={lang} />
      <PremiumPricing lang={lang} />
      <PremiumTestimonials lang={lang} />
      <AboutSection lang={lang} />
      <LiveFeed lang={lang} />
      <SignupForm lang={lang} />
      <FAQ lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />
      <FloatingWA />
    </div>
  );
}

// ─── PREMIUM NAVBAR ──────────────────────────────────────────────────────────
function PremiumNavbar({ lang, onLogin }: { lang: Lang; onLogin: () => void }) {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "top", label: "Home" },
    { id: "pricing", label: "Pricing" },
    { id: "testimonials", label: "Testimonials" },
    { id: "faq", label: "FAQ" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const handleNav = (id: string) => {
    setActive(id);
    setMobileOpen(false);
    smoothScrollTo(id);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl bg-background/80 border-b border-primary/20 shadow-[0_4px_40px_rgba(255,107,0,0.1)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <motion.a
          href="#top"
          onClick={() => handleNav("top")}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 font-black tracking-tight"
        >
          <Logo size="sm" reveal />
          <span className="hidden sm:inline text-gradient-primary animate-gradient text-lg font-black">{t(lang, "brand")}</span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 relative">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleNav(item.id)}
              whileHover={{ y: -1 }}
              className="relative px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg hover:text-primary"
              style={{ color: active === item.id ? "var(--color-primary)" : undefined }}
            >
              {item.label}
              <AnimatePresence>
                {active === item.id && (
                  <motion.div
                    layoutId="nav-underline"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-primary-glow rounded-full"
                  />
                )}
              </AnimatePresence>
              {active === item.id && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <button
            onClick={onLogin}
            className="hidden sm:flex px-4 h-9 rounded-lg border border-border hover:bg-secondary transition items-center text-sm font-semibold"
          >
            {t(lang, "login")}
          </button>
          <motion.a
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,107,0,0.5)" }}
            whileTap={{ scale: 0.97 }}
            href="#signup"
            onClick={() => handleNav("signup")}
            className="px-4 h-9 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-bold text-sm flex items-center shadow-glow animate-glow-pulse"
          >
            {t(lang, "getAlerts")}
          </motion.a>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <motion.div animate={{ rotate: mobileOpen ? 45 : 0 }} className="w-5 h-0.5 bg-foreground mb-1 rounded" />
            <motion.div animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }} className="w-5 h-0.5 bg-foreground mb-1 rounded" />
            <motion.div animate={{ rotate: mobileOpen ? -45 : 0 }} className="w-5 h-0.5 bg-foreground rounded" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNav(item.id)}
                  className="text-left px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary font-semibold transition-all"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function LangSwitcher() {
  const s = useStore();
  return (
    <select
      value={s.lang}
      onChange={(e) => actions.setLang(e.target.value as Lang)}
      className="bg-secondary border border-border rounded-lg px-2 h-9 text-sm"
    >
      {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
    </select>
  );
}

// ─── HERO SECTION ──────────────────────────────────────────────────────────
function Hero({ lang }: { lang: Lang }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 25);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 25);
  };

  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 3,
    duration: Math.random() * 4 + 3,
  })), []);

  const words = ["GET THE JOB", "BEFORE OTHERS"];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-hero bg-mesh min-h-screen flex items-center"
      onMouseMove={handleMouseMove}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/60"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{
              y: [-20, -60, -20],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ x: springX, y: springY }} className="absolute top-10 -left-24 w-[40rem] h-[40rem] rounded-full bg-primary/25 blur-[100px] animate-blob" />
        <motion.div style={{ x: useTransform(springX, v => -v * 0.7), y: useTransform(springY, v => -v * 0.7) }} className="absolute bottom-0 right-0 w-[36rem] h-[36rem] rounded-full bg-accent/30 blur-[100px] animate-blob" />
        <div className="absolute top-1/3 left-1/2 w-80 h-80 rounded-full bg-primary-glow/20 blur-[80px] animate-blob" style={{ animationDelay: "-12s" }} />
        {/* Mesh grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,107,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 backdrop-blur border border-primary/30 text-sm mb-8 shadow-card"
        >
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-primary" />
          {t(lang, "badge")}
          <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-primary font-bold">✦</motion.span>
        </motion.div>

        {/* Split text heading */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl font-bold text-primary/80 tracking-widest uppercase mb-3"
          >
            {"Bahrain's #1 Job Alert Service".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.02, type: "spring", stiffness: 200 }}
                className="inline-block"
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </motion.div>
          {words.map((word, wi) => (
            <motion.div
              key={wi}
              initial={{ opacity: 0, y: 40, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.3 + wi * 0.15, type: "spring", stiffness: 80, damping: 15 }}
              className={`block text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.0] ${wi === 1 ? "text-gradient-primary animate-gradient" : ""}`}
            >
              {word}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed"
        >
          {t(lang, "sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <motion.a
            whileHover={{ scale: 1.07, y: -3, boxShadow: "0 0 40px rgba(255,107,0,0.6)" }}
            whileTap={{ scale: 0.96 }}
            href="#signup"
            className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-bold text-lg shadow-glow animate-glow-pulse overflow-hidden group"
          >
            <motion.div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            {t(lang, "ctaStart")}
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05, y: -2, borderColor: "var(--color-primary)", boxShadow: "0 0 20px rgba(255,107,0,0.2)" }}
            whileTap={{ scale: 0.97 }}
            href="#pricing"
            className="px-8 py-4 rounded-2xl border-2 border-primary/40 bg-card/60 backdrop-blur hover:bg-card/80 transition-all font-bold text-lg"
          >
            {t(lang, "viewPlans")}
          </motion.a>
        </motion.div>

        {/* Floating glass cards */}
        <div className="mt-16 flex justify-center gap-4 flex-wrap">
          {[
            { icon: "⚡", text: "Real-time Alerts", delay: 0.9 },
            { icon: "🌍", text: "15+ Countries", delay: 1.0 },
            { icon: "🎯", text: "500+ Members", delay: 1.1 },
          ].map((card) => (
            <motion.div
              key={card.text}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay, type: "spring" }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-card/70 backdrop-blur-md border border-primary/20 shadow-card text-sm font-semibold"
            >
              <span className="text-lg">{card.icon}</span>
              {card.text}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-primary/40 flex items-start justify-center pt-2"
        >
          <motion.div className="w-1.5 h-3 rounded-full bg-primary" animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Stats({ lang }: { lang: Lang }) {
  const subs = useCountUp(500);
  const jobs = useCountUp(52000);
  const countries = useCountUp(15);
  const [watch, setWatch] = useState(180);
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    subs.start(); jobs.start(); countries.start();
  }, [inView]);

  useEffect(() => {
    const id = setInterval(() => setWatch(Math.floor(85 + Math.random() * 235)), 3500);
    return () => clearInterval(id);
  }, []);

  const items = [
    { v: `${subs.v}+`, l: t(lang, "activeSubs") },
    { v: `${jobs.v.toLocaleString()}+`, l: t(lang, "jobsSent") },
    { v: `${countries.v}+`, l: t(lang, "countries") },
    { v: watch.toString(), l: t(lang, "watching") },
  ];
  return (
    <section ref={ref} className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it, i) => (
          <motion.div
            key={it.l}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="text-center p-6 rounded-2xl bg-card/80 backdrop-blur border border-primary/10 shadow-card hover:border-primary/40 hover:shadow-glow transition-all duration-300"
          >
            <div className="text-3xl sm:text-4xl font-black text-primary mb-2">{it.v}</div>
            <div className="text-sm text-muted-foreground font-medium">{it.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const logos = PLATFORMS;
  return (
    <div className="overflow-hidden py-6 bg-card/40 border-y border-primary/10 relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...logos, ...logos].map((l, i) => (
          <span key={i} className="text-sm text-muted-foreground font-semibold px-4 py-1.5 rounded-full bg-secondary/50 border border-border">
            {l}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function HowItWorks({ lang }: { lang: Lang }) {
  const steps = useMemo(() => [
    { n: "1", icon: "📝", title: t(lang, "step1t"), desc: t(lang, "step1d") },
    { n: "2", icon: "🤖", title: t(lang, "step2t"), desc: t(lang, "step2d") },
    { n: "3", icon: "🚀", title: t(lang, "step3t"), desc: t(lang, "step3d") },
  ], [lang]);
  return (
    <section className="py-24 px-6" id="how">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">{t(lang, "howItWorks")}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t(lang, "howSub")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative p-8 rounded-3xl bg-card border border-border shadow-card hover:border-primary/40 hover:shadow-glow transition-all duration-300 text-center group"
            >
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                className="text-5xl mb-6"
              >
                {s.icon}
              </motion.div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center font-black text-sm shadow-glow">
                {s.n}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
// ─── PREMIUM PRICING ──────────────────────────────────────────────────────────
function PremiumPricing({ lang }: { lang: Lang }) {
  const s = useStore();
  const plans = useMemo(() => [
    {
      name: "Starter" as PlanName,
      monthlyPrice: 3,
      yearlyPrice: 29,
      features: [t(lang, "f1"), t(lang, "f2"), t(lang, "f3"), t(lang, "f4")],
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
      glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
      icon: "⚡",
    },
    {
      name: "Pro" as PlanName,
      monthlyPrice: 7,
      yearlyPrice: 69,
      features: [t(lang, "f1"), t(lang, "f2"), t(lang, "f3"), t(lang, "f4"), t(lang, "f5"), t(lang, "f6"), t(lang, "f7")],
      popular: true,
      color: "from-primary/25 to-primary-glow/25",
      border: "border-primary/60",
      glow: "shadow-[0_0_50px_rgba(255,107,0,0.25)]",
      icon: "🚀",
    },
    {
      name: "Elite" as PlanName,
      monthlyPrice: 15,
      yearlyPrice: 149,
      features: [t(lang, "f1"), t(lang, "f2"), t(lang, "f3"), t(lang, "f4"), t(lang, "f5"), t(lang, "f6"), t(lang, "f7"), t(lang, "f8"), t(lang, "f9")],
      color: "from-purple-500/20 to-violet-500/20",
      border: "border-purple-500/30",
      glow: "shadow-[0_0_30px_rgba(139,92,246,0.15)]",
      icon: "💎",
    },
  ], [lang]);

  const [yearly, setYearly] = useState(false);

  // Floating particles
  const particles = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, delay: Math.random() * 3, duration: Math.random() * 4 + 4,
  })), []);

  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/20"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size + 2, height: p.size + 2 }}
            animate={{ y: [-15, -40, -15], opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">{t(lang, "pricingTitle")}</h2>
          <p className="text-muted-foreground text-lg mb-8">{t(lang, "pricingSub")}</p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-card/80 border border-border">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${!yearly ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-glow" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${yearly ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-glow" : "text-muted-foreground"}`}
            >
              Yearly <span className="text-xs opacity-70">-30%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 80, damping: 15 }}
              whileHover={{
                y: plan.popular ? -12 : -8,
                scale: plan.popular ? 1.02 : 1.01,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${plan.color} backdrop-blur-md border-2 ${plan.border} ${plan.glow} p-8 transition-all duration-300 group ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Shine sweep on hover */}
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

              {/* Animated border glow */}
              {plan.popular && (
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-1 bg-conic-gradient opacity-30 blur-sm"
                    style={{ background: "conic-gradient(from 0deg, transparent, rgba(255,107,0,0.8), transparent, rgba(255,107,0,0.4), transparent)" }}
                  />
                </div>
              )}

              {/* Popular badge */}
              {plan.popular && (
                <motion.div
                  initial={{ y: -10, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-1 left-1/2 -translate-x-1/2"
                >
                  <motion.div
                    animate={{ boxShadow: ["0 0 10px rgba(255,107,0,0.4)", "0 0 25px rgba(255,107,0,0.8)", "0 0 10px rgba(255,107,0,0.4)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-4 py-1 rounded-b-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-xs font-black tracking-wider uppercase"
                  >
                    ✦ MOST POPULAR ✦
                  </motion.div>
                </motion.div>
              )}

              <div className="text-4xl mb-4 mt-2">{plan.icon}</div>
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>

              <div className="mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={yearly ? "yearly" : "monthly"}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-end gap-1"
                  >
                    <span className="text-5xl font-black text-primary">"BD "}{yearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                    <span className="text-muted-foreground mb-2 text-sm">/{yearly ? "yr" : "mo"}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, fi) => (
                  <motion.li
                    key={fi}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: fi * 0.05 + i * 0.1 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, delay: fi * 0.2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    </motion.div>
                    <span>{f}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.a
                whileHover={{ scale: 1.04, boxShadow: plan.popular ? "0 0 30px rgba(255,107,0,0.5)" : undefined }}
                whileTap={{ scale: 0.97 }}
                href="#signup"
                className={`w-full flex items-center justify-center py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden group/btn ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-glow"
                    : "bg-secondary hover:bg-primary/20 border border-border hover:border-primary/40"
                }`}
              >
                <span className="relative z-10">{t(lang, "selectPlan")}</span>
                {plan.popular && <motion.div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12" />}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
// ─── PREMIUM TESTIMONIALS ──────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Ahmed Al-Rashidi", role: "Software Engineer", country: "Bahrain", flag: "🇧🇭", avatar: "AR", rating: 5, text: "Got my dream job at Gulf Air within 2 weeks of subscribing! The real-time alerts meant I applied before anyone else. Absolutely game-changing service.", verified: true, joined: "Jan 2024" },
  { name: "Fatima Hassan", role: "Marketing Manager", country: "UAE", flag: "🇦🇪", avatar: "FH", rating: 5, text: "I was job hunting for 6 months with no luck. After subscribing, I landed a marketing director role in Dubai in just 3 weeks. Worth every fils!", verified: true, joined: "Feb 2024" },
  { name: "James Mitchell", role: "Finance Analyst", country: "UK", flag: "🇬🇧", avatar: "JM", rating: 5, text: "Relocated from London to Bahrain and this service made my job search effortless. Got 5 interviews in the first week alone. Incredible!", verified: true, joined: "Mar 2024" },
  { name: "Priya Sharma", role: "HR Specialist", country: "India", flag: "🇮🇳", avatar: "PS", rating: 5, text: "The alerts are super specific to my field. No spam, only relevant openings. Secured a position at a top Bahrain bank thanks to this service!", verified: true, joined: "Apr 2024" },
  { name: "Mohammed Al-Khalifa", role: "Project Manager", country: "Saudi Arabia", flag: "🇸🇦", avatar: "MK", rating: 5, text: "Used this for my brother who was searching for work in Bahrain. He found a great engineering job within 10 days. Highly recommend!", verified: true, joined: "May 2024" },
  { name: "Sarah Chen", role: "UX Designer", country: "Philippines", flag: "🇵🇭", avatar: "SC", rating: 5, text: "As an expat, finding jobs in Bahrain was tough until I found this service. The WhatsApp alerts are instant and very detailed. Got hired at a startup!", verified: true, joined: "Jun 2024" },
  { name: "Omar Abdullah", role: "Civil Engineer", country: "Bahrain", flag: "🇧🇭", avatar: "OA", rating: 5, text: "5 job offers in one month! I couldn't believe how many opportunities exist when you have the right tools. This is truly Bahrain's best job service.", verified: true, joined: "Jul 2024" },
  { name: "Nadia Petrova", role: "Accountant", country: "Russia", flag: "🇷🇺", avatar: "NP", rating: 5, text: "Working in Bahrain was my dream. JAS made it reality by sending me exactly the right opportunities. I'm now CFO assistant at a Manama firm!", verified: true, joined: "Aug 2024" },
  { name: "David Okonkwo", role: "IT Manager", country: "Nigeria", flag: "🇳🇬", avatar: "DO", rating: 5, text: "Moved from Lagos to Manama last year. This service helped me get a tech lead position faster than I could have imagined. Truly 5 stars!", verified: true, joined: "Sep 2024" },
  { name: "Aisha Al-Zaabi", role: "Teacher", country: "UAE", flag: "🇦🇪", avatar: "AZ", rating: 5, text: "Found a teaching position at an international school in Bahrain within weeks! The alerts are specific, fast, and always relevant. Love it.", verified: true, joined: "Oct 2024" },
  { name: "Carlos Mendez", role: "Sales Director", country: "Spain", flag: "🇪🇸", avatar: "CM", rating: 5, text: "Best investment for my career move to the Gulf. Got multiple interviews at top companies. Landed a regional sales director role at a Fortune 500!", verified: true, joined: "Nov 2024" },
  { name: "Lin Wei", role: "Data Scientist", country: "China", flag: "🇨🇳", avatar: "LW", rating: 5, text: "The AI-powered matching is incredibly accurate. Every alert I received was a perfect fit for my skills. Found my dream data role in just 12 days!", verified: true, joined: "Dec 2024" },
  { name: "Rania Boutros", role: "Nurse", country: "Egypt", flag: "🇪🇬", avatar: "RB", rating: 5, text: "Healthcare jobs in Bahrain are hard to find but this service sends them to my phone instantly. Got placed at Salmaniya Medical Centre. So grateful!", verified: true, joined: "Jan 2025" },
  { name: "Tom Walters", role: "Operations Manager", country: "Australia", flag: "🇦🇺", avatar: "TW", rating: 5, text: "Transferred my career to the Middle East with ease using JAS. The platform is professional, reliable, and delivers real results. Highly recommended!", verified: true, joined: "Feb 2025" },
  { name: "Yasmin Khalid", role: "Legal Advisor", country: "Jordan", flag: "🇯🇴", avatar: "YK", rating: 5, text: "Found a corporate law position at a top Bahrain firm within 3 weeks. The service is worth 10x the price. Best career decision I ever made!", verified: true, joined: "Mar 2025" },
];

function PremiumTestimonials({ lang }: { lang: Lang }) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS.length), 4500);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [isAutoPlaying, startAuto]);

  const prev = () => {
    setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };
  const next = () => {
    setCurrent(c => (c + 1) % TESTIMONIALS.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  const getVisible = () => {
    const indices = [];
    for (let i = -1; i <= 1; i++) {
      indices.push((current + i + TESTIMONIALS.length) % TESTIMONIALS.length);
    }
    return indices;
  };

  return (
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent/8 blur-[80px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-sm text-primary font-bold mb-4"
          >
            <Star className="w-4 h-4 fill-primary" />
            500+ Happy Members
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">What Our Members Say</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Real success stories from real people who found their dream jobs</p>
        </motion.div>

        {/* Main carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -60, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                className="w-full"
              >
                <TestimonialCard t={TESTIMONIALS[current]} featured />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side cards (desktop) */}
          <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none -mx-20">
            {[
              TESTIMONIALS[(current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length],
              TESTIMONIALS[(current + 1) % TESTIMONIALS.length],
            ].map((t2, idx) => (
              <motion.div
                key={t2.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5, scale: 0.85 }}
                className="w-72 pointer-events-auto cursor-pointer"
                onClick={idx === 0 ? prev : next}
                whileHover={{ opacity: 0.8, scale: 0.88 }}
              >
                <TestimonialCard t={t2} />
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-12 h-12 rounded-full bg-card/80 border border-primary/30 flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-all shadow-card"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => { setCurrent(i); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 6000); }}
                  animate={{ width: i === current ? 24 : 8, backgroundColor: i === current ? "var(--color-primary)" : "var(--color-border)" }}
                  className="h-2 rounded-full transition-all"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-12 h-12 rounded-full bg-card/80 border border-primary/30 flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-all shadow-card"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Grid of mini cards */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.slice(0, 6).map((t2, i) => (
            <motion.div
              key={t2.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="cursor-pointer"
              onClick={() => { const idx = TESTIMONIALS.findIndex(x => x.name === t2.name); setCurrent(idx); }}
            >
              <TestimonialCard t={t2} mini />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t: testimonial, featured = false, mini = false }: { t: typeof TESTIMONIALS[0]; featured?: boolean; mini?: boolean }) {
  return (
    <motion.div
      whileHover={!mini ? { y: -4 } : {}}
      className={`relative rounded-3xl bg-card/80 backdrop-blur-md border border-border/60 hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-glow overflow-hidden group ${featured ? "p-8 sm:p-10" : mini ? "p-5" : "p-7"}`}
    >
      {/* Animated bg glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Quote icon */}
      <div className={`absolute top-4 right-4 text-primary/15 ${featured ? "text-7xl" : "text-5xl"}`}>"</div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
          >
            <Star className={`${featured ? "w-5 h-5" : "w-4 h-4"} text-yellow-400 fill-yellow-400`} />
          </motion.div>
        ))}
      </div>

      <p className={`text-foreground/90 leading-relaxed mb-6 ${featured ? "text-lg" : mini ? "text-sm" : "text-base"} line-clamp-${mini ? "3" : "5"}`}>
        {testimonial.text}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {/* Animated avatar */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`relative flex-shrink-0 ${featured ? "w-14 h-14" : "w-10 h-10"} rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center font-black text-primary-foreground shadow-glow`}
          style={{ fontSize: featured ? 18 : 13 }}
        >
          {testimonial.avatar}
          {/* Glow ring */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full ring-2 ring-primary/50"
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold truncate ${featured ? "text-base" : "text-sm"}`}>{testimonial.name}</span>
            <span className="text-base">{testimonial.flag}</span>
            {testimonial.verified && (
              <motion.div
                animate={{ boxShadow: ["0 0 5px rgba(59,130,246,0.3)", "0 0 12px rgba(59,130,246,0.6)", "0 0 5px rgba(59,130,246,0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30"
              >
                <Shield className="w-3 h-3 text-blue-500 fill-blue-500/50" />
                <span className="text-[10px] text-blue-500 font-bold">Verified</span>
              </motion.div>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{testimonial.role} · {testimonial.country}</div>
        </div>
      </div>
    </motion.div>
  );
}
// ─── ABOUT SECTION ──────────────────────────────────────────────────────────
const TEAM = [
  { name: "Ali Hassan", role: "Founder & CEO", emoji: "👨‍💼", bio: "10+ years in Gulf recruitment industry" },
  { name: "Sara Ahmed", role: "Head of Technology", emoji: "👩‍💻", bio: "Ex-Google engineer, AI specialist" },
  { name: "Khalid Nasser", role: "Job Market Expert", emoji: "👨‍🎯", bio: "Former HR Director at Fortune 500" },
  { name: "Mia Patel", role: "Customer Success", emoji: "👩‍🌟", bio: "Helped 500+ professionals find jobs" },
];

function CounterItem({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setVal(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-black text-primary">{val.toLocaleString()}{suffix}</div>
      <div className="text-sm text-muted-foreground mt-1 font-medium">{label}</div>
    </div>
  );
}

function AboutSection({ lang }: { lang: Lang }) {
  const timeline = [
    { year: "2021", title: "Company Founded", desc: "Started in Bahrain with a mission to democratize job access in the Gulf region." },
    { year: "2022", title: "1,000 Members", desc: "Crossed 1,000 active subscribers and launched our AI-powered matching engine." },
    { year: "2023", title: "Regional Expansion", desc: "Expanded coverage to UAE, Saudi Arabia, Kuwait and 12 more countries." },
    { year: "2024", title: "500+ Success Stories", desc: "Helped over 500 professionals land their dream jobs across the Gulf region." },
    { year: "2025", title: "Premium Platform", desc: "Launched premium features with real-time alerts, CV review, and interview prep." },
  ];

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-accent/10 blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-sm text-primary font-bold mb-4">
            <Users className="w-4 h-4" /> About JAS
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black mb-6">Bahrain's #1 Job Alert Platform</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Founded in Bahrain, we're on a mission to help every job seeker find their dream role faster. Our AI-powered platform scans 10+ job platforms 24/7 and delivers real-time alerts directly to your WhatsApp.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20 p-8 rounded-3xl bg-card/60 backdrop-blur border border-border shadow-card"
        >
          <CounterItem target={500} label="Happy Members" suffix="+" />
          <CounterItem target={52000} label="Jobs Tracked" suffix="+" />
          <CounterItem target={15} label="Countries Covered" suffix="+" />
          <CounterItem target={98} label="Satisfaction Rate" suffix="%" />
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            { icon: <Target className="w-7 h-7 text-primary" />, title: "Our Mission", text: "To empower every job seeker in the Gulf with instant access to the latest opportunities, giving them the competitive edge to apply first and get hired faster." },
            { icon: <TrendingUp className="w-7 h-7 text-primary" />, title: "Our Vision", text: "To become the most trusted career acceleration platform in the MENA region, connecting talent with opportunity through cutting-edge AI and real-time data." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="p-8 rounded-3xl bg-card/80 backdrop-blur border border-border hover:border-primary/40 shadow-card hover:shadow-glow transition-all group"
            >
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 1.5 }} className="mb-4">
                {item.icon}
              </motion.div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-black text-center mb-12">
            Our Journey
          </motion.h3>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary to-primary/50 hidden md:block" />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 80 }}
                className={`flex md:${i % 2 === 0 ? "flex-row" : "flex-row-reverse"} gap-8 mb-10 items-center`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="p-6 rounded-2xl bg-card/80 backdrop-blur border border-border hover:border-primary/40 shadow-card hover:shadow-glow transition-all group">
                    <div className="text-primary font-black text-lg mb-1">{item.year}</div>
                    <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 180 }}
                  className="hidden md:flex w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow items-center justify-center font-black text-primary-foreground text-xs flex-shrink-0 shadow-glow z-10"
                >
                  {item.year.slice(2)}
                </motion.div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-black text-center mb-12">Meet the Team</motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="p-6 rounded-3xl bg-card/80 backdrop-blur border border-border hover:border-primary/40 shadow-card hover:shadow-glow transition-all text-center group"
              >
                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  className="text-5xl mb-4"
                >
                  {member.emoji}
                </motion.div>
                <h4 className="font-black text-lg mb-1 group-hover:text-primary transition-colors">{member.name}</h4>
                <div className="text-primary text-sm font-bold mb-2">{member.role}</div>
                <p className="text-muted-foreground text-xs">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
// ─── LIVE FEED ──────────────────────────────────────────────────────────────
function LiveFeed({ lang }: { lang: Lang }) {
  const jobs = useMemo(() => [
    { title: "Senior Software Engineer", company: "Gulf Air", loc: "Bahrain", time: "2 min ago", hot: true },
    { title: "Marketing Manager", company: "ALBA", loc: "Manama", time: "5 min ago", hot: true },
    { title: "Financial Analyst", company: "Bank of Bahrain", loc: "Seef", time: "11 min ago", hot: false },
    { title: "HR Specialist", company: "Batelco", loc: "Bahrain", time: "18 min ago", hot: false },
    { title: "Project Manager", company: "NBB", loc: "Manama", time: "24 min ago", hot: false },
    { title: "Data Scientist", company: "Tamkeen", loc: "Bahrain", time: "31 min ago", hot: false },
  ], []);
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-card/20 to-transparent" />
      <div className="max-w-3xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-3">{t(lang, "liveAlerts")}</h2>
          <p className="text-muted-foreground">{t(lang, "liveSub")}</p>
        </motion.div>
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ x: 4, scale: 1.01 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card/80 backdrop-blur border border-border hover:border-primary/30 hover:shadow-card transition-all group"
            >
              <motion.div
                animate={job.hot ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${job.hot ? "bg-primary shadow-[0_0_8px_rgba(255,107,0,0.6)]" : "bg-green-500"}`}
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">{job.title}</div>
                <div className="text-xs text-muted-foreground">{job.company} · {job.loc}</div>
              </div>
              <div className="text-xs text-muted-foreground flex-shrink-0">{job.time}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SIGNUP FORM ──────────────────────────────────────────────────────────────
function SignupForm({ lang }: { lang: Lang }) {
  const s = useStore();
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<string[]>([...PRESET_FIELDS.slice(0, 3)]);
  const [custom, setCustom] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function toggle(f: string) {
    setFields((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  }
  function addCustom() {
    const v = custom.trim();
    if (v && !fields.includes(v)) { setFields((p) => [...p, v]); setCustom(""); }
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    actions.signup({ ...data, fields, plan: s.selectedPlan });
    setSubmitted(true);
    toast.success(t(lang, "successToast"));
  }

  if (submitted) return (
    <section id="signup" className="py-24 px-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto text-center p-10 rounded-3xl bg-card border border-primary/30 shadow-glow">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6 }} className="text-6xl mb-4">🎉</motion.div>
        <h3 className="text-2xl font-black mb-3">{t(lang, "successTitle")}</h3>
        <p className="text-muted-foreground">{t(lang, "successBody")}</p>
      </motion.div>
    </section>
  );

  return (
    <section id="signup" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/4 to-transparent" />
      </div>
      <div className="max-w-2xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">{t(lang, "signupTitle")}</h2>
          <p className="text-muted-foreground text-lg">{t(lang, "signupSub")}</p>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={submit}
          className="p-8 rounded-3xl bg-card/80 backdrop-blur border border-border shadow-card space-y-5"
        >
          <Input lang={lang} name="name" label={t(lang, "labelName")} required />
          <Input lang={lang} name="phone" label={t(lang, "labelPhone")} type="tel" required />
          <Input lang={lang} name="email" label={t(lang, "labelEmail")} type="email" />
          <Select lang={lang} name="country" label={t(lang, "labelCountry")} options={COUNTRIES} required />
          <Slider lang={lang} />

          <div>
            <div className="text-sm font-semibold mb-3">{t(lang, "labelFields")}</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_FIELDS.map((f) => (
                <motion.button
                  key={f} type="button" onClick={() => toggle(f)}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${fields.includes(f) ? "bg-primary text-primary-foreground border-primary shadow-glow" : "bg-secondary border-border hover:border-primary/40"}`}
                >
                  {f}
                </motion.button>
              ))}
            </div>
            <button type="button" onClick={() => setOpen(!open)} className="text-xs text-primary hover:underline">
              {open ? "▲ " : "▼ "}{t(lang, "addCustom")}
            </button>
            <AnimatePresence>
              {open && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="flex gap-2 mt-2">
                    <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={t(lang, "customFieldPlaceholder")} className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())} />
                    <button type="button" onClick={addCustom} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">+</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Select lang={lang} name="plan" label={t(lang, "labelPlan")} options={["Starter", "Pro", "Elite"]} required />

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255,107,0,0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-black text-lg shadow-glow animate-glow-pulse relative overflow-hidden group"
          >
            <motion.div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            <span className="relative z-10">{t(lang, "ctaSignup")}</span>
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}

function Input({ lang, name, label, type = "text", required }: { lang: Lang; name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}{required && <span className="text-primary ml-1">*</span>}</label>
      <input name={name} type={type} required={required} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition text-sm" />
    </div>
  );
}

function Select({ lang, name, label, options, required }: { lang: Lang; name: string; label: string; options: string[]; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}{required && <span className="text-primary ml-1">*</span>}</label>
      <select name={name} required={required} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:border-primary transition text-sm">
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Slider({ lang }: { lang: Lang }) {
  const s = useStore();
  return (
    <div>
      <label className="flex justify-between text-sm font-semibold mb-2">
        <span>{t(lang, "labelAlerts")}</span>
        <span className="text-primary font-black">{s.alertFreq}×/day</span>
      </label>
      <div className="relative">
        <input type="range" min="1" max="10" value={s.alertFreq} onChange={(e) => actions.setAlertFreq(+e.target.value)} className="w-full accent-primary cursor-pointer" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1</span><span>5</span><span>10</span>
        </div>
      </div>
    </div>
  );
}
// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ({ lang }: { lang: Lang }) {
  const faqs = useMemo(() => [
    { q: t(lang, "faq1q"), a: t(lang, "faq1a") },
    { q: t(lang, "faq2q"), a: t(lang, "faq2a") },
    { q: t(lang, "faq3q"), a: t(lang, "faq3a") },
    { q: t(lang, "faq4q"), a: t(lang, "faq4a") },
    { q: t(lang, "faq5q"), a: t(lang, "faq5a") },
  ], [lang]);
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      <div className="max-w-3xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">{t(lang, "faq")}</h2>
          <p className="text-muted-foreground text-lg">{t(lang, "faqSub")}</p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-card/80 backdrop-blur border border-border overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-sm sm:text-base gap-4"
              >
                <span>{f.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary text-xs">
                  ▼
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact({ lang }: { lang: Lang }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    toast.success(t(lang, "contactSentToast"));
  }
  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[100px]" />
      </div>
      <div className="max-w-xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">{t(lang, "contact")}</h2>
          <p className="text-muted-foreground text-lg">{t(lang, "contactSub")}</p>
        </motion.div>
        {sent ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-10 rounded-3xl bg-card border border-primary/30 shadow-glow">
            <div className="text-5xl mb-3">✉️</div>
            <h3 className="text-xl font-black">{t(lang, "contactSentTitle")}</h3>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={send}
            className="p-8 rounded-3xl bg-card/80 backdrop-blur border border-border shadow-card space-y-5"
          >
            <Input lang={lang} name="name" label={t(lang, "labelName")} required />
            <Input lang={lang} name="email" label={t(lang, "labelEmail")} type="email" required />
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t(lang, "labelMessage")}<span className="text-primary ml-1">*</span></label>
              <textarea name="message" required rows={4} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition text-sm resize-none" />
            </div>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,107,0,0.3)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={sending}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-bold disabled:opacity-70 shadow-glow transition-all"
            >
              {sending ? (
                <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>Sending...</motion.span>
              ) : t(lang, "sendMessage")}
            </motion.button>
          </motion.form>
        )}
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer({ lang }: { lang: Lang }) {
  const navItems = [
    { id: "top", label: "Home" },
    { id: "pricing", label: "Pricing" },
    { id: "testimonials", label: "Reviews" },
    { id: "faq", label: "FAQ" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <footer className="border-t border-border py-12 px-6 bg-card/40">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-black text-xl mb-3">
              <Logo size="sm" />
              <span className="text-gradient-primary animate-gradient">{t(lang, "brand")}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">Bahrain's #1 job alert service. Real-time notifications for the Gulf's best opportunities.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => smoothScrollTo(item.id)} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Job Alert Service Bahrain. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── FLOATING WHATSAPP BUTTON ──────────────────────────────────────────────
function FloatingWA() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="px-4 py-2 rounded-2xl bg-card border border-[#25D366]/30 shadow-lg text-sm font-semibold whitespace-nowrap"
          >
            💬 Chat with us on WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.15, rotate: 8 }}
        whileTap={{ scale: 0.92 }}
        animate={{
          y: [0, -6, 0],
          boxShadow: [
            "0 0 20px rgba(37,211,102,0.4)",
            "0 0 40px rgba(37,211,102,0.7)",
            "0 0 20px rgba(37,211,102,0.4)",
          ],
        }}
        transition={{ y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }, boxShadow: { duration: 2, repeat: Infinity } }}
        className="relative w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center cursor-pointer"
        style={{ boxShadow: "0 0 25px rgba(37,211,102,0.5)" }}
      >
        {/* Pulse rings */}
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#25D366]"
        />
        <motion.div
          animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
          className="absolute inset-0 rounded-full bg-[#25D366]"
        />

        {/* WhatsApp SVG Icon */}
        <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white relative z-10" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.551 4.116 1.514 5.848L.057 23.716a.5.5 0 00.614.667l6.045-1.587A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.7-.526-5.229-1.44l-.374-.224-3.877 1.018 1.037-3.78-.244-.388A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </motion.a>
    </div>
  );
}
