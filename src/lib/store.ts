import { useSyncExternalStore } from "react";
import type { Lang } from "./i18n";

export type PlanName = "Starter" | "Pro" | "Max" | "Custom";
export type Status = "active" | "pending" | "paused";

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  city?: string;
  country: string;
  plan: PlanName;
  fields: string[];
  maxFields: number;
  maxPerDay: number;
  price: number;
  currency: string;
  sentToday: number;
  password: string;
  status: Status;
}

export const COUNTRIES = [
  "Bahrain", "UAE", "Saudi Arabia", "Pakistan", "India",
  "UK", "USA", "Kuwait", "Qatar", "Oman",
] as const;

export const CURRENCY: Record<string, string> = {
  Bahrain: "BD", UAE: "AED", "Saudi Arabia": "SAR", Pakistan: "PKR", India: "INR",
  UK: "GBP", USA: "USD", Kuwait: "KWD", Qatar: "QAR", Oman: "OMR",
};

export const PRESET_FIELDS = [
  "Software Engineer","Data Analyst","Accountant","HR Manager","Marketing",
  "Sales","Teacher","Nurse","Driver","Cashier","Receptionist","Waiter","Cook",
  "Security Guard","Cleaner","Salesman","Customer Service","IT Support",
  "Graphic Designer","Civil Engineer","Electrician","Plumber","Carpenter",
  "Mechanic","Mason",
];

export interface PackagePlan {
  name: "Starter" | "Pro" | "Max";
  maxFields: number;
  maxPerDay: number;
  prices: Record<string, number>;
}

export const DEFAULT_PACKAGES: PackagePlan[] = [
  {
    name: "Starter", maxFields: 3, maxPerDay: 10,
    prices: { Bahrain: 3, UAE: 12, "Saudi Arabia": 12, Pakistan: 400, India: 250, UK: 3, USA: 4, Kuwait: 2, Qatar: 20, Oman: 1.5 },
  },
  {
    name: "Pro", maxFields: 5, maxPerDay: 20,
    prices: { Bahrain: 5, UAE: 20, "Saudi Arabia": 20, Pakistan: 700, India: 450, UK: 5, USA: 7, Kuwait: 3.5, Qatar: 32, Oman: 2.5 },
  },
  {
    name: "Max", maxFields: 8, maxPerDay: 30,
    prices: { Bahrain: 7, UAE: 28, "Saudi Arabia": 28, Pakistan: 1000, India: 650, UK: 7, USA: 10, Kuwait: 5, Qatar: 45, Oman: 4 },
  },
];

interface AppState {
  lang: Lang;
  clients: Client[];
  packages: PackagePlan[];
  selectedPlan: PlanName;
  alertFreq: number;
  sessionType: "none" | "admin" | "client";
  sessionClientId?: string;
}

const STORAGE_KEY = "jas_state_v1";

const seed: Client[] = [
  {
    id: "c1", name: "Ahmed Khan", whatsapp: "97333001234", email: "ahmed@email.com",
    country: "Bahrain", plan: "Pro", fields: ["Software Engineer", "HR Manager"],
    maxFields: 5, maxPerDay: 20, price: 5, currency: "BD", sentToday: 18,
    password: "client123", status: "active",
  },
  {
    id: "c2", name: "Sara Malik", whatsapp: "97332009876",
    country: "Bahrain", plan: "Starter", fields: ["Cashier", "Salesman", "Cook"],
    maxFields: 3, maxPerDay: 10, price: 3, currency: "BD", sentToday: 8,
    password: "sara123", status: "active",
  },
  {
    id: "p1", name: "Fatima Akhtar", whatsapp: "97332115566", email: "fatima@email.com",
    country: "Bahrain", plan: "Pro", fields: ["Accountant", "HR Manager"],
    maxFields: 5, maxPerDay: 20, price: 5, currency: "BD", sentToday: 0,
    password: "fatima123", status: "pending",
  },
  {
    id: "p2", name: "Zaid Khan", whatsapp: "97333399887",
    country: "Bahrain", plan: "Starter", fields: ["Driver", "Security Guard"],
    maxFields: 3, maxPerDay: 10, price: 3, currency: "BD", sentToday: 0,
    password: "zaid123", status: "pending",
  },
];

const initial: AppState = {
  lang: "EN",
  clients: seed,
  packages: DEFAULT_PACKAGES,
  selectedPlan: "Starter",
  alertFreq: 10,
  sessionType: "none",
};

let state: AppState = initial;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...initial, ...parsed, sessionType: "none", sessionClientId: undefined };
    }
  } catch { /* ignore */ }
}
let loaded = false;

function persist() {
  if (typeof window === "undefined") return;
  const { sessionType: _s, sessionClientId: _c, ...rest } = state;
  void _s; void _c;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
}

function setState(updater: (s: AppState) => AppState) {
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  if (!loaded) { load(); loaded = true; }
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  if (!loaded && typeof window !== "undefined") { load(); loaded = true; }
  return state;
}
function getServerSnapshot() { return initial; }

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const actions = {
  setLang(lang: Lang) { setState((s) => ({ ...s, lang })); },
  loginAdmin() { setState((s) => ({ ...s, sessionType: "admin" })); },
  loginClient(id: string) { setState((s) => ({ ...s, sessionType: "client", sessionClientId: id })); },
  logout() { setState((s) => ({ ...s, sessionType: "none", sessionClientId: undefined })); },
  tryLogin(emailOrWa: string, password: string): "admin" | "client" | null {
    const v = emailOrWa.trim().toLowerCase();
    if (v === "admin@jobalertservice.com" && password === "jobalertserviceadmin@123") {
      this.loginAdmin();
      return "admin";
    }
    const client = state.clients.find(
      (c) =>
        (c.email?.toLowerCase() === v || c.whatsapp === emailOrWa.trim()) &&
        c.password === password,
    );
    if (client) { this.loginClient(client.id); return "client"; }
    return null;
  },
  addClient(c: Omit<Client, "id" | "sentToday" | "status"> & { status?: Status }) {
    const id = "c_" + Math.random().toString(36).slice(2, 9);
    const newClient: Client = { ...c, id, sentToday: 0, status: c.status ?? "pending" };
    setState((s) => ({ ...s, clients: [newClient, ...s.clients] }));
    return newClient;
  },
  updateClient(id: string, patch: Partial<Client>) {
    setState((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  },
  removeClient(id: string) {
    setState((s) => ({ ...s, clients: s.clients.filter((c) => c.id !== id) }));
  },
  approveClient(id: string) { this.updateClient(id, { status: "active" }); },
  togglePause(id: string) {
    const c = state.clients.find((x) => x.id === id);
    if (!c) return;
    this.updateClient(id, { status: c.status === "active" ? "paused" : "active" });
  },
  setSelectedPlan(plan: PlanName) { setState((s) => ({ ...s, selectedPlan: plan })); },
  setAlertFreq(alertFreq: number) { setState((s) => ({ ...s, alertFreq })); },
  signup(data: { name?: string; phone?: string; email?: string; country?: string; fields: string[]; plan: PlanName; alerts?: string }) {
    const country = data.country || "Bahrain";
    const pkg = state.packages.find((p) => p.name === data.plan) ?? state.packages[0];
    return this.addClient({
      name: data.name,
      whatsapp: data.phone,
      email: data.email || undefined,
      country,
      plan: pkg.name,
      fields: data.fields,
      maxFields: pkg.maxFields,
      maxPerDay: Number(data.alerts) || state.alertFreq,
      price: pkg.prices[country] ?? pkg.prices.Bahrain,
      currency: CURRENCY[country] ?? CURRENCY.Bahrain,
      password: "client" + Math.random().toString(36).slice(2, 6),
      status: "pending",
    });
  },
  updatePackages(pkgs: PackagePlan[]) { setState((s) => ({ ...s, packages: pkgs })); },
};