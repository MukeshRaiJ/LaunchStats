import React, { createContext, useContext, useState } from "react";

interface ThemeColors {
  background: string;
  glassBg: string;
  cardGlow: string;
  text: string;
  subText: string;
  cardBg: string;
  highlight: string;
  success: string;
  border: string;
  chartGrid: string;
  chartText: string;
  chartColors: string[];
}

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  colors: ThemeColors;
}

const defaultThemeContext: ThemeContextType = {
  isDarkMode: true,
  setIsDarkMode: () => {},
  colors: {
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
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const colors: ThemeColors = {
    background: isDarkMode ? "bg-slate-900" : "bg-slate-50",
    glassBg: isDarkMode
      ? "bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150"
      : "bg-white/50 backdrop-blur-lg backdrop-saturate-150",
    cardGlow: isDarkMode ? "bg-blue-500/10" : "bg-blue-500/5",
    text: isDarkMode ? "text-slate-100" : "text-slate-900",
    subText: isDarkMode ? "text-slate-400" : "text-slate-600",
    cardBg: isDarkMode
      ? "bg-slate-800/50 backdrop-blur-md"
      : "bg-white/70 backdrop-blur-md",
    highlight: isDarkMode ? "text-cyan-400" : "text-cyan-600",
    success: isDarkMode ? "text-emerald-400" : "text-emerald-600",
    border: isDarkMode ? "border-slate-700/50" : "border-slate-200/50",
    chartGrid: isDarkMode ? "#1e293b" : "#e2e8f0",
    chartText: isDarkMode ? "#94a3b8" : "#475569",
    chartColors: isDarkMode
      ? ["#38bdf8", "#4ade80", "#fbbf24", "#f87171", "#a78bfa", "#34d399"]
      : ["#0284c7", "#059669", "#d97706", "#dc2626", "#7c3aed", "#059669"],
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
