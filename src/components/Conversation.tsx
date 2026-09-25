import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Lightbulb,
  Eye,
  EyeOff,
  Flag,
  RotateCcw,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { speak, useSpeechRecognition } from "@/lib/speech";
import {
  roleplayRespond,
  generateAssistance,
  generateFeedback,
  type Turn,
} from "@/lib/ai.functions";

type Level = "idea" | "phrase" | "script";
type Feedback = {
  overall: number;
  scores: { name: string; score: number }[];
  strengths: string[];
  improvements: string[];
};

const HELP_RE = /(i don'?t know|không biết|help me|bí quá|what should i say|\.\.\.$|^hmm+$|^uh+$)/i;
const SILENCE_MS = 12000;

export function Conversation(props: {
  mode: "script" | "natural";
  scenario: string;
  aiRole: string;
  userRole: string;
  level: string;
  styleHint?: string;
  scriptLines?: { speaker: string; text: string; mine: boolean }[];
  onRestart: () => void;
}) {
  const { t } = useI18n();
  const respond = useServerFn(roleplayRespond);
  const assist = useServerFn(generateAssistance);
  const feedbackFn = useServerFn(generateFeedback);

  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const [showScript, setShowScript] = useState(true);
  const [helpOffer, setHelpOffer] = useState(false);
  const [help, setHelp] = useState<{
    level: Level;
    suggestion: string;
    translation: string | null;
  } | null>(null);
  const [helpLoading, setHelpLoading] = useState<Level | null>(null);
  const [assists, setAssists] = useState(0);
  const [fb, setFb] = useState<Feedback | null>(null);
  const [fbLoading, setFbLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const silenceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const base = {
    scenario: props.scenario,
    aiRole: props.aiRole,
    userRole: props.userRole,
  };

  const sr = useSpeechRecognition((text) => setInput((p) => (p ? p + " " : "") + text));

  async function askAI(conv: Turn[]) {
    setBusy(true);
    setError(null);
    try {
      const r = await respond({
        data: {
          ...base,
          mode: props.mode,
          styleHint: props.styleHint ?? null,
          conversation: conv,
          level: props.level,
        },
      });
      setTurns([...conv, { speaker: "ai", text: r.reply }]);
      speak(r.reply);
      if (r.ended) setEnded(true);
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      setBusy(false);
    }
  }

  // AI opens (or user opens if they chose role that speaks first in script)
  useEffect(() => {
    const firstSpeakerIsUser = props.scriptLines?.[0]?.mine;
    if (!firstSpeakerIsUser) askAI([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, busy, help, helpOffer]);

  // silence detection (natural mode): after AI speaks, offer help softly
  useEffect(() => {
    if (props.mode !== "natural") return;
    if (silenceRef.current) clearTimeout(silenceRef.current);
    const last = turns[turns.length - 1];
    if (!last || last.speaker !== "ai" || busy || ended || input.trim() || sr.listening) return;
    silenceRef.current = setTimeout(() => setHelpOffer(true), SILENCE_MS);
    return () => {
      if (silenceRef.current) clearTimeout(silenceRef.current);
    };
  }, [turns, busy, input, ended, sr.listening, props.mode]);

  function send() {
    const text = input.trim();
    if (!text || busy) return;
    if (props.mode === "natural" && HELP_RE.test(text) && text.length < 40) {
      setInput("");
      setHelpOffer(true);
      return;
    }
    const conv: Turn[] = [...turns, { speaker: "user", text }];
    setTurns(conv);
    setInput("");
    setHelp(null);
    setHelpOffer(false);
    askAI(conv);
  }

  async function getHelp(level: Level) {
    setHelpLoading(level);
    try {
      const r = await assist({ data: { ...base, conversation: turns, level, cefr: props.level } });
      setHelp({ level, ...r });
      setAssists((n) => n + 1);
    } catch (e: any) {
      toast.error(e?.message ?? "Error");
    } finally {
      setHelpLoading(null);
    }
  }

  async function finish() {
    setFbLoading(true);
    try {
      const r = await feedbackFn({
        data: {
          mode: props.mode,
          scenario: props.scenario,
          conversation: turns,
          assistsUsed: assists,
        },
      });
      setFb(r);
    } catch (e: any) {
      toast.error(e?.message ?? "Error");
    } finally {
      setFbLoading(false);
    }
  }

  const userTurns = turns.filter((x) => x.speaker === "user").length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="flex h-[70vh] min-h-[480px] flex-col rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3 text-sm">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <span className="text-muted-foreground">{t("youAre")}: </span>
              <b>{props.userRole}</b>
            </span>
            <span>
              <span className="text-muted-foreground">{t("aiIs")}: </span>
              <b>{props.aiRole}</b>
            </span>
          </div>
          {props.mode === "natural" && (
            <span className="text-xs text-muted-foreground">
              {assists} {t("hintsUsed")}
            </span>
          )}
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6" aria-live="polite">
          {turns.map((m, i) =>
            m.speaker === "ai" ? (
              <div key={i} className="max-w-[85%]">
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {props.aiRole}
                </div>
                <div className="flex items-start gap-2">
                  <p className="text-[17px] leading-relaxed">{m.text}</p>
                  <button
                    onClick={() => speak(m.text)}
                    aria-label="Play audio"
                    className="mt-1 shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-[16px] text-primary-foreground">
                  {m.text}
                </p>
              </div>
            ),
          )}
          {busy && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> {t("thinking")}
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {error}{" "}
              <button className="underline" onClick={() => askAI(turns)}>
                {t("retry")}
              </button>
            </div>
          )}
          {ended && <p className="text-center text-sm text-muted-foreground">{t("ended")}</p>}

          {props.mode === "natural" && (helpOffer || help) && (
            <div className="rounded-xl border border-dashed border-accent-strong/50 bg-accent p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-accent-foreground">
                  <Lightbulb className="h-4 w-4" /> {t("needHelp")}
                </span>
                <button
                  aria-label={t("close")}
                  onClick={() => {
                    setHelp(null);
                    setHelpOffer(false);
                  }}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["idea", "phrase", "script"] as Level[]).map((lv, idx) => (
                  <Button
                    key={lv}
                    size="sm"
                    variant={help?.level === lv ? "default" : "outline"}
                    disabled={!!helpLoading}
                    onClick={() => getHelp(lv)}
                  >
                    {helpLoading === lv && <Loader2 className="h-3 w-3 animate-spin" />}
                    {idx + 1}. {t(lv === "script" ? "fullScript" : lv)}
                  </Button>
                ))}
              </div>
              {help && (
                <div className="mt-4 rounded-lg bg-card p-4">
                  <p className={help.level === "idea" ? "" : "font-medium text-[17px]"}>
                    {help.level === "idea" ? help.suggestion : `“${help.suggestion}”`}
                  </p>
                  {help.translation && (
                    <p className="mt-1 text-sm text-muted-foreground">{help.translation}</p>
                  )}
                  {help.level !== "idea" && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => setInput(help.suggestion)}>
                        {t("useThis")}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => speak(help.suggestion)}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t p-3">
          {sr.interim && (
            <p className="mb-2 px-1 text-sm italic text-muted-foreground">{sr.interim}</p>
          )}
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (helpOffer && !help) setHelpOffer(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={sr.listening ? t("listening") : t("typeHere")}
              rows={2}
              className="min-h-[52px] resize-none"
            />
            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                variant={sr.listening ? "destructive" : "outline"}
                onClick={() =>
                  sr.supported ? (sr.listening ? sr.stop() : sr.start()) : toast(t("noMic"))
                }
                aria-label="Microphone"
              >
                {sr.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button size="icon" onClick={send} disabled={busy || !input.trim()} aria-label="Send">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {props.mode === "natural" && !helpOffer && !help && (
            <button
              onClick={() => setHelpOffer(true)}
              className="mt-2 flex items-center gap-1 px-1 text-sm text-accent-strong hover:underline"
            >
              <Lightbulb className="h-3.5 w-3.5" /> {t("hint")}
            </button>
          )}
        </div>
      </section>

      <aside className="space-y-4">
        {props.scriptLines && (
          <div className="rounded-2xl border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg">{t("useScript")}</h3>
              <Button size="sm" variant="ghost" onClick={() => setShowScript((s) => !s)}>
                {showScript ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showScript ? t("hideScript") : t("showScript")}
              </Button>
            </div>
            {showScript && (
              <ol className="space-y-2 text-sm">
                {props.scriptLines.map((l, i) => (
                  <li
                    key={i}
                    className={l.mine ? "rounded-md bg-accent p-2" : "p-2 text-muted-foreground"}
                  >
                    <b className="mr-1">{l.speaker}:</b>
                    {l.text}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Button onClick={finish} disabled={userTurns === 0 || fbLoading}>
            {fbLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Flag className="h-4 w-4" />
            )}
            {t("finish")}
          </Button>
          <Button variant="outline" onClick={props.onRestart}>
            <RotateCcw className="h-4 w-4" /> {t("restart")}
          </Button>
        </div>
        {fb && (
          <div className="rounded-2xl border bg-card p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-lg">{t("feedback")}</h3>
              <span className="font-display text-3xl">{fb.overall}/10</span>
            </div>
            <ul className="mt-3 space-y-2">
              {fb.scores.map((s) => (
                <li key={s.name} className="text-sm">
                  <div className="flex justify-between">
                    <span>{s.name}</span>
                    <span>{s.score}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${s.score * 10}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <h4 className="mt-4 text-sm font-semibold">{t("strengths")}</h4>
            <ul className="list-disc pl-5 text-sm">
              {fb.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <h4 className="mt-3 text-sm font-semibold">{t("improve")}</h4>
            <ul className="list-disc pl-5 text-sm">
              {fb.improvements.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
