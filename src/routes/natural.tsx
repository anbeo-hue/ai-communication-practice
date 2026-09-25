import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScenarioForm } from "@/components/ScenarioForm";
import { Conversation } from "@/components/Conversation";
import { ModeBadge } from "@/components/ModeBadge";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/natural")({
  head: () => ({
    meta: [
      { title: "Natural Conversation — Trò chuyện tự do với AI | Nói Đi" },
      {
        name: "description",
        content:
          "Hội thoại tiếng Anh không kịch bản, nhận gợi ý 3 cấp độ (ý tưởng, cụm từ, đoạn hoàn chỉnh) khi bạn bí.",
      },
      { property: "og:title", content: "Natural Conversation — Nói Đi" },
      {
        property: "og:description",
        content: "Nói chuyện tự nhiên với AI, chỉ nhận trợ giúp khi thực sự cần.",
      },
    ],
  }),
  component: NaturalPage,
});

function NaturalPage() {
  const { t } = useI18n();
  const [scenario, setScenario] = useState("");
  const [level, setLevel] = useState("B1");
  const [started, setStarted] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <ModeBadge mode="natural" />
      <h1 className="mt-3 font-display text-4xl md:text-5xl">
        {started ? scenario : t("naturalMode")}
      </h1>
      {!started && <p className="mt-2 max-w-2xl text-muted-foreground">{t("naturalDesc")}</p>}
      <div className="mt-8">
        {started ? (
          <Conversation
            mode="natural"
            scenario={scenario}
            aiRole="Conversation partner"
            userRole="You (learner)"
            level={level}
            onRestart={() => setStarted(false)}
          />
        ) : (
          <div className="max-w-2xl">
            <ScenarioForm
              scenario={scenario}
              setScenario={setScenario}
              level={level}
              setLevel={setLevel}
              loading={false}
              submitLabel={t("begin")}
              onSubmit={() => setStarted(true)}
            />
          </div>
        )}
      </div>
    </main>
  );
}
