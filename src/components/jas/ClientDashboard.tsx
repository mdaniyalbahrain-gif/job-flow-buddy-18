import { motion } from "motion/react";
import { actions, useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Logo } from "./Logo";

export function ClientDashboard() {
  const s = useStore();
  const lang = s.lang;
  const client = s.clients.find((c) => c.id === s.sessionClientId);
  if (!client) return null;

  const statusLabel = client.status === "active" ? t(lang, "statusActive") : client.status === "pending" ? t(lang, "statusPending") : t(lang, "statusPaused");

  const timeline = [
    { e: "📝", t: t(lang, "tlStep1"), d: t(lang, "tlStep1d"), done: true },
    { e: "💳", t: t(lang, "tlStep2"), d: t(lang, "tlStep2d"), done: true },
    { e: "✅", t: t(lang, "tlStep3"), d: client.status !== "pending" ? t(lang, "tlStep3dOk") : t(lang, "tlStep3dWait"), done: client.status !== "pending" },
    { e: "📨", t: t(lang, "tlStep4"), d: client.status === "active" ? t(lang, "tlStep4dOk") : t(lang, "tlStep4dWait"), done: client.status === "active" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" reveal />
            <span className="font-black text-gradient-primary animate-gradient hidden sm:inline">{t(lang, "brand")}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground hidden sm:block">{client.name}</div>
            <button onClick={actions.logout} className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary text-sm">{t(lang, "logout")}</button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h1 className="text-3xl font-black">{client.name}</h1>
          <div className="text-muted-foreground mt-1">{client.plan} Plan · {client.currency} {client.price}/month</div>
          <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-secondary text-sm">{statusLabel}</div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Stat label={t(lang, "fields")} value={client.fields.length} />
            <Stat label="Max/Day" value={client.maxPerDay} />
            <Stat label="Sent Today" value={client.sentToday} />
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <DailyUsageRing sent={client.sentToday} max={client.maxPerDay} />
            <Sparkline />
          </div>
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">{t(lang, "yourFields")}</div>
            <div className="flex flex-wrap gap-2">
              {client.fields.map((f) => <span key={f} className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs">{f}</span>)}
            </div>
          </div>
        </motion.section>

        <section className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h2 className="font-bold mb-4">Progress</h2>
          <div className="space-y-4">
            {timeline.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-10 h-10 rounded-full grid place-items-center text-lg ${s.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{s.e}</div>
                <div>
                  <div className="font-semibold">{s.t}</div>
                  <div className="text-sm text-muted-foreground">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h2 className="font-bold mb-4">{t(lang, "recentAlerts")}</h2>
          {client.status === "active" ? (
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">💼 Software Engineer at TechBH — 📍 Manama · 🕐 5 min ago — <a className="text-primary" href="#">View & Apply →</a></div>
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">💻 Senior Developer at Gulf IT — 📍 Bahrain · 🕐 23 min ago — <a className="text-primary" href="#">View & Apply →</a></div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{t(lang, "waitApprove")}</div>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
      <div className="text-2xl font-black text-gradient-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function DailyUsageRing({ sent, max }: { sent: number; max: number }) {
  const pct = Math.min(1, max ? sent / max : 0);
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="p-5 rounded-2xl bg-secondary/40 border border-border flex items-center gap-5">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <defs>
            <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.70 0.22 45)" />
              <stop offset="100%" stopColor="oklch(0.85 0.14 70)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={R} stroke="oklch(0.92 0.01 60)" strokeWidth="10" fill="none" />
          <motion.circle
            cx="60" cy="60" r={R} fill="none"
            stroke="url(#ringG)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C * (1 - pct) }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-2xl font-black text-gradient-primary">{Math.round(pct * 100)}%</div>
            <div className="text-[10px] text-muted-foreground">Daily quota</div>
          </div>
        </div>
      </div>
      <div>
        <div className="font-bold">Today's usage</div>
        <div className="text-sm text-muted-foreground">{sent} of {max} alerts sent</div>
      </div>
    </div>
  );
}

function Sparkline() {
  const data = [4, 7, 5, 9, 6, 12, 10, 14, 11, 16, 13, 18];
  const max = Math.max(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * 100, 100 - (v / max) * 90]);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const area = `${path} L100,100 L0,100 Z`;
  return (
    <div className="p-5 rounded-2xl bg-secondary/40 border border-border">
      <div className="flex justify-between items-baseline mb-2">
        <div className="font-bold">Last 12 days</div>
        <div className="text-xs text-success font-semibold">▲ 38%</div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24">
        <defs>
          <linearGradient id="sparkA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.70 0.22 45)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.70 0.22 45)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={area} fill="url(#sparkA)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} />
        <motion.path d={path} fill="none" stroke="oklch(0.70 0.22 45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: "easeInOut" }} />
        {pts.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="1.2" fill="oklch(0.70 0.22 45)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 + i * 0.04 }} />
        ))}
      </svg>
    </div>
  );
}