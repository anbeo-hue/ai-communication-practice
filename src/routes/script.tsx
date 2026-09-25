import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScenarioForm } from "@/components/ScenarioForm";
import { Conversation } from "@/components/Conversation";
import { ModeBadge } from "@/components/ModeBadge";
import { useI18n } from "@/lib/i18n";
import { generateScripts, type ScriptsResult } from "@/lib/ai.functions";

export const Route = createFileRoute("/script")({
  head: () => ({
    meta: [
      { title: "Scenario Script — Luyện nhập vai với AI | Nói Đi" },
      {
        name: "description",
        content:
          "Tạo tình huống, AI viết kịch bản Lịch sự & Thân thiện, chọn vai A hoặc B để luyện nói tiếng Anh.",
      },
      { property: "og:title", content: "Scenario Script — Nói Đi" },
      {
        property: "og:description",
        content: "AI tạo Script A và B cho tình huống của bạn, rồi nhập vai luyện nói.",
      },
    ],
  }),
  component: ScriptPage,
});

function ScriptPage() {
  const { t } = useI18n();
  const gen = useServerFn(generateScripts);
  const [scenario, setScenario] = useState("");
  const [level, setLevel] = useState("B1");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScriptsResult | null>(null);
  const [pick, setPick] = useState<{ script: "A" | "B"; role: "A" | "B" } | null>(null);

  async function submit() {
    setLoading(true);
    try {
      setData(await gen({ data: { scenario, level } }));
    } catch (e: any) {
      toast.error(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  const reset = () => {
    setData(null);
    setPick(null);
  };

  if (data && pick) {
    const script = pick.script === "A" ? data.scriptA : data.scriptB;
    const userRole = pick.role === "A" ? data.roleA : data.roleB;
    const aiRole = pick.role === "A" ? data.roleB : data.roleA;
    const lines = script.lines.map((l) => ({
      speaker: l.speaker === "A" ? data.roleA : data.roleB,
      text: l.text,
      mine: l.speaker === pick.role,
    }));
    return (
      <Shell title={data.title} sub={`Script ${pick.script} · ${script.style}`}>
        <Conversation
          mode="script"
          scenario={`${data.context} (${scenario})`}
          aiRole={aiRole}
          userRole={userRole}
          level={level}
          styleHint={lines.map((l) => `${l.speaker}: ${l.text}`).join("\n")}
          scriptLines={lines}
          onRestart={reset}
        />
      </Shell>
    );
  }

  if (data) {
    return (
      <Shell title={data.title} sub={data.context}>
        <div className="grid gap-6 md:grid-cols-2">
          {(["A", "B"] as const).map((k) => {
            const s = k === "A" ? data.scriptA : data.scriptB;
            return (
              <article
                key={k}
                className="flex flex-col rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-5xl text-script">{k}</span>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Script {k}
                    </div>
                    <div className="font-medium">{s.style}</div>
                  </div>
                </div>
                <ol className="mt-5 flex-1 space-y-3">
                  {s.lines.map((l, i) => (
                    <li key={i} className="text-[15px] leading-relaxed">
                      <b className="text-muted-foreground">
                        {l.speaker === "A" ? data.roleA : data.roleB}:
                      </b>{" "}
                      {l.text}
                    </li>
                  ))}
                </ol>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <Button onClick={() => setPick({ script: k, role: "A" })}>
                    {t("playA")} · {data.roleA}
                  </Button>
                  <Button variant="outline" onClick={() => setPick({ script: k, role: "B" })}>
                    {t("playB")} · {data.roleB}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
        <Button variant="ghost" className="mt-6" onClick={reset}>
          ← {t("back")}
        </Button>
      </Shell>
    );
  }

  return (
    <Shell title={t("scriptMode")} sub={t("scriptDesc")}>
      <div className="max-w-2xl">
        <ScenarioForm
          scenario={scenario}
          setScenario={setScenario}
          level={level}
          setLevel={setLevel}
          loading={loading}
          submitLabel={t("generate")}
          onSubmit={submit}
        />
      </div>
    </Shell>
  );
}

function Shell({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <ModeBadge mode="script" />
      <h1 className="mt-3 font-display text-4xl md:text-5xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{sub}</p>
      <div className="mt-8">{children}</div>
    </main>
  );
}
