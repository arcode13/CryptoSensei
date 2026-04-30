"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Brain, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SenseiCharacter from "./SenseiCharacter";
import { QUIZ_TOPICS } from "@/lib/openrouter";

type QuizState = "select" | "question" | "answer" | "loading";

interface QuizSession {
  topic: string;
  question: string;
  selected: string | null;
}

const TOPIC_EMOJIS: Record<string, string> = {
  "Bitcoin Basics": "₿",
  "Ethereum & Smart Contracts": "⟠",
  "DeFi Fundamentals": "🏦",
  "NFTs & Web3": "🖼️",
  "Crypto ETFs": "📈",
  "Blockchain Technology": "⛓️",
  "Crypto Trading Basics": "📊",
  "Risk Management": "🛡️",
};

export default function CryptoQuiz() {
  const [state, setState] = useState<QuizState>("select");
  const [session, setSession] = useState<QuizSession | null>(null);
  const [streamingQ, setStreamingQ] = useState("");
  const [answerStream, setAnswerStream] = useState("");
  const [answerFull, setAnswerFull] = useState("");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);

  const startQuiz = async (topic: string) => {
    setState("loading");
    setStreamingQ("");
    setAnswerFull("");
    setAnswerStream("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: topic }],
          mode: "quiz",
        }),
      });

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
                setStreamingQ(fullContent);
              }
            } catch {
              // ignore
            }
          }
        }
      }

      setSession({ topic, question: fullContent, selected: null });
      setState("question");
    } catch {
      setState("select");
    }
  };

  const submitAnswer = async (answer: string) => {
    if (!session) return;
    setState("loading");
    setIsCheckingAnswer(true);
    setAnswerStream("");
    setAnswerFull("");

    const updatedSession = { ...session, selected: answer };
    setSession(updatedSession);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "assistant", content: session.question },
            {
              role: "user",
              content: `My answer is: **${answer}**\n\nPlease reveal the correct answer and provide a detailed educational explanation. Use this format:\n\n✅ **Correct Answer: [Letter]**\n\n[Whether my answer was right or wrong]\n\n**Explanation:**\n[Comprehensive educational explanation of why this is the answer, with real-world context and examples]`,
            },
          ],
          mode: "chat",
        }),
      });

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
                setAnswerStream(fullContent);
              }
            } catch {
              // ignore
            }
          }
        }
      }

      const correct = fullContent.toLowerCase().includes(`correct answer: ${answer.toLowerCase()}`);
      setIsAnswerCorrect(correct);
      setScore((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        total: s.total + 1,
      }));
      setAnswerFull(fullContent);
      setAnswerStream("");
      setState("answer");
    } catch {
      setState("question");
    } finally {
      setIsCheckingAnswer(false);
    }
  };

  const extractOptions = (text: string) => {
    const matches = text.match(/\*\*([A-D])\)\*\*\s*(.+)/g) || [];
    return matches.map((m) => {
      const match = m.match(/\*\*([A-D])\)\*\*\s*(.+)/);
      return match ? { letter: match[1], text: match[2].trim() } : null;
    }).filter(Boolean) as { letter: string; text: string }[];
  };

  const displayQuestion = streamingQ || session?.question || "";

  return (
    <div className="flex flex-col h-full p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SenseiCharacter
            mood={state === "loading" ? "thinking" : state === "answer" ? (isAnswerCorrect ? "happy" : "surprised") : "explaining"}
            size={64}
            animate
          />
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="text-gold-400" size={20} />
              Crypto Quiz
            </h2>
            <p className="text-sm text-white/50">Test your crypto knowledge with Sensei</p>
          </div>
        </div>
        {score.total > 0 && (
          <div className="glass px-4 py-2 rounded-xl text-center">
            <div className="flex items-center gap-1.5 text-gold-400">
              <Trophy size={14} />
              <span className="font-bold">{score.correct}/{score.total}</span>
            </div>
            <p className="text-[10px] text-white/30">Score</p>
          </div>
        )}
      </div>

      {/* Topic Selection */}
      <AnimatePresence mode="wait">
        {state === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="text-sm text-white/50">Choose a topic to start the quiz:</p>
            <div className="grid grid-cols-2 gap-2">
              {QUIZ_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => startQuiz(topic)}
                  className="p-3 glass rounded-xl text-left hover:border-gold-500/40 hover:bg-gold-500/5 transition-all group"
                >
                  <span className="text-2xl block mb-1">{TOPIC_EMOJIS[topic] || "📚"}</span>
                  <span className="text-xs font-medium text-white/70 group-hover:text-white/90">{topic}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {(state === "loading" || state === "question") && (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 space-y-4"
          >
            {session && (
              <div className="glass px-3 py-1.5 rounded-lg inline-block">
                <span className="text-xs text-gold-400">{TOPIC_EMOJIS[session.topic]} {session.topic}</span>
              </div>
            )}

            <div className="glass rounded-2xl p-4 prose prose-invert prose-sm max-w-none prose-headings:text-gold-400 prose-strong:text-gold-300">
              <ReactMarkdown>{displayQuestion}</ReactMarkdown>
              {state === "loading" && !displayQuestion && (
                <div className="flex gap-1 items-center text-gold-400/60">
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  <span className="text-sm ml-2">Generating question...</span>
                </div>
              )}
            </div>

            {(state === "question" || (state === "loading" && isCheckingAnswer)) && session && (
              <div className="space-y-2">
                <p className="text-xs text-white/40">
                  {isCheckingAnswer
                    ? `Sensei is checking your answer ${session.selected ? `(${session.selected})` : ""}...`
                    : "Select your answer:"}
                </p>
                {isCheckingAnswer && (
                  <div className="flex items-center gap-2 text-xs text-gold-400/80 bg-gold-500/10 border border-gold-500/20 rounded-lg px-3 py-2">
                    <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="ml-1">Analyzing and preparing explanation...</span>
                  </div>
                )}
                {extractOptions(session.question).map((opt) => (
                  <button
                    key={opt.letter}
                    onClick={() => submitAnswer(opt.letter)}
                    disabled={isCheckingAnswer}
                    className={`w-full flex items-center gap-3 p-3 glass rounded-xl text-left transition-all ${
                      isCheckingAnswer
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:border-gold-500/50 hover:bg-gold-500/5"
                    } ${session.selected === opt.letter ? "border-gold-500/60 bg-gold-500/10" : ""}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        session.selected === opt.letter
                          ? "bg-gold-500 text-dark-900"
                          : "bg-gold-500/20 text-gold-400"
                      }`}
                    >
                      {opt.letter}
                    </span>
                    <span className="text-sm text-white/80">{opt.text}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {state === "answer" && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 space-y-4"
          >
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isAnswerCorrect ? "bg-green-500/15 border border-green-500/30" : "bg-red-500/15 border border-red-500/30"}`}>
              {isAnswerCorrect ? (
                <CheckCircle2 className="text-green-400" size={18} />
              ) : (
                <XCircle className="text-red-400" size={18} />
              )}
              <span className={`text-sm font-semibold ${isAnswerCorrect ? "text-green-400" : "text-red-400"}`}>
                {isAnswerCorrect ? "Correct! Sugoi! 🎉" : "Not quite - let Sensei explain! 📚"}
              </span>
            </div>

            <div className="glass rounded-2xl p-4 overflow-y-auto max-h-64 prose prose-invert prose-sm max-w-none prose-headings:text-gold-400 prose-strong:text-gold-300">
              <ReactMarkdown>{answerFull || answerStream}</ReactMarkdown>
              {answerStream && !answerFull && (
                <span className="inline-block w-1.5 h-4 bg-gold-400 animate-pulse ml-1 align-middle" />
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => session && startQuiz(session.topic)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gold-500 hover:bg-gold-400 rounded-xl text-sm font-semibold text-dark-900 transition-all"
              >
                <RefreshCw size={14} />
                Next Question
              </button>
              <button
                onClick={() => {
                  setState("select");
                  setSession(null);
                  setIsAnswerCorrect(null);
                }}
                className="px-4 py-2.5 border border-white/15 hover:border-gold-500/40 text-white/60 hover:text-gold-400 rounded-xl text-sm transition-all"
              >
                Change Topic
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
