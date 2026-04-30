"use client";

import { motion } from "framer-motion";

export type SenseiMood = "idle" | "thinking" | "happy" | "explaining" | "surprised" | "cool";

interface SenseiCharacterProps {
  mood?: SenseiMood;
  size?: number;
  className?: string;
  animate?: boolean;
}

const moodColors: Record<SenseiMood, { face: string; glow: string; eye: string }> = {
  idle: { face: "#1a1a2e", glow: "rgba(245,158,11,0.3)", eye: "#f59e0b" },
  thinking: { face: "#16213e", glow: "rgba(99,102,241,0.4)", eye: "#818cf8" },
  happy: { face: "#1a2e1a", glow: "rgba(34,197,94,0.4)", eye: "#22c55e" },
  explaining: { face: "#1a1a2e", glow: "rgba(245,158,11,0.5)", eye: "#fcd34d" },
  surprised: { face: "#2e1a1a", glow: "rgba(239,68,68,0.4)", eye: "#ef4444" },
  cool: { face: "#1a1a2e", glow: "rgba(245,158,11,0.6)", eye: "#f59e0b" },
};

function EyeShape({ mood, x, y }: { mood: SenseiMood; x: number; y: number }) {
  if (mood === "happy") {
    return (
      <path
        d={`M${x - 8} ${y + 2} Q${x} ${y - 8} ${x + 8} ${y + 2}`}
        stroke="#22c55e"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  if (mood === "thinking") {
    return (
      <>
        <ellipse cx={x} cy={y} rx="7" ry="5" fill="#818cf8" opacity="0.9" />
        <ellipse cx={x - 1} cy={y - 1} rx="2.5" ry="2.5" fill="#1e1b4b" />
      </>
    );
  }
  if (mood === "surprised") {
    return (
      <>
        <ellipse cx={x} cy={y} rx="8" ry="8" fill="#ef4444" opacity="0.9" />
        <ellipse cx={x - 1} cy={y - 1} rx="3" ry="3" fill="#7f1d1d" />
      </>
    );
  }
  if (mood === "cool") {
    return (
      <rect
        x={x - 10}
        y={y - 4}
        width="20"
        height="8"
        rx="4"
        fill="#1a1a1a"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
    );
  }
  return (
    <>
      <ellipse cx={x} cy={y} rx="7" ry="6" fill={moodColors[mood].eye} opacity="0.95" />
      <ellipse cx={x - 1.5} cy={y - 1.5} rx="2" ry="2" fill="#0a0a0a" />
      <ellipse cx={x + 2} cy={y - 2} rx="1" ry="1" fill="white" opacity="0.8" />
    </>
  );
}

function MouthShape({ mood }: { mood: SenseiMood }) {
  if (mood === "happy" || mood === "explaining") {
    return (
      <path
        d="M 82 138 Q 95 150 108 138"
        stroke="#f59e0b"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  if (mood === "surprised") {
    return <ellipse cx="95" cy="142" rx="6" ry="8" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />;
  }
  if (mood === "thinking") {
    return (
      <path
        d="M 82 140 Q 95 138 108 140"
        stroke="#818cf8"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  return (
    <path
      d="M 84 140 Q 95 145 106 140"
      stroke="#d97706"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  );
}

export default function SenseiCharacter({
  mood = "idle",
  size = 220,
  className = "",
  animate = true,
}: SenseiCharacterProps) {
  const colors = moodColors[mood];

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={animate ? { y: [0, -8, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: colors.glow }}
        animate={animate ? { scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 190 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow ring */}
        <circle cx="95" cy="105" r="88" fill={colors.glow} opacity="0.3" />

        {/* Robe / body */}
        <path
          d="M 40 185 Q 30 220 15 225 L 175 225 Q 160 220 150 185 Q 135 160 115 155 L 75 155 Q 55 160 40 185 Z"
          fill="#1a1a2e"
          stroke="rgba(245,158,11,0.4)"
          strokeWidth="1.5"
        />
        {/* Robe collar line */}
        <path
          d="M 75 155 Q 95 175 115 155"
          stroke="#d97706"
          strokeWidth="2"
          fill="none"
        />
        {/* Bitcoin symbol on chest */}
        <text x="87" y="195" fontSize="18" fill="#f59e0b" opacity="0.8" fontWeight="bold">
          ₿
        </text>

        {/* Neck */}
        <rect x="82" y="145" width="26" height="14" rx="6" fill="#e8b98a" />

        {/* Head */}
        <ellipse cx="95" cy="105" rx="55" ry="58" fill="#f0c27f" />
        {/* Head shading */}
        <ellipse cx="95" cy="115" rx="48" ry="48" fill="#e8b98a" opacity="0.4" />

        {/* Hair - top */}
        <ellipse cx="95" cy="55" rx="54" ry="22" fill="#1a1a1a" />
        <path
          d="M 42 65 Q 35 50 40 40 Q 50 25 65 22 L 125 22 Q 140 25 150 40 Q 155 50 148 65"
          fill="#1a1a1a"
        />
        {/* Hair spikes (anime style) */}
        <path d="M 60 28 Q 55 10 68 15 Q 62 25 60 28 Z" fill="#1a1a1a" />
        <path d="M 80 22 Q 78 5 90 8 Q 84 20 80 22 Z" fill="#1a1a1a" />
        <path d="M 100 20 Q 100 3 112 7 Q 106 18 100 20 Z" fill="#1a1a1a" />
        <path d="M 118 25 Q 120 8 130 14 Q 124 22 118 25 Z" fill="#1a1a1a" />

        {/* Ears */}
        <ellipse cx="40" cy="108" rx="8" ry="10" fill="#e8b98a" />
        <ellipse cx="150" cy="108" rx="8" ry="10" fill="#e8b98a" />

        {/* Glasses frame */}
        <rect
          x="52"
          y="96"
          width="34"
          height="22"
          rx="8"
          fill="rgba(245,158,11,0.1)"
          stroke="#d97706"
          strokeWidth="2"
        />
        <rect
          x="104"
          y="96"
          width="34"
          height="22"
          rx="8"
          fill="rgba(245,158,11,0.1)"
          stroke="#d97706"
          strokeWidth="2"
        />
        {/* Glasses bridge */}
        <line x1="86" y1="107" x2="104" y2="107" stroke="#d97706" strokeWidth="2" />
        {/* Glasses arm left */}
        <line x1="52" y1="107" x2="44" y2="105" stroke="#d97706" strokeWidth="2" />
        {/* Glasses arm right */}
        <line x1="138" y1="107" x2="146" y2="105" stroke="#d97706" strokeWidth="2" />

        {/* Eyes (inside glasses) */}
        <EyeShape mood={mood} x={69} y={107} />
        <EyeShape mood={mood} x={121} y={107} />

        {/* Nose */}
        <path
          d="M 92 118 Q 95 125 98 118"
          stroke="#c8956a"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Mouth */}
        <MouthShape mood={mood} />

        {/* Eyebrows */}
        {mood === "surprised" ? (
          <>
            <path d="M 54 90 Q 69 82 84 90" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 106 90 Q 121 82 136 90" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : mood === "thinking" ? (
          <>
            <path d="M 54 92 Q 69 88 84 94" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 106 88 Q 121 92 136 94" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M 54 93 Q 69 88 84 93" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 106 93 Q 121 88 136 93" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Thinking bubble (only for thinking mood) */}
        {mood === "thinking" && (
          <>
            <circle cx="155" cy="75" r="3" fill="#818cf8" opacity="0.7" />
            <circle cx="163" cy="62" r="5" fill="#818cf8" opacity="0.7" />
            <circle cx="172" cy="48" r="8" fill="#818cf8" opacity="0.7" />
            <text x="168" y="52" fontSize="8" fill="white" textAnchor="middle">
              ?
            </text>
          </>
        )}

        {/* Stars for happy/cool mood */}
        {(mood === "happy" || mood === "cool") && (
          <>
            <text x="20" y="75" fontSize="14" fill="#fcd34d" opacity="0.8">
              ✦
            </text>
            <text x="158" y="70" fontSize="10" fill="#fcd34d" opacity="0.8">
              ✦
            </text>
            <text x="165" y="85" fontSize="8" fill="#fcd34d" opacity="0.6">
              ✦
            </text>
          </>
        )}
      </svg>
    </motion.div>
  );
}
