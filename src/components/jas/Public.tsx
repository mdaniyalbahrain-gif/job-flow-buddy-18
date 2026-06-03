import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Lang, RTL_LANGS, LANGS, t } from "@/lib/i18n";
import { actions, COUNTRIES, CURRENCY, PRESET_FIELDS, useStore, type PlanName } from "@/lib/store";

const WA = "https://wa.me/97333740941";
const PLATFORMS = ["LinkedIn Jobs","Indeed","Glassdoor","Bayt.com","Naukrigulf","GulfTalent","Google Jobs","ZipRecruiter","Monster","Jooble"];

function useCountUp(target: number, duration = 1800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

export function PublicScreen({ onLogin }: { onLogin: () => void }) {
  const s = useStore();
  const lang = s.lang;
  const isRTL = RTL_LANGS.includes(lang);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen">
      <Navbar lang={lang} onLogin={onLogin} />
      <Hero lang={lang} />
      <Stats lang={lang} />
      <Marquee />
      <HowItWorks lang={lang} />
      <Pricing lang={lang} />
      <Testimonials lang={lang} />
      <LiveFeed lang={lang} />
      <SignupForm lang={lang} />
      <FAQ lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />
      <FloatingWA />
    </div>
  );
}

function Navbar({ lang, onLogin }: { lang: Lang; onLogin: () => void }) {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground">J</span>
          <span className="hidden sm:inline text-gradient-primary">{t(lang, "brand")}</span>
        </a>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <button onClick={onLogin} className="px-4 h-9 rounded-lg border border-border hover:bg-secondary transition">{t(lang, "login")}</button>
          <a href="#signup" className="px-4 h-9 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition flex items-center">{t(lang, "getAlerts")}</a>
        </div>
      </div>
    </nav>
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

function Hero({ lang }: { lang: Lang }) {
  return (
    <section id="top" className="relative overflow-hidden bg-hero bg-mesh">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/30 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-accent/40 blur-3xl animate-blob" style={{ animationDelay: "-6s" }} />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full bg-primary-glow/30 blur-3xl animate-blob" style={{ animationDelay: "-12s" }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 backdrop-blur border border-primary/30 text-sm mb-6 shadow-card">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" /> {t(lang, "badge")}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 80 }} className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05]">
          <span className="block">{t(lang, "h1a")}</span>
          <span className="block text-gradient-primary animate-gradient">{t(lang, "h1b")}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          {t(lang, "sub")}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex flex-wrap justify-center gap-3">
          <motion.a whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.97 }} href="#signup" className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-glow animate-glow-pulse">{t(lang, "ctaStart")}</motion.a>
          <motion.a whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} href="#pricing" className="px-7 py-3.5 rounded-xl border-2 border-primary/40 bg-card/60 backdrop-blur hover:bg-card transition">{t(lang, "viewPlans")}</motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function Stats({ lang }: { lang: Lang }) {
  const subs = useCountUp(500);
  const jobs = useCountUp(52000);
  const countries = useCountUp(15);
  const [watch, setWatch] = useState(180);
  useEffect(() => {
    const id = setInterval(() => setWatch(Math.floor(85 + Math.random() * 235)), 3500);
    return () => clearInterval(id);
  }, []);
  const items = [
    { v: `${subs}+`, l: t(lang, "activeSubs") },
    { v: `${jobs.toLocaleString()}+`, l: t(lang, "jobsSent") },
    { v: `${countries}+`, l: t(lang, "countries") },
    { v: "<1 MIN", l: t(lang, "alertSpeed") },
    { v: watch, l: t(lang, "watching"), pulse: true },
  ];
  return (
    <section className="border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        {items.map((it, i) => (
          <div key={i}>
            <div className="text-2xl md:text-3xl font-black text-gradient-primary flex items-center justify-center gap-2">
              {it.pulse && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse-dot" />}
              {it.v}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{it.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...PLATFORMS, ...PLATFORMS];
  return (
    <div className="overflow-hidden py-6 border-b border-border">
      <div className="flex gap-12 animate-marquee w-max">
        {items.map((p, i) => (
          <div key={i} className="text-muted-foreground text-sm font-medium whitespace-nowrap flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function HowItWorks({ lang }: { lang: Lang }) {
  const steps = [
    { n: "01", e: "📋", t: t(lang, "step1t"), d: t(lang, "step1d") },
    { n: "02", e: "💳", t: t(lang, "step2t"), d: t(lang, "step2d") },
    { n: "03", e: "✅", t: t(lang, "step3t"), d: t(lang, "step3d") },
    { n: "04", e: "📨", t: t(lang, "step4t"), d: t(lang, "step4d") },
  ];
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12">{t(lang, "howItWorks")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition shadow-card">
              <div className="text-xs text-primary font-bold">{s.n}</div>
              <div className="text-4xl my-3">{s.e}</div>
              <div className="font-bold">{s.t}</div>
              <div className="text-sm text-muted-foreground mt-2">{s.d}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ lang }: { lang: Lang }) {
  const s = useStore();
  const [country, setCountry] = useState<string>("Bahrain");
  return (
    <section id="pricing" className="py-20 px-6 bg-card/30 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-3">{t(lang, "pricing")}</h2>
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {COUNTRIES.map((c) => (
            <button key={c} onClick={() => setCountry(c)} className={`px-3 py-1.5 rounded-lg border text-sm transition ${country === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>{c}</button>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {s.packages.map((p) => {
            const isPro = p.name === "Pro";
            const emoji = p.name === "Starter" ? "🌱" : p.name === "Pro" ? "⚡" : "👑";
            return (
              <motion.div key={p.name} whileHover={{ y: -6 }} className={`relative p-7 rounded-2xl bg-card border-2 shadow-card ${isPro ? "border-primary shadow-glow" : "border-border"}`}>
                {isPro && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">{t(lang, "popular")}</div>}
                <div className="text-3xl">{emoji}</div>
                <div className="mt-2 text-xl font-bold">{p.name}</div>
                <div className="mt-4 text-4xl font-black">
                  {CURRENCY[country]} {p.prices[country]}
                  <span className="text-sm text-muted-foreground font-normal">/mo</span>
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  <li>✓ {t(lang, "fields")}: {p.maxFields}</li>
                  <li>✓ {t(lang, "alertsPerDay")}: {p.maxPerDay}</li>
                  <li>✓ WhatsApp + Email</li>
                  {p.name === "Pro" && <li>✓ Priority matching</li>}
                  {p.name === "Max" && <><li>✓ Instant &lt;1min</li><li>✓ 24/7 support</li></>}
                </ul>
                <a href="#signup" onClick={() => { (document.getElementById("plan-select") as HTMLSelectElement | null)?.setAttribute("data-preselect", p.name); }} className="mt-6 block text-center px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
                  {p.name === "Starter" ? t(lang, "getStarter") : p.name === "Pro" ? t(lang, "getPro") : t(lang, "getMax")}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ lang }: { lang: Lang }) {
  const items = [
    { i: "MK", n: "Mohammed K.", p: "Pro · Bahrain", j: "✅ Hired as Software Engineer", q: "Got a job offer in 3 days! Alerts are instant." },
    { i: "FA", n: "Fatima A.", p: "Pro · Bahrain", j: "✅ Hired as Accountant", q: "Best money I ever spent. Jobs came instantly!" },
    { i: "HN", n: "Hina N.", p: "Pro · Saudi Arabia", j: "✅ Hired as HR Manager", q: "Cancelled because I got my dream job!" },
  ];
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12">{t(lang, "testimonials")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center font-bold text-primary-foreground">{it.i}</div>
                <div>
                  <div className="font-bold">{it.n}</div>
                  <div className="text-xs text-muted-foreground">{it.p}</div>
                </div>
              </div>
              <div className="text-xs text-primary mt-3">{it.j}</div>
              <p className="mt-3 text-sm">"{it.q}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveFeed({ lang }: { lang: Lang }) {
  const seed = useMemo(() => [
    { t: "Data Analyst", c: "Bahrain", n: "Omar" },
    { t: "Teacher", c: "UAE", n: "Aisha" },
    { t: "Driver", c: "Saudi Arabia", n: "Tariq" },
    { t: "Nurse", c: "UK", n: "Hina" },
    { t: "Cook", c: "Pakistan", n: "Bilal" },
  ], []);
  const [items, setItems] = useState(seed.slice(0, 3));
  const idx = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      idx.current = (idx.current + 1) % seed.length;
      setItems((prev) => [seed[idx.current], ...prev].slice(0, 6));
    }, 8000);
    return () => clearInterval(id);
  }, [seed]);
  return (
    <section className="py-16 px-6 bg-card/30 border-y border-border">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">{t(lang, "liveAlerts")}</h3>
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((it, i) => (
              <motion.div key={`${it.n}-${i}-${idx.current}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-3 rounded-lg bg-card border border-border flex items-center justify-between text-sm">
                <span><span className="text-primary font-semibold">{it.t}</span> — {it.c} → {it.n}</span>
                <span className="text-muted-foreground text-xs">now</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function SignupForm({ lang }: { lang: Lang }) {
  const s = useStore();
  const [name, setName] = useState("");
  const [wa, setWa] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState<string>("Bahrain");
  const [plan, setPlan] = useState<PlanName>("Starter");
  const [fields, setFields] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [customFields, setCustomFields] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [customMax, setCustomMax] = useState(6);
  const [customJobs, setCustomJobs] = useState(15);

  const limit = plan === "Starter" ? 3 : plan === "Pro" ? 5 : plan === "Max" ? 8 : customMax;
  const pkg = s.packages.find((p) => p.name === plan);
  const price = plan === "Custom"
    ? Math.round((customMax * 0.7 + customJobs * 0.15) * 10) / 10
    : pkg?.prices[country] ?? 0;
  const currency = CURRENCY[country];

  const strength = password.length === 0 ? null : password.length < 8 ? "Weak" : password.length < 12 ? "Medium" : "Strong";
  const strColor = strength === "Weak" ? "text-destructive" : strength === "Medium" ? "text-warning" : "text-success";

  const toggle = (f: string) => {
    if (fields.includes(f)) setFields(fields.filter((x) => x !== f));
    else {
      if (fields.length >= limit) { toast.warning(`⚠️ Max ${limit} fields for this plan`); return; }
      setFields([...fields, f]);
    }
  };

  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    setCustomFields([...customFields, v]);
    setCustom("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !wa || !city || !password) { toast.error("Please fill required fields"); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 chars"); return; }
    actions.addClient({
      name, whatsapp: wa, email: email || undefined, city, country,
      plan, fields, maxFields: limit,
      maxPerDay: plan === "Custom" ? customJobs : pkg?.maxPerDay ?? 10,
      price, currency, password,
    });
    toast.success("✓ Submitted! Login with your email/WhatsApp + password to track status.");
    setName(""); setWa(""); setEmail(""); setCity(""); setFields([]); setPassword("");
  };

  const allFields = [...PRESET_FIELDS, ...customFields];

  return (
    <section id="signup" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-10">{t(lang, "signup")}</h2>
        <form onSubmit={submit} className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-card space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input value={name} onChange={setName} placeholder={t(lang, "fullName") + " *"} />
            <Input value={wa} onChange={setWa} placeholder={t(lang, "whatsappNum") + " *"} />
            <Input value={email} onChange={setEmail} placeholder={t(lang, "email")} helper={t(lang, "emailOpt")} />
            <Input value={city} onChange={setCity} placeholder={t(lang, "city") + " *"} />
            <Select value={country} onChange={setCountry} options={COUNTRIES as unknown as string[]} label={t(lang, "country")} />
            <Select id="plan-select" value={plan} onChange={(v) => setPlan(v as PlanName)} options={["Starter","Pro","Max","Custom"]} label={t(lang, "plan")} />
          </div>
          {plan === "Custom" && (
            <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-secondary/50">
              <Slider label={`Max Fields: ${customMax}`} value={customMax} min={1} max={15} step={1} onChange={setCustomMax} />
              <Slider label={`Max Jobs/Day: ${customJobs}`} value={customJobs} min={5} max={50} step={5} onChange={setCustomJobs} />
              <div className="sm:col-span-2 text-sm">Price: <span className="text-gradient-primary font-bold text-lg">{currency} {price}</span>/mo</div>
            </div>
          )}
          <div>
            <label className="text-sm font-semibold">{t(lang, "jobFields")} ({fields.length}/{limit})</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {allFields.map((f) => {
                const on = fields.includes(f);
                return (
                  <button type="button" key={f} onClick={() => toggle(f)} className={`px-3 py-1 rounded-full text-xs border transition ${on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>{f}</button>
                );
              })}
            </div>
            <div className="flex gap-2 mt-3">
              <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={t(lang, "addCustom")} className="flex-1 bg-input border border-border rounded-lg px-3 h-10 text-sm" />
              <button type="button" onClick={addCustom} className="px-4 rounded-lg bg-secondary border border-border hover:bg-secondary/70 text-sm">{t(lang, "add")}</button>
            </div>
          </div>
          <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t(lang, "password") + " *"} className="w-full bg-input border border-border rounded-lg px-3 h-11 text-sm" />
            {strength && <div className={`text-xs mt-1 ${strColor}`}>{strength}{strength === "Strong" ? " ✓" : ""}</div>}
          </div>
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-sm">
            💳 Payment: Send via Benefit Pay / Bank Transfer, then share screenshot on WhatsApp at <a href={WA} className="text-accent underline">+973 3374 0941</a>. Subscription activates within a few hours.
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-glow hover:scale-[1.01] transition">{t(lang, "submit")}</button>
        </form>
      </div>
    </section>
  );
}

function Input({ value, onChange, placeholder, helper }: { value: string; onChange: (v: string) => void; placeholder: string; helper?: string }) {
  return (
    <div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-input border border-border rounded-lg px-3 h-11 text-sm" />
      {helper && <div className="text-xs text-muted-foreground mt-1">{helper}</div>}
    </div>
  );
}
function Select({ value, onChange, options, label, id }: { value: string; onChange: (v: string) => void; options: string[]; label?: string; id?: string }) {
  return (
    <div>
      {label && <div className="text-xs text-muted-foreground mb-1">{label}</div>}
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 h-11 text-sm">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
export function Slider({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step?: number }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <input type="range" min={min} max={max} step={step ?? 1} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-primary" />
    </div>
  );
}

function FAQ({ lang }: { lang: Lang }) {
  const items = [
    ["How quickly will I receive job alerts?", "Alerts are sent within 1 minute of a job being posted. Our bot checks every 5 minutes, 24/7."],
    ["Which job platforms do you cover?", "LinkedIn, Indeed, Glassdoor, Google Jobs, Bayt.com, Naukrigulf, GulfTalent, ZipRecruiter, Monster, Jooble and more."],
    ["How do I pay?", "Benefit Pay or bank transfer, then share screenshot on WhatsApp at +973 3374 0941. Activates within a few hours."],
    ["Can I change my job fields?", "Yes, WhatsApp us anytime. Changes take effect within 24 hours."],
    ["Is there a free trial?", "No free trial, but Starter is very affordable and you can cancel anytime."],
    ["How do I track my subscription?", "Login with your email/WhatsApp and the password you set during signup."],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 px-6 bg-card/30 border-y border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-10">{t(lang, "faq")}</h2>
        <div className="space-y-3">
          {items.map(([q, a], i) => (
            <div key={i} className="rounded-xl bg-card border border-border overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold">
                {q}<span className="text-primary">{open === i ? "−" : "+"}</span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-4 text-sm text-muted-foreground">{a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ lang }: { lang: Lang }) {
  const [n, setN] = useState(""); const [w, setW] = useState(""); const [m, setM] = useState("");
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`Name: ${n}\nWA: ${w}\n\n${m}`);
    window.open(`${WA}?text=${text}`, "_blank");
  };
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-10">{t(lang, "contact")}</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <a href={WA} target="_blank" rel="noopener" className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition">
            <div className="text-2xl">💬</div>
            <div className="font-bold mt-2">WhatsApp</div>
            <div className="text-sm text-muted-foreground">+973 3374 0941</div>
          </a>
          <a href="mailto:admin@jobalertservice.com" className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition">
            <div className="text-2xl">📧</div>
            <div className="font-bold mt-2">Email</div>
            <div className="text-sm text-muted-foreground">admin@jobalertservice.com</div>
          </a>
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="text-2xl">📍</div>
            <div className="font-bold mt-2">Location</div>
            <div className="text-sm text-muted-foreground">{t(lang, "location")}</div>
          </div>
        </div>
        <form onSubmit={send} className="p-6 rounded-2xl bg-card border border-border shadow-card grid sm:grid-cols-2 gap-3">
          <input value={n} onChange={(e) => setN(e.target.value)} required placeholder={t(lang, "yourName")} className="bg-input border border-border rounded-lg px-3 h-11 text-sm" />
          <input value={w} onChange={(e) => setW(e.target.value)} required placeholder={t(lang, "whatsappNum")} className="bg-input border border-border rounded-lg px-3 h-11 text-sm" />
          <textarea value={m} onChange={(e) => setM(e.target.value)} required rows={4} placeholder={t(lang, "yourMsg")} className="sm:col-span-2 bg-input border border-border rounded-lg px-3 py-2 text-sm" />
          <button className="sm:col-span-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90">{t(lang, "sendMsg")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-bold text-gradient-primary text-lg">{t(lang, "brand")}</div>
          <div className="text-muted-foreground mt-2">Real-time job alerts from 10+ platforms</div>
        </div>
        <div className="flex md:justify-center gap-4 text-muted-foreground">
          <a href="#how">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#">Reviews</a>
          <a href="#">FAQ</a>
        </div>
        <div className="md:text-right text-muted-foreground">
          <div>WhatsApp +973 3374 0941</div>
          <div>admin@jobalertservice.com</div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2024 Job Alert Service · Bahrain · All rights reserved · Created by <a className="text-primary" href="https://www.daniyaldesigner.com" target="_blank" rel="noopener">Daniyaldesigner</a>
      </div>
    </footer>
  );
}

function FloatingWA() {
  return (
    <a href={WA} target="_blank" rel="noopener" className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-success grid place-items-center text-2xl shadow-glow animate-glow-pulse">💬</a>
  );
}