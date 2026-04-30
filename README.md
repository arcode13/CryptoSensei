# CryptoSensei 🎓

> **AI-Powered Crypto Education Agent** - Learn Web3, Bitcoin, DeFi, and more with your intelligent anime sensei guide.

Built for **Wealthy People Stage 2 Developer Recruitment**.

---

## What is CryptoSensei?

CryptoSensei is a web application where an anime-style AI character named **Sensei** helps users learn about the world of cryptocurrency and Web3. Unlike a generic chatbot, Sensei is the **core product** - every feature is built around the AI's educational persona.

### Features

| Feature | Description |
|---|---|
| 🎓 **Ask Sensei** | Real-time AI chat for any crypto question. Sensei answers in clear, engaging language with streaming responses |
| 📰 **News Explainer** | Paste any crypto headline - Sensei breaks it down into: what happened, why it matters, who's affected, what to watch |
| 🧠 **Crypto Quiz** | Interactive AI-generated quizzes on 8 crypto topics with instant explanations |

### AI Character: Sensei

Sensei is a custom SVG anime-style character that reacts to the conversation:
- **Idle** - calm, ready to help
- **Thinking** - processing your question  
- **Explaining** - actively teaching
- **Happy** - celebrating correct answers
- **Surprised** - when discussing risk/warnings
- **Cool** - for casual or impressive facts

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **AI**: OpenRouter API (GPT-4o)
- **Deployment**: Vercel

---

## Getting Started

### Prerequisites

- Node.js 18+
- OpenRouter API Key ([openrouter.ai](https://openrouter.ai))

### Installation

```bash
git clone https://github.com/arcode13/CryptoSensei
cd cryptosensei
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENROUTER_API_KEY=your_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo to [vercel.com](https://vercel.com)
3. Add environment variables:
   - `OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL)
4. Deploy

---

## Project Branding

- **Color Palette**: Dark obsidian background (#0A0A0A) with gold accent (#F59E0B)
- **Typography**: Inter (clean, modern, readable)
- **Visual Style**: Dark crypto-native UI with glass morphism cards
- **Character**: Custom SVG anime sensei with reactive expressions
- **Inspiration**: The gold/dark aesthetic mirrors the Wealthy People brand identity

---

## Why CryptoSensei?

Wealthy People's mission is *"Sitou Timou Tumou Tou"* - humans live to educate other humans. CryptoSensei embodies this philosophy: making crypto education **accessible, engaging, and intelligent** through AI.

The platform directly solves the biggest barrier to crypto adoption: **lack of trustworthy, simplified education**.

---

Built with ❤️ by Muh. Syahrul Minanul Aziz
