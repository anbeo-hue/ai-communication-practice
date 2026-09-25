import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import type { z } from "zod";

// Try loading .env if running locally in Node environment
try {
  if (typeof process !== "undefined" && typeof (process as any).loadEnvFile === "function") {
    (process as any).loadEnvFile();
  }
} catch {
  // Ignore error if .env doesn't exist or already loaded
}

export async function runStructured<T extends z.ZodTypeAny>(opts: {
  system: string;
  prompt: string;
  schema: T;
  fallback?: () => z.infer<T> | Promise<z.infer<T>>;
}): Promise<z.infer<T>> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const geminiKey = process.env["GEMINI_API_KEY"];
  const openaiKey = process.env["OPENAI_API_KEY"];
  const groqKey = process.env["GROQ_API_KEY"];

  // If no API key is configured, use fallback if available
  if (!lovableKey && !geminiKey && !openaiKey && !groqKey) {
    if (opts.fallback) {
      return await opts.fallback();
    }
    throw new Error(
      "AI chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY hoặc OPENAI_API_KEY vào file .env",
    );
  }

  let model: any;
  let providerOptions: any = undefined;

  if (lovableKey) {
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: lovableKey,
      headers: { "Lovable-API-Key": lovableKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    model = (lovable as any).responses
      ? (lovable as any).responses("openai/gpt-6-astra")
      : lovable("openai/gpt-4o-mini");
    providerOptions = {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    };
  } else if (geminiKey) {
    const gemini = createOpenAI({
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      apiKey: geminiKey,
    });
    const modelName = process.env["GEMINI_MODEL"] || "gemini-2.0-flash";
    model = gemini(modelName);
  } else if (groqKey) {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groqKey,
    });
    const modelName = process.env["GROQ_MODEL"] || "llama-3.3-70b-versatile";
    model = groq(modelName);
  } else if (openaiKey) {
    const openai = createOpenAI({
      apiKey: openaiKey,
    });
    const modelName = process.env["OPENAI_MODEL"] || "gpt-4o-mini";
    model = openai(modelName);
  }

  try {
    const result = streamText({
      model,
      system: opts.system,
      prompt: opts.prompt,
      output: Output.object({ schema: opts.schema }),
      maxRetries: 1,
      providerOptions,
    });
    return (await result.output) as z.infer<T>;
  } catch (e: any) {
    console.warn("AI generation failed, checking fallback:", e?.message);
    if (opts.fallback) {
      return await opts.fallback();
    }
    const status = e?.statusCode ?? e?.cause?.statusCode;
    if (status === 429) throw new Error("Hệ thống đang bận, vui lòng thử lại sau ít phút.");
    if (status === 402) throw new Error("Hết lượt AI. Vui lòng nạp thêm credits trong workspace.");
    throw new Error(e?.message ?? "AI error");
  }
}
