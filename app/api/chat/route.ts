import { NextRequest, NextResponse } from "next/server";
import { chatWithSensei, Message } from "@/lib/openrouter";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, mode } = body as { messages: Message[]; mode?: string };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    let processedMessages = messages;

    if (mode === "news") {
      const lastMessage = messages[messages.length - 1];
      processedMessages = [
        ...messages.slice(0, -1),
        {
          role: "user" as const,
          content: `Please analyze and explain this crypto news article/headline for me. Break it down into:
1. **What happened** - A simple summary
2. **Why it matters** - Impact on the crypto market
3. **Who is affected** - Which coins, sectors, or investors
4. **What to watch** - Future implications to monitor
5. **Sensei's take** - Your personal educational insight

News to analyze:
${lastMessage.content}`,
        },
      ];
    }

    if (mode === "quiz") {
      const lastMessage = messages[messages.length - 1];
      processedMessages = [
        {
          role: "user" as const,
          content: `Create an engaging crypto quiz about: "${lastMessage.content}"

Format your response EXACTLY as follows:
🎓 **Quiz: [Topic Name]**

**Question:** [Clear, educational question about the topic]

**A)** [Option A]
**B)** [Option B]  
**C)** [Option C]
**D)** [Option D]

*(Reply with A, B, C, or D - I'll reveal the answer and explain!)*`,
        },
      ];
    }

    const stream = await chatWithSensei({
      messages: processedMessages,
      temperature: mode === "quiz" ? 0.8 : 0.7,
      maxTokens: mode === "news" ? 1200 : 1024,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
