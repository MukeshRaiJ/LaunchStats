"use client";
import React, { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const backgroundColors = {
  dark: {
    background: "bg-slate-900",
    glassBg: "bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150",
    cardGlow: "bg-blue-500/10",
    text: "text-slate-100",
    subText: "text-slate-400",
    cardBg: "bg-slate-800/50 backdrop-blur-md",
    highlight: "text-cyan-400",
    success: "text-emerald-400",
    border: "border-slate-700/50",
    chartGrid: "#1e293b",
    chartText: "#94a3b8",
    chartColors: [
      "#38bdf8",
      "#4ade80",
      "#fbbf24",
      "#f87171",
      "#a78bfa",
      "#34d399",
    ],
  },
  light: {
    background: "bg-slate-50",
    glassBg: "bg-white/50 backdrop-blur-lg backdrop-saturate-150",
    cardGlow: "bg-blue-500/5",
    text: "text-slate-900",
    subText: "text-slate-600",
    cardBg: "bg-white/70 backdrop-blur-md",
    highlight: "text-cyan-600",
    success: "text-emerald-600",
    border: "border-slate-200/50",
    chartGrid: "#e2e8f0",
    chartText: "#475569",
    chartColors: [
      "#0284c7",
      "#059669",
      "#d97706",
      "#dc2626",
      "#7c3aed",
      "#059669",
    ],
  },
};

const AnimatedBg = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-1/2 -right-1/2 w-full h-full">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl"
      />
    </div>
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: 0,
        }}
        animate={{
          y: [null, "-100vh"],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 10,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 5,
        }}
        className="absolute w-1 h-1 bg-white rounded-full"
      />
    ))}
  </div>
);

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  colors: typeof backgroundColors.dark | typeof backgroundColors.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const ThemeSwitch = ({
  isDarkMode,
  setIsDarkMode,
  colors,
}: {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  colors: typeof backgroundColors.dark | typeof backgroundColors.light;
}) => {
  return (
    <div
      className={`fixed top-4 right-4 flex items-center space-x-2 z-50 ${colors.glassBg} p-2 rounded-full border ${colors.border}`}
    >
      <Sun className={`h-4 w-4 ${colors.subText}`} />
      <Switch
        checked={isDarkMode}
        onCheckedChange={setIsDarkMode}
        className="data-[state=checked]:bg-blue-600"
      />
      <Moon className={`h-4 w-4 ${colors.subText}`} />
    </div>
  );
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const colors = isDarkMode ? backgroundColors.dark : backgroundColors.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, colors }}>
      <div
        className={`${colors.background} transition-colors duration-200 relative overflow-hidden`}
      >
        <AnimatedBg />
        <ThemeSwitch
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          colors={colors}
        />
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
