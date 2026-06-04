import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "@/components/ui/sonner";
import { useStore } from "@/lib/store";
import { RTL_LANGS } from "@/lib/i18n";
import { PublicScreen } from "@/components/jas/Public";
import { LoginScreen } from "@/components/jas/Login";
import { AdminPanel } from "@/components/jas/AdminPanel";
import { ClientDashboard } from "@/components/jas/ClientDashboard";
import { LOGO_URL } from "@/components/jas/Logo";
import { CursorGlow, LoadingScreen, ParticleField } from "@/components/jas/FxLayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JOB ALERT SERVICE — Real-time Job Alerts on WhatsApp & Email" },
      { name: "description", content: "Bahrain's #1 job alert service. Real-time alerts from LinkedIn, Indeed, Google Jobs and more — get the job before others." },
      { property: "og:title", content: "JOB ALERT SERVICE" },
      { property: "og:description", content: "Real-time job alerts from 10+ platforms on WhatsApp & Email." },
      { property: "og:image", content: LOGO_URL },
    ],
    links: [
      { rel: "icon", type: "image/png", href: LOGO_URL },
      { rel: "apple-touch-icon", href: LOGO_URL },
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

  let key: string;
  let screen: React.ReactNode;
  if (s.sessionType === "admin") { key = "admin"; screen = <AdminPanel />; }
  else if (s.sessionType === "client") { key = "client"; screen = <ClientDashboard />; }
  else if (loginOpen) { key = "login"; screen = <LoginScreen onBack={() => setLoginOpen(false)} />; }
  else { key = "public"; screen = <PublicScreen onLogin={() => setLoginOpen(true)} />; }

  return (
    <>
      <LoadingScreen />
      <ParticleField />
      <CursorGlow />
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {screen}
        </motion.div>
      </AnimatePresence>
      <Toaster position="bottom-right" theme="dark" richColors />
    </>
  );
}
