import { useState } from "react";
import { motion } from "motion/react";
import { actions, useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Logo } from "./Logo";

export function LoginScreen({ onBack }: { onBack: () => void }) {
  const s = useStore();
  const lang = s.lang;
  const [emailOrWa, setEmailOrWa] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = actions.tryLogin(emailOrWa, password);
    if (!r) {
      setErr(t(lang, "invalidCreds"));
      setTimeout(() => setErr(""), 3000);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-hero">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-card">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground mb-6">{t(lang, "backToSite")}</button>
        <div className="text-center mb-8 flex flex-col items-center gap-3">
          <Logo size="xl" reveal />
          <div className="text-2xl font-black text-gradient-primary animate-gradient">{t(lang, "brand")}</div>
          <div className="text-sm text-muted-foreground">{t(lang, "accessAcc")}</div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input value={emailOrWa} onChange={(e) => setEmailOrWa(e.target.value)} placeholder={t(lang, "emailOrWa")} className="w-full bg-input border border-border rounded-lg px-3 h-11 text-sm" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t(lang, "password")} className="w-full bg-input border border-border rounded-lg px-3 h-11 text-sm" />
          {err && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm">{err}</motion.div>}
          <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-glow hover:scale-[1.01] transition">{t(lang, "login")}</button>
        </form>
      </motion.div>
    </div>
  );
}