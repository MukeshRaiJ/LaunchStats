import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Using Arrow icons for a more elegant look

interface RocketNavigationProps {
  onNavigate: (direction: "prev" | "next") => void;
  colors: {
    cardGlow: string;
    highlight: string;
    text: string;
    subText: string;
  };
  currentIndex: number;
  totalRockets: number;
}

const RocketNavigation: React.FC<RocketNavigationProps> = ({
  onNavigate,
  colors,
  currentIndex,
  totalRockets,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => onNavigate("prev")}
        className={`group p-3 rounded-full ${colors.cardGlow} hover:scale-105 transition-all duration-300`}
      >
        <ArrowLeft
          size={20}
          className={`${colors.highlight} group-hover:-translate-x-0.5 transition-transform duration-300`}
        />
      </button>
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${colors.cardGlow} overflow-x-auto max-w-[200px]`}
      >
        {[...Array(totalRockets)].map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full bg-current transition-all duration-300 ${
              index === currentIndex
                ? colors.highlight
                : `${colors.subText} opacity-30`
            }`}
          />
        ))}
      </div>
      <button
        onClick={() => onNavigate("next")}
        className={`group p-3 rounded-full ${colors.cardGlow} hover:scale-105 transition-all duration-300`}
      >
        <ArrowRight
          size={20}
          className={`${colors.highlight} group-hover:translate-x-0.5 transition-transform duration-300`}
        />
      </button>
    </div>
  );
};

export default RocketNavigation;
