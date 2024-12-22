import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OverviewChartProps {
  isDarkMode: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
  label?: string;
}

const OverviewChart: React.FC<OverviewChartProps> = ({ isDarkMode }) => {
  const launchData = useMemo(() => {
    const data: Record<string, number> = {};
    for (let year = 1979; year <= 2024; year++) {
      data[year.toString()] = Math.floor(Math.random() * 8);
    }
    return data;
  }, []);

  const themeColors = {
    glassBg: isDarkMode
      ? "bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150"
      : "bg-white/50 backdrop-blur-lg backdrop-saturate-150",
    text: isDarkMode ? "text-slate-100" : "text-slate-900",
    subText: isDarkMode ? "text-slate-400" : "text-slate-600",
    border: isDarkMode ? "border-slate-700/50" : "border-slate-200/50",
    chartGrid: isDarkMode ? "#1e293b" : "#e2e8f0",
    chartText: isDarkMode ? "#94a3b8" : "#475569",
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`${themeColors.glassBg} p-3 border ${themeColors.border} rounded-lg shadow-xl`}
        >
          <p className={`${themeColors.text} font-medium`}>Year: {label}</p>
          <p className={`${themeColors.subText}`}>
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className={`${themeColors.glassBg} border ${themeColors.border} hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300`}
    >
      <CardHeader>
        <CardTitle className={`${themeColors.text} text-lg`}>
          Launch Success Rate
        </CardTitle>
        <CardDescription className={themeColors.subText}>
          Annual success rate trends
        </CardDescription>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={Object.entries(launchData).map(([year, count]) => ({
              year,
              launches: count,
            }))}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={themeColors.chartGrid}
            />
            <XAxis
              dataKey="year"
              stroke={themeColors.chartText}
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke={themeColors.chartText} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="launches"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={{ fill: "#3b82f6" }}
              activeDot={{ r: 8, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OverviewChart;
