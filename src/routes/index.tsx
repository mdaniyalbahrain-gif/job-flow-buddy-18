import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useStore } from "@/lib/store";
import { RTL_LANGS } from "@/lib/i18n";
import { PublicScreen } from "@/components/jas/Public";
import { LoginScreen } from "@/components/jas/Login";
import { AdminPanel } from "@/components/jas/AdminPanel";
import { ClientDashboard } from "@/components/jas/ClientDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JOB ALERT SERVICE — Real-time Job Alerts on WhatsApp & Email" },
      { name: "description", content: "Bahrain's #1 job alert service. Real-time alerts from LinkedIn, Indeed, Google Jobs and more — get the job before others." },
      { property: "og:title", content: "JOB ALERT SERVICE" },
      { property: "og:description", content: "Real-time job alerts from 10+ platforms on WhatsApp & Email." },
    ],
  }),
  component: Index,
});

function Index() {
  const s = useStore();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.dir = RTL_LANGS.includes(s.lang) ? "rtl" : "ltr";
    html.lang = s.lang.toLowerCase();
  }, [s.lang]);

  let screen;
  if (s.sessionType === "admin") screen = <AdminPanel />;
  else if (s.sessionType === "client") screen = <ClientDashboard />;
  else if (loginOpen) screen = <LoginScreen onBack={() => setLoginOpen(false)} />;
  else screen = <PublicScreen onLogin={() => setLoginOpen(true)} />;

  return (
    <>
      {screen}
      <Toaster position="bottom-right" theme="dark" richColors />
    </>
  );
}
