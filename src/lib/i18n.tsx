import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "vi" | "en";

const dict = {
  brand: { vi: "Nói Đi", en: "Nói Đi" },
  home: { vi: "Trang chủ", en: "Home" },
  scriptMode: { vi: "Kịch bản", en: "Scenario Script" },
  naturalMode: { vi: "Hội thoại tự nhiên", en: "Natural Conversation" },
  heroTitle: {
    vi: "Luyện nói tiếng Anh với AI, theo cách của bạn.",
    en: "Practice speaking English with AI, your way.",
  },
  heroSub: {
    vi: "Tự tạo tình huống. Luyện theo kịch bản, hoặc nói chuyện tự nhiên và chỉ nhận gợi ý khi bạn thật sự bí.",
    en: "Create your own situation. Rehearse a script, or talk freely and get help only when you're truly stuck.",
  },
  scriptDesc: {
    vi: "AI viết 2 kịch bản — Lịch sự và Thân thiện. Chọn vai A hoặc B rồi nhập vai.",
    en: "AI writes two scripts — Polite and Friendly. Pick role A or B and roleplay.",
  },
  naturalDesc: {
    vi: "Không kịch bản. Trò chuyện tự do, gợi ý 3 cấp độ khi bạn ngập ngừng.",
    en: "No script. Talk freely with 3-level hints when you hesitate.",
  },
  start: { vi: "Bắt đầu", en: "Start" },
  describe: {
    vi: "Mô tả tình huống bạn muốn luyện",
    en: "Describe the situation you want to practice",
  },
  placeholderScenario: {
    vi: "VD: Tôi muốn luyện cách xin sếp nghỉ phép tuần sau…",
    en: "e.g. I want to ask my manager for time off next week…",
  },
  level: { vi: "Trình độ", en: "Level" },
  generate: { vi: "Tạo kịch bản", en: "Generate scripts" },
  begin: { vi: "Bắt đầu hội thoại", en: "Start conversation" },
  generating: { vi: "AI đang viết…", en: "AI is writing…" },
  examples: { vi: "Gợi ý tình huống", en: "Try a scenario" },
  playA: { vi: "Đóng vai A", en: "Play role A" },
  playB: { vi: "Đóng vai B", en: "Play role B" },
  youAre: { vi: "Bạn là", en: "You are" },
  aiIs: { vi: "AI là", en: "AI plays" },
  useScript: { vi: "Kịch bản tham khảo", en: "Reference script" },
  showScript: { vi: "Hiện kịch bản", en: "Show script" },
  hideScript: { vi: "Ẩn kịch bản", en: "Hide script" },
  typeHere: { vi: "Nhập câu trả lời bằng tiếng Anh…", en: "Type your reply in English…" },
  listening: { vi: "Đang nghe…", en: "Listening…" },
  noMic: {
    vi: "Trình duyệt không hỗ trợ giọng nói — hãy nhập văn bản.",
    en: "Speech not supported — please type.",
  },
  needHelp: { vi: "Bạn cần gợi ý?", en: "Need help?" },
  hint: { vi: "Gợi ý", en: "Hint" },
  idea: { vi: "Ý tưởng", en: "Idea" },
  phrase: { vi: "Cụm từ", en: "Phrase" },
  fullScript: { vi: "Đoạn hoàn chỉnh", en: "Full reply" },
  useThis: { vi: "Dùng câu này", en: "Use this" },
  finish: { vi: "Kết thúc & nhận xét", en: "Finish & feedback" },
  restart: { vi: "Tình huống mới", en: "New scenario" },
  thinking: { vi: "Đang suy nghĩ…", en: "Thinking…" },
  feedback: { vi: "Nhận xét", en: "Feedback" },
  strengths: { vi: "Điểm mạnh", en: "Strengths" },
  improve: { vi: "Cần cải thiện", en: "To improve" },
  close: { vi: "Đóng", en: "Close" },
  back: { vi: "Quay lại", en: "Back" },
  retry: { vi: "Thử lại", en: "Retry" },
  hintsUsed: { vi: "gợi ý đã dùng", en: "hints used" },
  ended: { vi: "Hội thoại đã kết thúc tự nhiên.", en: "The conversation reached a natural end." },
} as const;

export type Key = keyof typeof dict;
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "vi",
  setLang: () => {},
  t: (k) => dict[k].vi,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");
  useEffect(() => {
    const s = localStorage.getItem("lang");
    if (s === "en" || s === "vi") setLangState(s);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[k][lang] }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
