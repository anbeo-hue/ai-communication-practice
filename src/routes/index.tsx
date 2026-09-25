import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, MessagesSquare } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ModeBadge } from "@/components/ModeBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nói Đi — Luyện giao tiếp tiếng Anh với AI" },
      {
        name: "description",
        content:
          "Luyện nói tiếng Anh với AI: nhập vai theo kịch bản hoặc trò chuyện tự nhiên với gợi ý thông minh.",
      },
      { property: "og:title", content: "Nói Đi — Luyện giao tiếp tiếng Anh với AI" },
      {
        property: "og:description",
        content: "Hai chế độ: Scenario Script và Natural Conversation.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
        {t("heroTitle")}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t("heroSub")}</p>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <ModeCard
          to="/script"
          mode="script"
          icon={<FileText className="h-7 w-7" />}
          title={t("scriptMode")}
          desc={t("scriptDesc")}
          cta={t("start")}
        >
          <div className="space-y-1.5 text-sm">
            <div className="rounded-md bg-background/60 px-3 py-2">
              <b>A</b> · Professional / Polite
            </div>
            <div className="rounded-md bg-background/60 px-3 py-2">
              <b>B</b> · Natural / Friendly
            </div>
          </div>
        </ModeCard>
        <ModeCard
          to="/natural"
          mode="natural"
          icon={<MessagesSquare className="h-7 w-7" />}
          title={t("naturalMode")}
          desc={t("naturalDesc")}
          cta={t("start")}
        >
          <div className="flex gap-1.5 text-sm">
            {[t("idea"), t("phrase"), t("fullScript")].map((x, i) => (
              <span key={x} className="rounded-md bg-background/60 px-3 py-2">
                {i + 1}. {x}
              </span>
            ))}
          </div>
        </ModeCard>
      </div>
    </main>
  );
}

function ModeCard(p: {
  to: "/script" | "/natural";
  mode: "script" | "natural";
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={p.to}
      className={`group flex flex-col rounded-3xl p-8 transition hover:-translate-y-1 ${
        p.mode === "script" ? "bg-script-soft" : "bg-natural-soft"
      }`}
    >
      <div className="flex items-center justify-between">
        {p.icon}
        <ModeBadge mode={p.mode} />
      </div>
      <h2 className="mt-10 font-display text-3xl">{p.title}</h2>
      <p className="mt-2 text-muted-foreground">{p.desc}</p>
      <div className="mt-6">{p.children}</div>
      <span className="mt-8 inline-flex items-center gap-2 font-medium">
        {p.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
