"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Newspaper, Brain, Github } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import NewsExplainer from "@/components/NewsExplainer";
import CryptoQuiz from "@/components/CryptoQuiz";
import SenseiCharacter from "@/components/SenseiCharacter";

type Tab = "chat" | "news" | "quiz";

const tabs = [
  { id: "chat" as Tab, label: "Ask Sensei", icon: MessageSquare, desc: "AI crypto Q&A" },
  { id: "news" as Tab, label: "News Explainer", icon: Newspaper, desc: "Break down crypto news" },
  { id: "quiz" as Tab, label: "Crypto Quiz", icon: Brain, desc: "Test your knowledge" },
];

const CRYPTO_TICKER = [
  "₿ Bitcoin (BTC)",
  "⟠ Ethereum (ETH)",
  "◎ Solana (SOL)",
  "DeFi Total Value Locked",
  "📈 Crypto ETF Inflows",
  "⛓️ Blockchain Fundamentals",
  "🌐 Web3 Revolution",
  "💰 Financial Literacy",
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  return (
    <div className="h-screen bg-dark-900 flex flex-col overflow-hidden">
      {/* Ticker bar */}
      <div className="bg-gold-600/10 border-b border-gold-700/20 py-1.5 overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap text-xs text-gold-400/70 font-mono"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...CRYPTO_TICKER, ...CRYPTO_TICKER].map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {item}
              <span className="text-gold-600/40">•</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left sidebar - hero */}
        <div className="hidden lg:flex flex-col w-80 xl:w-96 border-r border-white/5 bg-dark-800/30 p-8 space-y-8 overflow-y-auto">
          {/* Hero character */}
          <motion.div
            className="flex flex-col items-center text-center space-y-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-3xl scale-150" />
              <SenseiCharacter mood="cool" size={180} animate className="relative z-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-tight">
                Crypto<span className="gold-text">Sensei</span>
              </h1>
              <p className="text-sm text-white/50 leading-relaxed">
                Your AI-powered crypto education companion. Learn Web3, Bitcoin, DeFi, and more
                with a personalized intelligent guide.
              </p>
            </div>
          </motion.div>

          {/* Feature cards */}
          <div className="space-y-3">
            {tabs.map((tab, i) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-left ${
                  activeTab === tab.id
                    ? "bg-gold-500/15 border border-gold-500/40 text-white"
                    : "glass hover:bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    activeTab === tab.id ? "bg-gold-500" : "bg-white/8"
                  }`}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? "text-dark-900" : "text-white/50"} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${activeTab === tab.id ? "text-gold-300" : ""}`}>
                    {tab.label}
                  </p>
                  <p className="text-[11px] text-white/35">{tab.desc}</p>
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Topics", value: "8+" },
              { label: "AI Model", value: "GPT-4o" },
              { label: "Language", value: "EN/ID" },
              { label: "Features", value: "3" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gold-400">{stat.value}</p>
                <p className="text-[10px] text-white/30">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          {/* Mobile tab bar */}
          <div className="lg:hidden flex border-b border-white/5 bg-dark-800/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors relative ${
                  activeTab === tab.id ? "text-gold-400" : "text-white/40"
                }`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:block">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full min-h-0"
                >
                  <ChatInterface />
                </motion.div>
              )}

              {activeTab === "news" && (
                <motion.div
                  key="news"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <NewsExplainer />
                </motion.div>
              )}

              {activeTab === "quiz" && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <CryptoQuiz />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-3 px-6 flex items-center justify-between text-[11px] text-white/20">
        <span>CryptoSensei © 2026</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-gold-400/60 transition-colors"
        >
          <Github size={12} />
          GitHub
        </a>
      </footer>
    </div>
  );
}
