import React from "react";
import { motion } from "framer-motion";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm uppercase tracking-widest text-neutral-400">
      {children}
    </h3>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-neutral-900/40 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] ${className}`}
    >
      {children}
    </div>
  );
}

function Wordmark({
  titleSize = "text-6xl",
  tagline = false,
  darkText = false,
}: {
  titleSize?: string;
  tagline?: boolean;
  darkText?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className={`font-black tracking-tight ${titleSize} leading-none`}>
        <span className={`${darkText ? "text-neutral-900" : "text-white"}`}>
          Arqui
        </span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-emerald-400">
          teck
        </span>
      </div>
      {tagline && (
        <div
          className={`mt-2 text-sm ${
            darkText ? "text-neutral-600" : "text-neutral-400"
          }`}
        >
          Foco. Ritmo. Resultados. — Pomodoros a prueba de procrastinación.
        </div>
      )}
    </div>
  );
}

/**
 * LogoMark
 * - Final version based on user feedback.
 * - The dot is now centered below the 'A' shape for a more balanced and focused look.
 * - The arc is a clean, open C-shape, and the 'A' and dot have subtle depth.
 */
function LogoMark({
  size = 96,
  accent = "#22d3ee",
  light = false,
  mono = false,
}: {
  size?: number;
  accent?: string;
  light?: boolean;
  mono?: boolean;
}) {
  const px = `${size}px`;
  const fg = mono ? "#e5e7eb" : accent;
  const ringThickness = size * 0.1;
  const radius = (size - ringThickness) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Define the main arc length (270 degrees)
  const arcLength = circumference * 0.75;
  const gapLength = circumference - arcLength;

  const uniqueId = React.useId();

  return (
    <motion.div
      className="relative select-none flex items-center justify-center"
      style={{ width: px, height: px }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "backOut" }}
    >
      {/* SVG container for the arc, allowing for gradients and precise positioning */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        <defs>
          <linearGradient
            id={`gradient-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={fg} stopOpacity="1" />
            <stop offset="100%" stopColor={fg} stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* The main C-shaped arc with a gradient stroke */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${uniqueId})`}
          strokeWidth={ringThickness}
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeLinecap="round"
          transform={`rotate(135 ${center} ${center})`}
        />
      </svg>

      {/* The 'A' shape, with a drop-shadow filter for depth */}
      <div
        className="relative"
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size * 0.25}px solid transparent`,
          borderRight: `${size * 0.25}px solid transparent`,
          borderBottom: `${size * 0.45}px solid ${fg}`,
          filter: `drop-shadow(0 2px 2px rgba(0,0,0,0.2))`,
        }}
      />

      {/* The dot, centered below the 'A' */}
      <div
        className="absolute rounded-full"
        style={{
          width: ringThickness,
          height: ringThickness,
          background: fg,
          left: "50%",
          top: "88%", // Adjusted slightly lower to sit inside the circle's circumference
          transform: "translate(-50%, -50%)",
          filter: `drop-shadow(0 2px 2px rgba(0,0,0,0.2))`,
        }}
      />
    </motion.div>
  );
}

function AppIcon({ size = 64 }: { size?: number }) {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute inset-0 rounded-[22%] bg-gradient-to-br from-sky-500 to-emerald-400" />
      <div className="absolute inset-[10%] rounded-[18%] bg-neutral-950" />
      <div className="absolute inset-[18%]">
        <LogoMark size={size * 0.64} accent="#ffffff" />
      </div>
    </motion.div>
  );
}

export { LogoMark, Wordmark, AppIcon, Card, SectionTitle };
