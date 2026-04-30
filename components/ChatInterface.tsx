"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RotateCcw, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SenseiCharacter, { SenseiMood } from "./SenseiCharacter";
import { STARTER_QUESTIONS } from "@/lib/openrouter";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function getRandomId() {
  return Math.random().toString(36).slice(2);
}

function detectMood(text: string): SenseiMood {
  const lower = text.toLowerCase();
  if (lower.includes("?") && lower.length < 80) return "thinking";
  if (lower.includes("great") || lower.includes("excellent") || lower.includes("congrat")) return "happy";
  if (lower.includes("warning") || lower.includes("risk") || lower.includes("careful")) return "surprised";
  if (lower.includes("let me explain") || lower.includes("here's") || lower.includes("understand")) return "explaining";
  if (lower.includes("cool") || lower.includes("amazing") || lower.includes("wow")) return "cool";
  return "idle";
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Yosh! 🎓 Greetings, I'm **Sensei** - your AI crypto education companion!\n\nI'm here to help you master the world of **Bitcoin, DeFi, Web3, ETFs**, and everything in between. Whether you're a complete beginner or a seasoned trader looking to deepen your knowledge - I've got you covered.\n\nWhat would you like to learn today? Ask me anything! ⚡",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [senseiMood, setSenseiMood] = useState<SenseiMood>("idle");
  const [streamingContent, setStreamingContent] = useState("");
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior,
    });
    messagesEndRef.current?.scrollIntoView({ behavior });
    setShowScrollDown(false);
  }, []);

  const handleMessagesScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollDown(distanceFromBottom > 120);
  }, []);

  useEffect(() => {
    if (!showScrollDown) {
      scrollToBottom();
    }
  }, [messages, streamingContent, showScrollDown, scrollToBottom]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: getRandomId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setSenseiMood("thinking");
      setStreamingContent("");

      const historyMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      abortRef.current = new AbortController();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyMessages, mode: "chat" }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) throw new Error("API request failed");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        setSenseiMood("explaining");

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  fullContent += delta;
                  setStreamingContent(fullContent);
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        }

        const finalMood = detectMood(fullContent);
        setSenseiMood(finalMood);

        setMessages((prev) => [
          ...prev,
          {
            id: getRandomId(),
            role: "assistant",
            content: fullContent,
            timestamp: new Date(),
          },
        ]);
        setStreamingContent("");

        setTimeout(() => setSenseiMood("idle"), 3000);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Chat error:", error);
        setSenseiMood("surprised");
        setMessages((prev) => [
          ...prev,
          {
            id: getRandomId(),
            role: "assistant",
            content: "Sumimasen! 😅 I encountered an error. Please check your connection and try again.",
            timestamp: new Date(),
          },
        ]);
        setStreamingContent("");
        setTimeout(() => setSenseiMood("idle"), 2000);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Yosh! 🎓 Greetings, I'm **Sensei** - your AI crypto education companion!\n\nI'm here to help you master the world of **Bitcoin, DeFi, Web3, ETFs**, and everything in between. Ask me anything! ⚡",
        timestamp: new Date(),
      },
    ]);
    setStreamingContent("");
    setIsLoading(false);
    setSenseiMood("idle");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sensei + header */}
      <div className="flex items-center gap-4 p-4 border-b border-gold-700/20">
        <SenseiCharacter mood={senseiMood} size={72} animate />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gold-400 text-lg">Sensei</h3>
            <span
              className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`}
            />
          </div>
          <p className="text-xs text-white/40">
            {isLoading ? "Thinking..." : "AI Crypto Education Agent"}
          </p>
        </div>
        <button
          onClick={resetChat}
          className="p-2 rounded-lg text-white/30 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
          title="Reset chat"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        className="relative flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-sm flex-shrink-0 mt-1">
                  🎓
                </div>
              )}
              <div
                className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user" ? "chat-bubble-user text-white" : "chat-bubble-ai text-white/90"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-headings:text-gold-400 prose-strong:text-gold-300 prose-code:text-gold-200 prose-a:text-gold-400">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming message */}
        {streamingContent && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-sm flex-shrink-0 mt-1">
              🎓
            </div>
            <div className="max-w-[82%] px-4 py-3 text-sm leading-relaxed chat-bubble-ai text-white/90">
              <div className="prose prose-invert prose-sm max-w-none prose-headings:text-gold-400 prose-strong:text-gold-300">
                <ReactMarkdown>{streamingContent}</ReactMarkdown>
              </div>
              <span className="inline-block w-1.5 h-4 bg-gold-400 animate-pulse ml-1 align-middle" />
            </div>
          </motion.div>
        )}

        {isLoading && !streamingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-sm flex-shrink-0">
              🎓
            </div>
            <div className="chat-bubble-ai px-4 py-3">
              <span className="flex gap-1 items-center text-gold-400/60 text-sm">
                <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />

        {showScrollDown && (
          <button
            onClick={() => scrollToBottom()}
            className="sticky bottom-4 left-1/2 -translate-x-1/2 ml-auto mr-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-dark-900 shadow-lg shadow-gold-500/30 hover:bg-gold-400 transition-all z-20"
            title="Scroll to latest message"
            aria-label="Scroll to latest message"
          >
            <ChevronDown size={18} />
          </button>
        )}
      </div>

      {/* Starter questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-white/30 mb-2 flex items-center gap-1">
            <Sparkles size={12} /> Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {STARTER_QUESTIONS.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-gold-600/30 text-gold-400/80 hover:border-gold-500 hover:text-gold-400 hover:bg-gold-500/10 transition-all truncate max-w-[200px]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gold-700/20">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Sensei anything about crypto..."
            rows={1}
            className="flex-1 bg-white/5 border border-gold-700/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-gold-500/60 focus:bg-white/8 transition-all max-h-32"
            style={{ minHeight: "48px" }}
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-dark-900 flex-shrink-0 glow-gold"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-white/20 mt-2 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
