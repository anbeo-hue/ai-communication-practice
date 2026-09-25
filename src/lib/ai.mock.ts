import type { ScriptsResult, Turn } from "./ai.functions";

interface MockScenario {
  title: string;
  context: string;
  roleA: string;
  roleB: string;
  scriptA: {
    style: string;
    lines: Array<{ speaker: "A" | "B"; text: string }>;
  };
  scriptB: {
    style: string;
    lines: Array<{ speaker: "A" | "B"; text: string }>;
  };
}

const PRESET_SCENARIOS: Array<{ keywords: string[]; data: MockScenario }> = [
  {
    keywords: ["nghỉ phép", "leave", "vacation", "day off", "days off", "nghỉ 3 ngày"],
    data: {
      title: "Xin sếp nghỉ phép 3 ngày",
      context:
        "Nhân viên xin phép quản lý nghỉ 3 ngày để giải quyết việc cá nhân và sắp xếp bàn giao công việc.",
      roleA: "Nhân viên (Employee)",
      roleB: "Quản lý (Manager)",
      scriptA: {
        style: "Lịch sự & Trang trọng (Formal & Professional)",
        lines: [
          {
            speaker: "A",
            text: "Good morning, Mr. David. Do you have a few minutes? I'd like to discuss my schedule for next week.",
          },
          { speaker: "B", text: "Good morning! Yes, please have a seat. What's on your mind?" },
          {
            speaker: "A",
            text: "I would like to request three days off, from Wednesday to Friday, to attend to some urgent family matters.",
          },
          {
            speaker: "B",
            text: "I understand. Have you made arrangements to cover your ongoing tasks during your absence?",
          },
          {
            speaker: "A",
            text: "Yes, I will finalize the quarterly report by Tuesday, and Sarah has agreed to monitor urgent client inquiries.",
          },
          {
            speaker: "B",
            text: "That sounds very responsible. Please submit the formal request through our HR portal so I can approve it.",
          },
          { speaker: "A", text: "Thank you very much, Mr. David. I appreciate your support." },
          { speaker: "B", text: "You're welcome. Take care and have a good trip." },
        ],
      },
      scriptB: {
        style: "Thân thiện & Tự nhiên (Friendly & Casual)",
        lines: [
          {
            speaker: "A",
            text: "Hey David, do you have a quick sec? Just wanted to run something by you.",
          },
          { speaker: "B", text: "Hey there! Sure thing, what's going on?" },
          {
            speaker: "A",
            text: "I was hoping to take Wednesday through Friday off next week for some personal stuff.",
          },
          { speaker: "B", text: "Got it. Will the team's workload be okay while you're away?" },
          {
            speaker: "A",
            text: "Yeah, definitely! Sarah is backing me up on the urgent issues, and I'll wrap up the sprint backlog on Tuesday.",
          },
          {
            speaker: "B",
            text: "Awesome, thanks for planning ahead! Put the request in the system and I'll approve it right away.",
          },
          { speaker: "A", text: "Thanks a ton, David! Really appreciate it." },
          { speaker: "B", text: "No worries at all! Enjoy your time off." },
        ],
      },
    },
  },
  {
    keywords: ["gọi món", "món chay", "nhà hàng", "restaurant", "vegetarian", "order food"],
    data: {
      title: "Gọi món và hỏi về món chay",
      context: "Khách hàng vào nhà hàng và hỏi nhân viên phục vụ về các món ăn chay phù hợp.",
      roleA: "Khách hàng (Customer)",
      roleB: "Phục vụ (Server)",
      scriptA: {
        style: "Lịch sự & Trang trọng (Formal & Professional)",
        lines: [
          {
            speaker: "B",
            text: "Good evening! Welcome to Bistro Paris. Are you ready to order, or would you like a few more minutes?",
          },
          {
            speaker: "A",
            text: "Good evening. Could you please recommend some vegetarian options on your menu?",
          },
          {
            speaker: "B",
            text: "Certainly! We have our grilled truffle mushroom risotto and a Mediterranean roasted vegetable platter.",
          },
          { speaker: "A", text: "Does the mushroom risotto contain any dairy or animal broth?" },
          {
            speaker: "B",
            text: "It is prepared with vegetable stock, but it does contain a small amount of parmesan cheese. We can omit it if you prefer.",
          },
          {
            speaker: "A",
            text: "That would be wonderful. I'll have the mushroom risotto without cheese, and a sparkling water, please.",
          },
          {
            speaker: "B",
            text: "Excellent choice. I'll place your order with the chef immediately.",
          },
          { speaker: "A", text: "Thank you very much for your help." },
        ],
      },
      scriptB: {
        style: "Thân thiện & Tự nhiên (Friendly & Casual)",
        lines: [
          {
            speaker: "B",
            text: "Hi there! How's it going today? Can I start you off with something to drink or eat?",
          },
          {
            speaker: "A",
            text: "Hey! Doing great, thanks. Quick question: what do you recommend for vegetarian dishes?",
          },
          {
            speaker: "B",
            text: "Oh, you definitely have to try our avocado pesto pasta or the crispy tofu bowl. They are crowd favorites!",
          },
          {
            speaker: "A",
            text: "Nice! The crispy tofu bowl sounds delicious. Is the sauce on the side or mixed in?",
          },
          {
            speaker: "B",
            text: "It's drizzled on top, but I can totally ask the kitchen to serve it on the side if you'd like.",
          },
          {
            speaker: "A",
            text: "That would be awesome, thanks! Let's do that and a fresh lemonade.",
          },
          { speaker: "B", text: "You got it! I'll have that right out for you in a few minutes." },
          { speaker: "A", text: "Sounds good, thank you!" },
        ],
      },
    },
  },
  {
    keywords: ["phỏng vấn", "marketing", "interview", "xin việc", "job interview"],
    data: {
      title: "Phỏng vấn vị trí Marketing",
      context:
        "Ứng viên tham gia phỏng vấn xin việc cho vị trí Marketing Specialist với người tuyển dụng.",
      roleA: "Ứng viên (Candidate)",
      roleB: "Nhà tuyển dụng (Interviewer)",
      scriptA: {
        style: "Chuyên nghiệp & Chuẩn mực (Professional & Formal)",
        lines: [
          {
            speaker: "B",
            text: "Good morning. Thank you for coming in today. Could you start by introducing yourself and your background in marketing?",
          },
          {
            speaker: "A",
            text: "Good morning. It is a pleasure to meet you. I have three years of experience managing digital campaigns and content strategy in the tech industry.",
          },
          {
            speaker: "B",
            text: "Impressive. Can you share an example of a successful campaign you led recently?",
          },
          {
            speaker: "A",
            text: "Certainly. Last quarter, I spearheaded a social media rebranding campaign that increased our organic lead conversion by 35% within two months.",
          },
          {
            speaker: "B",
            text: "That is remarkable growth. How do you typically handle tight deadlines and unexpected strategy shifts?",
          },
          {
            speaker: "A",
            text: "I rely on data-driven prioritization, clear team communication, and agile sprint reviews to keep deliverables on track.",
          },
          {
            speaker: "B",
            text: "Thank you for the detailed insight. Do you have any questions for us regarding the position?",
          },
          {
            speaker: "A",
            text: "Yes, I would love to learn more about the team's key growth milestones for the upcoming year.",
          },
        ],
      },
      scriptB: {
        style: "Cởi mở & Tự tin (Engaging & Conversational)",
        lines: [
          {
            speaker: "B",
            text: "Hey, great to meet you! How are you doing today? Ready to dive in?",
          },
          {
            speaker: "A",
            text: "Hi! Doing really well, thank you. I'm excited to be here and chat about the marketing role.",
          },
          {
            speaker: "B",
            text: "Awesome! Tell me a bit about what drew you into marketing and what you enjoy working on the most.",
          },
          {
            speaker: "A",
            text: "I love combining storytelling with analytical data. Seeing how creative content directly drives user engagement is super rewarding.",
          },
          { speaker: "B", text: "Love that mindset! What has been your proudest project so far?" },
          {
            speaker: "A",
            text: "Definitely revamping our weekly newsletter from scratch. We grew the subscriber base to 20,000 active readers with a 45% open rate.",
          },
          {
            speaker: "B",
            text: "Wow, 45% is fantastic! You clearly know how to connect with the audience.",
          },
          {
            speaker: "A",
            text: "Thanks! It was a team effort, and I'd love to bring that same momentum to your projects here.",
          },
        ],
      },
    },
  },
  {
    keywords: ["đồng nghiệp mới", "làm quen", "new colleague", "colleague", "coworker"],
    data: {
      title: "Làm quen với đồng nghiệp mới",
      context: "Nhân viên mới gặp gỡ và trò chuyện làm quen với đồng nghiệp trong ngày đầu đi làm.",
      roleA: "Nhân viên mới (New Employee)",
      roleB: "Đồng nghiệp (Colleague)",
      scriptA: {
        style: "Lịch sự & Nhã nhặn (Polite & Cordial)",
        lines: [
          {
            speaker: "A",
            text: "Good morning. Excuse me, I believe my desk is right next to yours. I'm An, the new marketing analyst.",
          },
          {
            speaker: "B",
            text: "Good morning, An! Welcome to the team. My name is Alex, I'm with the design department.",
          },
          {
            speaker: "A",
            text: "It's a pleasure to meet you, Alex. How long have you been working with the company?",
          },
          {
            speaker: "B",
            text: "I've been here for about two years now. How is your onboarding going so far?",
          },
          {
            speaker: "A",
            text: "It has been great. Everyone has been very welcoming, though there's quite a lot of new information to take in.",
          },
          {
            speaker: "B",
            text: "Don't worry, that's completely normal in the first week. If you need anything, please feel free to ask me.",
          },
          { speaker: "A", text: "Thank you so much, Alex. I really appreciate your kindness." },
          {
            speaker: "B",
            text: "Anytime! Let's grab some coffee together later during the break.",
          },
        ],
      },
      scriptB: {
        style: "Thân thiện & Thoải mái (Friendly & Casual)",
        lines: [
          {
            speaker: "A",
            text: "Hey there! I just joined today as the new marketing analyst. I'm An, nice to meet you!",
          },
          {
            speaker: "B",
            text: "Hey An! Welcome aboard! I'm Alex. Great to have you on our floor.",
          },
          {
            speaker: "A",
            text: "Thanks, Alex! Loving the office vibe already. Have you been here long?",
          },
          {
            speaker: "B",
            text: "About two years! The team is super chill. Have they set up your laptop and software yet?",
          },
          {
            speaker: "A",
            text: "Almost done with IT setup! Just trying to figure out where the good lunch spots are around here.",
          },
          {
            speaker: "B",
            text: "Haha, you asked the right person! A few of us are heading to the pho place across the street at noon—come join us!",
          },
          { speaker: "A", text: "Oh that sounds awesome, count me in! Thanks for inviting me." },
          { speaker: "B", text: "Sweet, see you at 12!" },
        ],
      },
    },
  },
  {
    keywords: ["trễ hạn", "delay", "khách hàng", "client", "dự án", "late", "deadline"],
    data: {
      title: "Giải thích dự án bị trễ với khách hàng",
      context:
        "Quản lý dự án thông báo và giải thích lý do tiến độ dự án bị chậm trễ cho khách hàng.",
      roleA: "Quản lý dự án (Project Manager)",
      roleB: "Khách hàng (Client)",
      scriptA: {
        style: "Chuyên nghiệp & Minh bạch (Professional & Solution-Oriented)",
        lines: [
          {
            speaker: "A",
            text: "Good afternoon, Mr. Smith. Thank you for taking the time to join this catch-up call.",
          },
          {
            speaker: "B",
            text: "Good afternoon. I understand you wanted to give an update on the phase two delivery date?",
          },
          {
            speaker: "A",
            text: "Yes, exactly. I want to be upfront with you: due to unforeseen API integration issues with the third-party provider, we are facing a four-day delay.",
          },
          {
            speaker: "B",
            text: "I appreciate the transparency, but our launch campaign was scheduled for next Monday. How will this impact our timeline?",
          },
          {
            speaker: "A",
            text: "We have assigned two senior engineers to work exclusively on the fix, and we are confident we can deliver the completed build by Wednesday.",
          },
          {
            speaker: "B",
            text: "Will this additional time guarantee that all security testing is fully validated?",
          },
          {
            speaker: "A",
            text: "Yes, absolutely. We will provide you with a comprehensive QA report alongside the release on Wednesday morning.",
          },
          { speaker: "B", text: "Understood. Please keep me updated with a daily status report." },
        ],
      },
      scriptB: {
        style: "Cởi mở & Trách nhiệm (Empathetic & Collaborative)",
        lines: [
          { speaker: "A", text: "Hi Smith, thanks for jumping on this call so quickly." },
          {
            speaker: "B",
            text: "Hi! No problem. How are things looking with the upcoming release?",
          },
          {
            speaker: "A",
            text: "I wanted to reach out directly because we hit an unexpected roadblock with the external payment API, which pushes our delivery back by a few days.",
          },
          { speaker: "B", text: "Oh, that's tough to hear. Are we looking at a long delay?" },
          {
            speaker: "A",
            text: "Not at all. Our team is already on top of it, and we'll have everything wrapped up and tested by Wednesday instead of Monday.",
          },
          {
            speaker: "B",
            text: "Okay, I appreciate you letting me know right away rather than waiting until Monday morning.",
          },
          {
            speaker: "A",
            text: "Of course! We want to make sure the final product is rock-solid for your customers. I'll shoot you a quick note tomorrow with our progress.",
          },
          { speaker: "B", text: "Sounds fair. Thanks for staying on top of it!" },
        ],
      },
    },
  },
];

export function getMockScripts(scenario: string, _level: string): ScriptsResult {
  const lower = scenario.toLowerCase();
  for (const preset of PRESET_SCENARIOS) {
    if (preset.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return preset.data;
    }
  }

  // Dynamic fallback for any custom user scenario
  const topic = scenario.trim();
  return {
    title: `Tình huống: ${topic.slice(0, 35)}...`,
    context: `Luyện tập tình huống giao tiếp: "${topic}".`,
    roleA: "Người nói A (Speaker A)",
    roleB: "Người nói B (Speaker B)",
    scriptA: {
      style: "Lịch sự & Trang trọng (Formal & Polite)",
      lines: [
        {
          speaker: "A",
          text: `Good day. I would like to speak with you regarding ${topic.toLowerCase()}.`,
        },
        {
          speaker: "B",
          text: "Good day! Certainly, I am pleased to assist. Could you please provide more details?",
        },
        {
          speaker: "A",
          text: "I want to make sure we handle this properly and reach a positive outcome for both of us.",
        },
        {
          speaker: "B",
          text: "I completely agree with your approach. Let us go through the necessary steps together.",
        },
        {
          speaker: "A",
          text: "Thank you very much for your understanding and prompt cooperation.",
        },
        {
          speaker: "B",
          text: "You are most welcome. Please let me know if there is anything else I can clarify.",
        },
      ],
    },
    scriptB: {
      style: "Tự nhiên & Thân thiện (Natural & Friendly)",
      lines: [
        {
          speaker: "A",
          text: `Hey there! Do you have a moment to chat about ${topic.toLowerCase()}?`,
        },
        {
          speaker: "B",
          text: "Hey! Absolutely, I'm glad you brought that up. What's on your mind?",
        },
        {
          speaker: "A",
          text: "I just wanted to make sure we're on the same page and figure out the best way forward.",
        },
        {
          speaker: "B",
          text: "Totally makes sense! I'm completely with you on this. Let's work it out together.",
        },
        { speaker: "A", text: "Awesome, thanks so much! Really appreciate you taking the time." },
        { speaker: "B", text: "No worries at all! Let's keep in touch as things progress." },
      ],
    },
  };
}

export function getMockRoleplayReply(opts: {
  scenario: string;
  aiRole: string;
  userRole: string;
  styleHint: string | null;
  conversation: Turn[];
  level: string;
}): { reply: string; ended: boolean } {
  const turns = opts.conversation;
  const count = turns.length;

  // If conversation is empty, AI opens the conversation
  if (count === 0) {
    if (opts.styleHint) {
      const firstLine = opts.styleHint.split("\n")[0];
      if (firstLine && firstLine.startsWith(`${opts.aiRole}:`)) {
        return { reply: firstLine.replace(`${opts.aiRole}:`, "").trim(), ended: false };
      }
    }
    return {
      reply: `Hello! I'm ${opts.aiRole}. How can I help you today regarding our scenario: "${opts.scenario}"?`,
      ended: false,
    };
  }

  // If styleHint is provided (script mode), try to follow script progression
  if (opts.styleHint) {
    const lines = opts.styleHint.split("\n").filter((l) => l.trim().length > 0);
    // Find next line that belongs to AI role
    const aiLines = lines.filter((l) => l.startsWith(`${opts.aiRole}:`));
    const aiIndex = Math.floor(count / 2);
    const targetLine = aiLines[aiIndex];
    if (targetLine) {
      const lineText = targetLine.replace(`${opts.aiRole}:`, "").trim();
      const isLast = aiIndex >= aiLines.length - 1 || count >= 7;
      return { reply: lineText, ended: isLast };
    }
  }

  // Natural response based on user input
  const lastUserTurn = turns[turns.length - 1]?.text ?? "";
  const lower = lastUserTurn.toLowerCase();

  if (count >= 7 || lower.includes("bye") || lower.includes("thank") || lower.includes("cảm ơn")) {
    return {
      reply: `Thank you so much! It was truly a pleasure speaking with you today. Have a wonderful rest of your day!`,
      ended: true,
    };
  }

  if (
    lower.includes("leave") ||
    lower.includes("vacation") ||
    lower.includes("off") ||
    lower.includes("nghỉ")
  ) {
    return {
      reply:
        "I completely understand your request. As long as your ongoing tasks are covered, that shouldn't be an issue. Have you submitted the formal request yet?",
      ended: false,
    };
  }

  if (
    lower.includes("vegetarian") ||
    lower.includes("vegan") ||
    lower.includes("chay") ||
    lower.includes("food")
  ) {
    return {
      reply:
        "Our vegetarian dishes are prepared fresh daily with seasonal vegetables! Would you like to try our special house recommendation?",
      ended: false,
    };
  }

  return {
    reply: `I see what you mean. That makes a lot of sense. What do you think would be the best next step for us to take?`,
    ended: false,
  };
}

export function getMockAssistance(opts: {
  level: "idea" | "phrase" | "script";
  conversation: Turn[];
}): { suggestion: string; translation: string | null } {
  if (opts.level === "idea") {
    return {
      suggestion:
        "Hãy giải thích rõ lý do hoặc chi tiết công việc, sau đó đề xuất phương án giải quyết cụ thể và hỏi ý kiến của đối phương.",
      translation: null,
    };
  }
  if (opts.level === "phrase") {
    return {
      suggestion: "I was wondering if it would be possible to...",
      translation: "Tôi đang tự hỏi liệu có thể...",
    };
  }
  return {
    suggestion:
      "I would really appreciate it if we could arrange that. I have already prepared everything in advance to make sure there are no issues.",
    translation:
      "Tôi rất cảm kích nếu chúng ta có thể thu xếp việc này. Tôi đã chuẩn bị trước mọi thứ để đảm bảo không có vấn đề gì phát sinh.",
  };
}

export function getMockFeedback(opts: { conversation: Turn[]; assistsUsed: number }): {
  overall: number;
  scores: Array<{ name: string; score: number }>;
  strengths: string[];
  improvements: string[];
} {
  const userTurns = opts.conversation.filter((t) => t.speaker === "user");
  const baseScore = Math.min(
    9.5,
    Math.max(7.0, 8.5 - opts.assistsUsed * 0.3 + (userTurns.length > 2 ? 0.5 : 0)),
  );
  const rounded = Math.round(baseScore * 10) / 10;

  return {
    overall: rounded,
    scores: [
      {
        name: "Ngữ pháp & Cấu trúc câu",
        score: Math.min(10, Math.round((rounded + 0.2) * 10) / 10),
      },
      { name: "Độ lưu loát & Tự nhiên", score: rounded },
      {
        name: "Vốn từ vựng theo ngữ cảnh",
        score: Math.min(10, Math.round((rounded + 0.4) * 10) / 10),
      },
      {
        name: "Khả năng duy trì hội thoại",
        score: Math.max(6.5, Math.round((rounded - 0.2) * 10) / 10),
      },
    ],
    strengths: [
      "Sử dụng từ ngữ lịch sự, phù hợp với vai trò của nhân vật trong tình huống.",
      "Cấu trúc câu rõ ràng, diễn đạt mạch lạc ý định giao tiếp.",
      "Tương tác tự nhiên và phản hồi đúng trọng tâm câu hỏi của đối phương.",
    ],
    improvements: [
      "Có thể sử dụng thêm các cụm từ nối (linking words) như 'Furthermore', 'As a matter of fact' để tăng tính liên kết.",
      "Thử mở rộng thêm 1 câu chi tiết bổ sung sau mỗi câu trả lời ngắn để cuộc hội thoại thêm phong phú.",
    ],
  };
}
