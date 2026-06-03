import { motion } from "motion/react";
import { actions, useStore } from "@/lib/store";
import { t } from "@/lib/i18n";

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
          <div className="font-black text-gradient-primary">{t(lang, "brand")}</div>
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