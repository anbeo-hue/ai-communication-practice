import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";

const EXAMPLES = [
  "Xin sếp nghỉ phép 3 ngày tuần sau",
  "Gọi món và hỏi về món chay ở nhà hàng",
  "Phỏng vấn xin việc vị trí Marketing",
  "Làm quen với đồng nghiệp mới",
  "Giải thích với khách hàng vì sao dự án bị trễ",
];

export function ScenarioForm(props: {
  scenario: string;
  setScenario: (s: string) => void;
  level: string;
  setLevel: (s: string) => void;
  loading: boolean;
  submitLabel: string;
  onSubmit: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
      <label htmlFor="scn" className="font-display text-xl">
        {t("describe")}
      </label>
      <Textarea
        id="scn"
        value={props.scenario}
        onChange={(e) => props.setScenario(e.target.value)}
        placeholder={t("placeholderScenario")}
        rows={4}
        className="mt-3 text-base"
      />
      <div className="mt-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {t("examples")}
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => props.setScenario(ex)}
              className="rounded-full border px-3 py-1 text-sm transition hover:bg-accent"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("level")}</span>
          {["A2", "B1", "B2", "C1"].map((lv) => (
            <button
              key={lv}
              onClick={() => props.setLevel(lv)}
              className={`rounded-md px-2.5 py-1 font-medium ${
                props.level === lv ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {lv}
            </button>
          ))}
        </div>
        <Button
          size="lg"
          disabled={props.loading || props.scenario.trim().length < 3}
          onClick={props.onSubmit}
        >
          {props.loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {props.loading ? t("generating") : props.submitLabel}
        </Button>
      </div>
    </div>
  );
}
