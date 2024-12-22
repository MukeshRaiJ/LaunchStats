import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
  label?: string;
  colors: {
    text: string;
    subText: string;
    border: string;
    glassBg: string;
  };
}

interface LaunchFrequencyChartProps {
  data: Array<{
    year: string;
    launches: number;
  }>;
  colors: {
    text: string;
    subText: string;
    border: string;
    glassBg: string;
    chartGrid: string;
    chartText: string;
  };
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  colors,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`${colors.glassBg} p-3 border ${colors.border} rounded-lg shadow-xl`}
      >
        <p className={`${colors.text} font-medium`}>Year: {label}</p>
        <p className={`${colors.subText}`}>Launches: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const LaunchFrequencyChart: React.FC<LaunchFrequencyChartProps> = ({
  data,
  colors,
}) => {
  return (
    <Card
      className={`${colors.glassBg} border ${colors.border} hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300`}
    >
      <CardHeader>
        <CardTitle className={`${colors.text} text-lg`}>
          Launch Frequency by Year
        </CardTitle>
        <CardDescription className={colors.subText}>
          Number of launches conducted each year
        </CardDescription>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />
            <XAxis
              dataKey="year"
              stroke={colors.chartText}
              tick={{ fontSize: 12 }}
              interval={"preserveStartEnd"}
            />
            <YAxis
              stroke={colors.chartText}
              tick={{ fontSize: 12 }}
              domain={[0, 9]}
            />
            <Tooltip
              content={(props) => <CustomTooltip {...props} colors={colors} />}
            />
            <Line
              type="monotone"
              dataKey="launches"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LaunchFrequencyChart;
