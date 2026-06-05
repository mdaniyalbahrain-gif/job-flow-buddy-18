import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "motion/react";
import { toast } from "sonner";
import { actions, COUNTRIES, CURRENCY, PRESET_FIELDS, useStore, type Client, type PlanName, type PackagePlan } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Slider as UiSlider } from "@/components/ui/slider";
import { Logo } from "./Logo";

type Page = "dashboard" | "live" | "clients" | "pending" | "analytics" | "add" | "packages";

export function AdminPanel() {
  const s = useStore();
  const lang = s.lang;
  const [page, setPage] = useState<Page>("dashboard");
  const pendingCount = s.clients.filter((c) => c.status === "pending").length;

  const items: { k: Page; e: string; l: string; b?: number }[] = [
    { k: "dashboard", e: "📊", l: t(lang, "dashboard") },
    { k: "live", e: "🛰️", l: "Live Jobs" },
    { k: "clients", e: "👥", l: t(lang, "allClients") },
    { k: "pending", e: "⏳", l: t(lang, "pending"), b: pendingCount },
    { k: "analytics", e: "📈", l: t(lang, "analytics") },
    { k: "add", e: "➕", l: t(lang, "addClient") },
    { k: "packages", e: "📦", l: t(lang, "packages") },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex flex-col w-60 border-r border-border p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-8">
          <Logo size="md" reveal />
          <div>
            <div className="font-black text-sm text-gradient-primary animate-gradient">{t(lang, "brand")}</div>
            <div className="text-[10px] px-1.5 py-0.5 inline-block rounded bg-accent text-accent-foreground font-bold">ADMIN</div>
          </div>
        </div>
        <nav className="space-y-1 flex-1">
          {items.map((it) => (
            <button key={it.k} onClick={() => setPage(it.k)} className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition ${page === it.k ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              <span className="flex items-center gap-2">{it.e} {it.l}</span>
              {it.b ? <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground">{it.b}</span> : null}
            </button>
          ))}
        </nav>
        <button onClick={actions.logout} className="w-full px-3 py-2 rounded-lg border border-border hover:bg-secondary text-sm">{t(lang, "logout")}</button>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <div className="md:hidden flex gap-2 overflow-x-auto mb-4 pb-2">
          {items.map((it) => (
            <button key={it.k} onClick={() => setPage(it.k)} className={`px-3 py-1.5 rounded-lg text-sm border whitespace-nowrap ${page === it.k ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>{it.e} {it.l}</button>
          ))}
          <button onClick={actions.logout} className="px-3 py-1.5 rounded-lg border border-border text-sm">{t(lang, "logout")}</button>
        </div>
        <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {page === "dashboard" && <Dashboard />}
          {page === "live" && <LiveJobs />}
          {page === "clients" && <AllClients />}
          {page === "pending" && <Pending />}
          {page === "analytics" && <Analytics />}
          {page === "add" && <AddForm />}
          {page === "packages" && <Packages />}
        </motion.div>
      </main>
    </div>
  );
}

function Dashboard() {
  const s = useStore();
  const active = s.clients.filter((c) => c.status === "active");
  const pending = s.clients.filter((c) => c.status === "pending");
  const revenue = active.reduce((acc, c) => acc + c.price, 0);
  const jobsToday = active.reduce((acc, c) => acc + c.sentToday, 0);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Clients" value={active.length} />
        <StatCard label="Jobs Sent Today" value={jobsToday} />
        <StatCard label="Revenue (BD est.)" value={revenue.toFixed(1)} />
        <StatCard label="Pending Approvals" value={pending.length} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-bold mb-4">Quick Add Client</h3>
          <AddForm compact />
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-bold mb-4">Plans Summary</h3>
          <div className="space-y-2">
            {(["Starter","Pro","Max","Custom"] as PlanName[]).map((p) => (
              <div key={p} className="flex justify-between p-3 rounded-lg bg-secondary/50">
                <span>{p}</span>
                <span className="font-bold text-primary">{s.clients.filter((c) => c.plan === p).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-card border border-border shadow-card">
      <div className="text-3xl font-black text-gradient-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

function AllClients() {
  const s = useStore();
  const [planF, setPlanF] = useState("all");
  const [countryF, setCountryF] = useState("all");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Client | null>(null);

  const filtered = s.clients.filter((c) =>
    (planF === "all" || c.plan === planF) &&
    (countryF === "all" || c.country === countryF) &&
    (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.whatsapp.includes(q)),
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">All Clients</h1>
      <div className="flex flex-wrap gap-2">
        <select value={planF} onChange={(e) => setPlanF(e.target.value)} className="bg-input border border-border rounded-lg px-3 h-10 text-sm">
          <option value="all">All plans</option>
          {["Starter","Pro","Max","Custom"].map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={countryF} onChange={(e) => setCountryF(e.target.value)} className="bg-input border border-border rounded-lg px-3 h-10 text-sm">
          <option value="all">All countries</option>
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 min-w-[180px] bg-input border border-border rounded-lg px-3 h-10 text-sm" />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr>
              {["Name","WhatsApp","Email","Country","Fields","Plan","Today/Max","Price","Status",""].map((h) => <th key={h} className="p-3 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-semibold">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.whatsapp}</td>
                <td className="p-3 text-muted-foreground">{c.email || "—"}</td>
                <td className="p-3">{c.country}</td>
                <td className="p-3">{c.fields.length}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-xs">{c.plan}</span></td>
                <td className="p-3">{c.sentToday}/{c.maxPerDay}</td>
                <td className="p-3">{c.currency} {c.price}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${c.status === "active" ? "bg-success/20 text-success" : c.status === "pending" ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
                </td>
                <td className="p-3 flex gap-1">
                  <button onClick={() => setEdit(c)} className="px-2 py-1 rounded bg-secondary text-xs hover:bg-secondary/70">Edit</button>
                  <button onClick={() => { actions.togglePause(c.id); toast.success(c.status === "active" ? "Paused" : "Resumed"); }} className="px-2 py-1 rounded bg-secondary text-xs hover:bg-secondary/70">{c.status === "active" ? "Pause" : "Resume"}</button>
                  <button onClick={() => { if (confirm("Remove?")) { actions.removeClient(c.id); toast.success("Removed"); } }} className="px-2 py-1 rounded bg-destructive/15 text-destructive text-xs hover:bg-destructive/30">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {edit && <EditModal client={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function EditModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const [c, setC] = useState<Client>(client);
  const save = () => { actions.updateClient(c.id, c); toast.success("Saved"); onClose(); };
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg p-6 rounded-2xl bg-card border border-border shadow-card space-y-3">
        <h3 className="font-bold text-lg">Edit Client</h3>
        <input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} className="w-full bg-input border border-border rounded-lg px-3 h-10 text-sm" />
        <input value={c.whatsapp} onChange={(e) => setC({ ...c, whatsapp: e.target.value })} className="w-full bg-input border border-border rounded-lg px-3 h-10 text-sm" />
        <input value={c.email || ""} onChange={(e) => setC({ ...c, email: e.target.value })} className="w-full bg-input border border-border rounded-lg px-3 h-10 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <select value={c.plan} onChange={(e) => setC({ ...c, plan: e.target.value as PlanName })} className="bg-input border border-border rounded-lg px-3 h-10 text-sm">
            {["Starter","Pro","Max","Custom"].map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={c.country} onChange={(e) => setC({ ...c, country: e.target.value, currency: CURRENCY[e.target.value] })} className="bg-input border border-border rounded-lg px-3 h-10 text-sm">
            {COUNTRIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <UiSlider aria-label={`Max Fields: ${c.maxFields}`} min={1} max={15} value={[c.maxFields]} onValueChange={([v]) => setC({ ...c, maxFields: v })} />
        <UiSlider aria-label={`Max Jobs/Day: ${c.maxPerDay}`} min={5} max={50} step={5} value={[c.maxPerDay]} onValueChange={([v]) => setC({ ...c, maxPerDay: v })} />
        <input type="number" value={c.price} onChange={(e) => setC({ ...c, price: Number(e.target.value) })} className="w-full bg-input border border-border rounded-lg px-3 h-10 text-sm" />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm">Cancel</button>
          <button onClick={save} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold">Save</button>
        </div>
      </div>
    </div>
  );
}

function Pending() {
  const s = useStore();
  const pending = s.clients.filter((c) => c.status === "pending");
  const approve = (c: Client) => {
    actions.approveClient(c.id);
    toast.success(`✓ ${c.name} approved`);
  };
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Pending Approvals</h1>
      {pending.length === 0 && <div className="p-6 rounded-2xl bg-card border border-border text-muted-foreground text-center">No pending clients</div>}
      <div className="grid sm:grid-cols-2 gap-4">
        {pending.map((c) => (
          <motion.div key={c.id} layout className="p-5 rounded-2xl bg-card border border-border shadow-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold">{c.name}</div>
                <div className="text-sm text-muted-foreground">{c.whatsapp} {c.email && `· ${c.email}`}</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-warning/20 text-warning">{c.plan}</span>
            </div>
            <div className="mt-3 text-sm">📍 {c.country} · {c.fields.length} fields</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {c.fields.map((f) => <span key={f} className="text-xs px-2 py-0.5 rounded bg-secondary">{f}</span>)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground italic">Payment screenshot pending on WhatsApp</div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => approve(c)} className="flex-1 py-2 rounded-lg bg-success text-primary-foreground font-bold text-sm">✓ Approve</button>
              <button onClick={() => { actions.removeClient(c.id); toast.success("Rejected"); }} className="flex-1 py-2 rounded-lg bg-destructive/20 text-destructive font-bold text-sm">✗ Reject</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const s = useStore();
  const active = s.clients.filter((c) => c.status === "active");
  const revenue = active.reduce((acc, c) => acc + c.price, 0);
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const heights = useMemo(() => days.map(() => 30 + Math.floor(Math.random() * 70)), []);
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = (today + 6) % 7;
  const byCountry: Record<string, number> = {};
  active.forEach((c) => { byCountry[c.country] = (byCountry[c.country] || 0) + c.price; });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Analytics</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sent" value="2,841" />
        <StatCard label="Active" value={active.length} />
        <StatCard label="Cancelled" value={1} />
        <StatCard label="Revenue (BD)" value={revenue.toFixed(1)} />
      </div>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h3 className="font-bold mb-4">Jobs Sent — Last 7 Days</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {days.map((d, i) => (
            <div key={d} className="flex-1 flex flex-col items-center gap-2">
              <motion.div initial={{ height: 0 }} animate={{ height: `${heights[i]}%` }} className={`w-full rounded-t-lg ${i === todayIdx ? "bg-accent" : "bg-primary/60"}`} />
              <span className="text-xs text-muted-foreground">{d}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h3 className="font-bold mb-4">Revenue by Country</h3>
        <div className="space-y-2">
          {Object.entries(byCountry).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm p-2 rounded bg-secondary/50">
              <span>{k}</span><span className="font-bold text-primary">{CURRENCY[k]} {v.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddForm({ compact = false }: { compact?: boolean }) {
  const s = useStore();
  const [name, setName] = useState(""); const [wa, setWa] = useState(""); const [email, setEmail] = useState("");
  const [country, setCountry] = useState<string>("Bahrain");
  const [plan, setPlan] = useState<PlanName>("Starter");
  const [maxF, setMaxF] = useState(3); const [maxD, setMaxD] = useState(10);
  const [fields, setFields] = useState<string[]>([]);

  const pkg = s.packages.find((p) => p.name === plan);
  const price = pkg?.prices[country] ?? Math.round((maxF * 0.7 + maxD * 0.15) * 10) / 10;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !wa) { toast.error("Name + WhatsApp required"); return; }
    actions.addClient({
      name, whatsapp: wa, email: email || undefined,
      country, plan, fields,
      maxFields: pkg?.maxFields ?? maxF,
      maxPerDay: pkg?.maxPerDay ?? maxD,
      price, currency: CURRENCY[country],
      password: "client" + Math.random().toString(36).slice(2, 6),
      status: "active",
    });
    toast.success("✓ Client added & activated");
    setName(""); setWa(""); setEmail(""); setFields([]);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {!compact && <h1 className="text-3xl font-black">Add Client</h1>}
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" className="bg-input border border-border rounded-lg px-3 h-10 text-sm" />
        <input value={wa} onChange={(e) => setWa(e.target.value)} placeholder="WhatsApp *" className="bg-input border border-border rounded-lg px-3 h-10 text-sm" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="bg-input border border-border rounded-lg px-3 h-10 text-sm" />
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-input border border-border rounded-lg px-3 h-10 text-sm">
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={plan} onChange={(e) => setPlan(e.target.value as PlanName)} className="bg-input border border-border rounded-lg px-3 h-10 text-sm">
          {["Starter","Pro","Max","Custom"].map((p) => <option key={p}>{p}</option>)}
        </select>
        <div className="text-sm flex items-center">Price: <span className="ml-2 font-bold text-primary">{CURRENCY[country]} {price}</span></div>
      </div>
      {plan === "Custom" && (
        <div className="grid sm:grid-cols-2 gap-3 p-3 rounded-lg bg-secondary/50">
          <UiSlider aria-label={`Max Fields: ${maxF}`} min={1} max={15} value={[maxF]} onValueChange={([v]) => setMaxF(v)} />
          <UiSlider aria-label={`Max Jobs/Day: ${maxD}`} min={5} max={50} step={5} value={[maxD]} onValueChange={([v]) => setMaxD(v)} />
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {PRESET_FIELDS.map((f) => {
          const on = fields.includes(f);
          return <button type="button" key={f} onClick={() => setFields(on ? fields.filter((x) => x !== f) : [...fields, f])} className={`px-2.5 py-1 rounded-full text-xs border ${on ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>{f}</button>;
        })}
      </div>
      <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold">✓ Add & Activate</button>
    </form>
  );
}

function Packages() {
  const s = useStore();
  const [pkgs, setPkgs] = useState<PackagePlan[]>(s.packages);
  const update = (i: number, patch: Partial<PackagePlan>) => {
    const next = pkgs.map((p, idx) => idx === i ? { ...p, ...patch } : p);
    setPkgs(next);
  };
  const updatePrice = (i: number, country: string, val: number) => {
    const next = pkgs.map((p, idx) => idx === i ? { ...p, prices: { ...p.prices, [country]: val } } : p);
    setPkgs(next);
  };
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Packages</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {pkgs.map((p, i) => (
          <div key={p.name} className="p-5 rounded-2xl bg-card border border-border shadow-card space-y-3">
            <div className="font-bold text-lg">{p.name}</div>
            <label className="text-xs">Max Fields
              <input type="number" value={p.maxFields} onChange={(e) => update(i, { maxFields: Number(e.target.value) })} className="mt-1 w-full bg-input border border-border rounded-lg px-2 h-9 text-sm" />
            </label>
            <label className="text-xs">Max Jobs/Day
              <input type="number" value={p.maxPerDay} onChange={(e) => update(i, { maxPerDay: Number(e.target.value) })} className="mt-1 w-full bg-input border border-border rounded-lg px-2 h-9 text-sm" />
            </label>
            {["Bahrain","UAE","Pakistan"].map((c) => (
              <label key={c} className="text-xs">Price {CURRENCY[c]}
                <input type="number" value={p.prices[c]} onChange={(e) => updatePrice(i, c, Number(e.target.value))} className="mt-1 w-full bg-input border border-border rounded-lg px-2 h-9 text-sm" />
              </label>
            ))}
          </div>
        ))}
      </div>
      <button onClick={() => { actions.updatePackages(pkgs); toast.success("💾 Saved"); }} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold">💾 Save Package Changes</button>
    </div>
  );
}

/* ====================== LIVE JOBS ====================== */

function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));
  useEffect(() => {
    const controls = animate(mv, to, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [to, mv]);
  return <motion.span>{rounded}</motion.span>;
}

const JOB_TITLES = [
  "Senior Frontend Engineer", "Accountant", "Marketing Manager", "DevOps Engineer",
  "UI/UX Designer", "Sales Executive", "Project Manager", "Data Analyst",
  "HR Specialist", "Customer Support Lead", "iOS Developer", "Civil Engineer",
  "Chef de Partie", "Receptionist", "Procurement Officer", "Cyber Security Analyst",
];
const JOB_COMPANIES = ["Aramco", "Emirates NBD", "Batelco", "Zain", "Etisalat", "Careem", "Talabat", "STC", "Almosafer", "PwC", "KPMG", "Noon"];
const JOB_CITIES = ["Manama", "Dubai", "Riyadh", "Doha", "Kuwait City", "Abu Dhabi", "Muscat", "Jeddah", "Karachi"];
const JOB_SOURCES = ["LinkedIn", "Indeed", "Bayt", "Google Jobs", "Naukrigulf", "GulfTalent"];

type LiveJob = { id: number; title: string; company: string; city: string; source: string; salary: string; ts: number };

function makeJob(id: number): LiveJob {
  const r = (a: string[]) => a[Math.floor(Math.random() * a.length)];
  return {
    id,
    title: r(JOB_TITLES),
    company: r(JOB_COMPANIES),
    city: r(JOB_CITIES),
    source: r(JOB_SOURCES),
    salary: `${(500 + Math.floor(Math.random() * 35) * 100)} ${r(["BHD","AED","SAR","USD"])}`,
    ts: Date.now(),
  };
}

function LiveJobs() {
  const idRef = useRef(1);
  const [jobs, setJobs] = useState<LiveJob[]>(() => Array.from({ length: 6 }).map(() => makeJob(idRef.current++)));
  const [total, setTotal] = useState(2841);
  const [perMin, setPerMin] = useState(12);
  const [activeFeeds, setActiveFeeds] = useState(10);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setJobs((prev) => [makeJob(idRef.current++), ...prev].slice(0, 12));
      setTotal((t) => t + 1);
      setPerMin((p) => Math.max(6, Math.min(30, p + (Math.random() > 0.5 ? 1 : -1))));
      setActiveFeeds((a) => Math.max(8, Math.min(14, a + (Math.random() > 0.5 ? 0 : 1) - (Math.random() > 0.7 ? 1 : 0))));
    }, 2200);
    return () => clearInterval(id);
  }, [paused]);

  const sourceCounts = JOB_SOURCES.map((src) => ({
    src,
    count: jobs.filter((j) => j.source === src).length,
  }));
  const maxSrc = Math.max(1, ...sourceCounts.map((s) => s.count));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            Live Jobs
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-success/15 text-success font-bold">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" /> LIVE
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time feed across 10+ job platforms</p>
        </div>
        <button onClick={() => setPaused((p) => !p)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary btn-elastic">
          {paused ? "▶ Resume Feed" : "⏸ Pause Feed"}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveStat label="Total Jobs Captured" value={total} accent="primary" />
        <LiveStat label="Jobs / Minute" value={perMin} accent="accent" />
        <LiveStat label="Active Feeds" value={activeFeeds} accent="success" />
        <LiveStat label="Showing Now" value={jobs.length} accent="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-card relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Incoming Jobs</h3>
              <span className="text-xs text-muted-foreground">Auto-updating every ~2s</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {jobs.map((j, i) => (
                  <motion.div
                    key={j.id}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.96, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 30, filter: "blur(6px)" }}
                    transition={{ type: "spring", stiffness: 220, damping: 24 }}
                    className="flex items-center gap-3 p-3 rounded-xl glass hover-lift"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground font-black shadow-glow">
                      {j.company[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{j.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{j.company} · {j.city} · {j.source}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-primary">{j.salary}</div>
                      {i === 0 && <div className="text-[10px] text-success font-bold">NEW</div>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
            <h3 className="font-bold mb-4">Sources Activity</h3>
            <div className="space-y-3">
              {sourceCounts.map((s) => (
                <div key={s.src}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">{s.src}</span>
                    <span className="text-muted-foreground"><Counter to={s.count} /></span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary-glow"
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.count / maxSrc) * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-card text-center">
            <h3 className="font-bold mb-3">Feed Health</h3>
            <RingProgress value={Math.min(100, perMin * 4)} />
            <div className="text-xs text-muted-foreground mt-2">Throughput score</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveStat({ label, value, accent }: { label: string; value: number; accent: "primary" | "accent" | "success" | "warning" }) {
  const tone =
    accent === "primary" ? "from-primary to-primary-glow" :
    accent === "accent" ? "from-accent to-primary" :
    accent === "success" ? "from-success to-primary-glow" :
    "from-warning to-primary";
  return (
    <motion.div whileHover={{ y: -4 }} className="relative p-5 rounded-2xl bg-card border border-border shadow-card overflow-hidden group">
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${tone} opacity-20 blur-2xl group-hover:opacity-40 transition`} />
      <div className="relative">
        <div className={`text-3xl font-black bg-gradient-to-r ${tone} bg-clip-text text-transparent`}>
          <Counter to={value} />
        </div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

function RingProgress({ value }: { value: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} stroke="var(--color-secondary)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="50" cy="50" r={r}
          stroke="url(#ringG)"
          strokeWidth="10" fill="none" strokeLinecap="round"
          initial={{ strokeDasharray: c, strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        />
        <defs>
          <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.70 0.22 45)" />
            <stop offset="100%" stopColor="oklch(0.78 0.18 55)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center font-black text-xl text-gradient-primary">
        <Counter to={Math.round(value)} />%
      </div>
    </div>
  );
}
