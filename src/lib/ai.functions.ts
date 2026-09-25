import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runStructured } from "./ai.server";
import {
  getMockScripts,
  getMockRoleplayReply,
  getMockAssistance,
  getMockFeedback,
} from "./ai.mock";

const Line = z.object({ speaker: z.enum(["A", "B"]), text: z.string() });
const Script = z.object({ style: z.string(), lines: z.array(Line) });
const ScriptsOut = z.object({
  title: z.string(),
  context: z.string(),
  roleA: z.string(),
  roleB: z.string(),
  scriptA: Script,
  scriptB: Script,
});
export type ScriptsResult = z.infer<typeof ScriptsOut>;

const Turn = z.object({ speaker: z.enum(["user", "ai"]), text: z.string() });
export type Turn = z.infer<typeof Turn>;

const levelDesc = (lv: string) => `CEFR level ${lv}`;

export const generateScripts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ scenario: z.string().min(3).max(1000), level: z.string() }).parse(d),
  )
  .handler(async ({ data }) =>
    runStructured({
      schema: ScriptsOut,
      system:
        "You create English speaking-practice dialogues. The user may describe the situation in Vietnamese or English. Output English dialogue. Role A and Role B are the two participants (e.g. Manager / Employee). Script A must be Professional/Polite; Script B must be Natural/Friendly — two different ways of handling the SAME situation, neither is right or wrong. Each script 6-10 lines alternating speakers. title and context should be short, in Vietnamese.",
      prompt: `Situation: ${data.scenario}\nTarget ${levelDesc(data.level)}.`,
      fallback: () => getMockScripts(data.scenario, data.level),
    }),
  );

export const roleplayRespond = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        mode: z.enum(["script", "natural"]),
        scenario: z.string().max(2000),
        aiRole: z.string().max(200),
        userRole: z.string().max(200),
        styleHint: z.string().max(4000).nullable(),
        conversation: z.array(Turn).max(80),
        level: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const history = data.conversation
      .map((t) => `${t.speaker === "ai" ? data.aiRole : data.userRole}: ${t.text}`)
      .join("\n");
    return runStructured({
      schema: z.object({ reply: z.string(), ended: z.boolean() }),
      system: `You are roleplaying as "${data.aiRole}" talking to "${data.userRole}" (the learner) in English. Stay in character, reply in 1-3 natural sentences at ${levelDesc(data.level)}. ${
        data.mode === "script"
          ? `Use this reference script loosely as a starting point; if the learner deviates but stays in context, continue naturally:\n${data.styleHint ?? ""}`
          : "There is no script. React naturally and keep the conversation going with a question when appropriate."
      } Set ended=true only if the conversation has reached a natural conclusion. If the conversation is empty, open the conversation.`,
      prompt: `Scenario: ${data.scenario}\n\nConversation so far:\n${history || "(empty — you speak first)"}`,
      fallback: () => getMockRoleplayReply(data),
    });
  });

export const generateAssistance = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        scenario: z.string().max(2000),
        aiRole: z.string().max(200),
        userRole: z.string().max(200),
        conversation: z.array(Turn).max(80),
        level: z.enum(["idea", "phrase", "script"]),
        cefr: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const history = data.conversation
      .map((t) => `${t.speaker === "ai" ? data.aiRole : data.userRole}: ${t.text}`)
      .join("\n");
    const rule = {
      idea: "Give ONLY an idea of what to say, in Vietnamese, one or two short sentences. No English answer.",
      phrase:
        "Give ONE natural English phrase or short sentence opener the learner can use. Put a short Vietnamese meaning in 'translation'.",
      script:
        "Give a complete 2-3 sentence English reply that fits exactly. Put Vietnamese translation in 'translation'.",
    }[data.level];
    return runStructured({
      schema: z.object({ suggestion: z.string(), translation: z.string().nullable() }),
      system: `You help an English learner (${data.userRole}) who is stuck in a conversation with ${data.aiRole}. The suggestion MUST fit the exact latest message and history — never generic. ${rule} Target ${levelDesc(data.cefr)}.`,
      prompt: `Scenario: ${data.scenario}\n\nConversation:\n${history}`,
      fallback: () => getMockAssistance(data),
    });
  });

export const generateFeedback = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        mode: z.enum(["script", "natural"]),
        scenario: z.string().max(2000),
        conversation: z.array(Turn).max(80),
        assistsUsed: z.number(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const history = data.conversation.map((t) => `${t.speaker}: ${t.text}`).join("\n");
    const criteria =
      data.mode === "script"
        ? "accuracy, grammar, fluency, naturalness"
        : "relevance, naturalness, fluency, tone, conversation maintenance (no exact-match scoring)";
    return runStructured({
      schema: z.object({
        overall: z.number(),
        scores: z.array(z.object({ name: z.string(), score: z.number() })),
        strengths: z.array(z.string()),
        improvements: z.array(z.string()),
      }),
      system: `Evaluate the learner ("user" lines) on ${criteria}. Scores 0-10. Criterion names, strengths and improvements in Vietnamese (quote English examples where useful). The learner used ${data.assistsUsed} hints.`,
      prompt: `Scenario: ${data.scenario}\n\n${history}`,
      fallback: () => getMockFeedback(data),
    });
  });
