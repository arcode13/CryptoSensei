"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Send, Sparkles, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SenseiCharacter from "./SenseiCharacter";

const SAMPLE_NEWS = [
  "Bitcoin ETF records $500M inflows in a single day as institutional demand surges",
  "Ethereum's Pectra upgrade goes live, enabling smart account wallets for all users",
  "Franklin Templeton launches Solana ETF on Wall Street amid rising institutional interest",
  "DeFi TVL crosses $200B milestone as new protocols attract record liquidity",
  "Vanguard now allows trading of crypto-based ETFs and digital asset funds",
];

export default function NewsExplainer() {
  const [newsInput, setNewsInput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [hasResult, setHasResult] = useState(false);

  const analyzeNews = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setExplanation("");
    setStreamingContent("");
    setHasResult(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: content.trim() }],
          mode: "news",
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

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
              // ignore
            }
          }
        }
      }

      setExplanation(fullContent);
      setStreamingContent("");
      setHasResult(true);
    } catch (error) {
      console.error("News analysis error:", error);
      setExplanation("Sumimasen! Something went wrong. Please try again.");
      setHasResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setNewsInput("");
    setExplanation("");
    setStreamingContent("");
    setHasResult(false);
  };

  const displayContent = streamingContent || explanation;

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SenseiCharacter mood={isLoading ? "thinking" : hasResult ? "explaining" : "idle"} size={64} animate />
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Newspaper className="text-gold-400" size={20} />
            News Explainer
          </h2>
          <p className="text-sm text-white/50">
            Paste any crypto headline - Sensei will break it down for you
          </p>
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-3">
        <textarea
          value={newsInput}
          onChange={(e) => setNewsInput(e.target.value)}
          placeholder="Paste a crypto news headline or article excerpt here...

Example: 'Bitcoin ETF records $500M inflows in a single day as institutional demand surges'"
          rows={4}
          className="w-full bg-white/5 border border-gold-700/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-gold-500/60 transition-all"
          disabled={isLoading}
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => analyzeNews(newsInput)}
            disabled={!newsInput.trim() || isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-dark-900 transition-all glow-gold"
          >
            <Send size={14} />
            {isLoading ? "Analyzing..." : "Explain This News"}
          </button>

          {hasResult && (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/15 hover:border-gold-500/40 text-white/60 hover:text-gold-400 rounded-xl text-sm transition-all"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Sample headlines */}
      {!hasResult && !isLoading && (
        <div className="space-y-2">
          <p className="text-xs text-white/30 flex items-center gap-1">
            <Sparkles size={12} className="text-gold-500/60" />
            Or try a sample headline:
          </p>
          <div className="space-y-1.5">
            {SAMPLE_NEWS.map((news) => (
              <button
                key={news}
                onClick={() => {
                  setNewsInput(news);
                  analyzeNews(news);
                }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg border border-gold-700/20 text-white/50 hover:border-gold-500/40 hover:text-white/80 hover:bg-gold-500/5 transition-all truncate"
              >
                📰 {news}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {(displayContent || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 glass rounded-2xl p-5 overflow-y-auto"
          >
            {isLoading && !displayContent ? (
              <div className="flex items-center gap-3 text-gold-400/60">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-sm">Sensei is analyzing the news...</span>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none prose-headings:text-gold-400 prose-strong:text-gold-300 prose-h2:text-base prose-h3:text-sm">
                <ReactMarkdown>{displayContent}</ReactMarkdown>
                {streamingContent && (
                  <span className="inline-block w-1.5 h-4 bg-gold-400 animate-pulse ml-1 align-middle" />
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
