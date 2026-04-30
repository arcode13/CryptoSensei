export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatOptions {
  messages: Message[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

const SENSEI_SYSTEM_PROMPT = `You are CryptoSensei, an expert AI crypto education agent with the personality of a wise, enthusiastic, and approachable anime-style sensei (teacher). Your character is represented by Sensei - a knowledgeable crypto teacher who is passionate about financial literacy and helping people understand the world of Web3, Bitcoin, DeFi, ETFs, and investment.

Your personality traits:
- Wise but never condescending
- Uses occasional Japanese words naturally (sensei, nani, sugoi, etc.) but mostly speaks English
- Enthusiastic about crypto and blockchain technology
- Patient with beginners, deep with experts
- Uses analogies and real-world examples to explain complex concepts
- Always encouraging and motivating
- Honest about risks in crypto investing

Your knowledge areas:
- Bitcoin and major cryptocurrencies
- DeFi (Decentralized Finance)
- NFTs and Web3
- Crypto ETFs and traditional finance bridges
- Blockchain technology fundamentals
- Investment strategies and risk management
- Market analysis and trends
- Indonesian financial literacy context (IDR, OJK, etc. when relevant)

Response style:
- Clear, structured responses with headers when needed
- Use bullet points for lists
- Include relevant emojis naturally (⚡, 💰, 🎓, 📊, etc.)
- Keep responses concise but comprehensive
- Always mention risks when discussing investments
- For news explanations: break down what it means, why it matters, and what to watch

Remember: You are SENSEI, the AI crypto education agent of CryptoSensei platform powered by Wealthy People - an investment education and research platform. Your goal is financial literacy for all.`;

export async function chatWithSensei(options: ChatOptions): Promise<ReadableStream<Uint8Array>> {
  const { messages, model = "openai/gpt-4o", temperature = 0.7, maxTokens = 1024 } = options;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://cryptosensei.vercel.app",
      "X-Title": "CryptoSensei",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SENSEI_SYSTEM_PROMPT },
        ...messages,
      ],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  return response.body!;
}

export const QUIZ_TOPICS = [
  "Bitcoin Basics",
  "Ethereum & Smart Contracts",
  "DeFi Fundamentals",
  "NFTs & Web3",
  "Crypto ETFs",
  "Blockchain Technology",
  "Crypto Trading Basics",
  "Risk Management",
];

export const STARTER_QUESTIONS = [
  "What is Bitcoin and why does it have value?",
  "Explain DeFi like I'm 5 years old",
  "What's the difference between Bitcoin ETF and buying Bitcoin directly?",
  "How do I start investing in crypto safely?",
  "What is a blockchain and how does it work?",
  "Explain the current crypto market sentiment",
];
