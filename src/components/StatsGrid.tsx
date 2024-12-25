import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Satellite,
  Weight,
  Calendar,
  Globe,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const countSatellites = (satellites, isIndian = false) => {
  return satellites.reduce((count, sat) => {
    // Handle nested satellite arrays
    if (sat.satellites) {
      return count + countSatellites(sat.satellites, isIndian);
    }

    // Handle constellation entries
    if (sat.constellation?.quantity) {
      if (
        (isIndian && sat.country === "India") ||
        (!isIndian && sat.country !== "India")
      ) {
        return count + sat.constellation.quantity;
      }
      return count;
    }

    // Handle quantity field for multiple identical satellites
    if (sat.quantity) {
      if (
        (isIndian && sat.country === "India") ||
        (!isIndian && sat.country !== "India")
      ) {
        return count + sat.quantity;
      }
      return count;
    }

    // Single satellite
    if (
      (isIndian && sat.country === "India") ||
      (!isIndian && sat.country !== "India")
    ) {
      return count + 1;
    }

    return count;
  }, 0);
};

interface StatsGridProps {
  data: any;
  colors: {
    glassBg: string;
    border: string;
    text: string;
    subText: string;
  };
}

const StatsGrid: React.FC<StatsGridProps> = ({ data, colors }) => {
  const stats = useMemo(() => {
    const totalLaunches = data.launches.length;
    const successfulLaunches = data.launches.filter(
      (l) => l.launchOutcome === "Success"
    ).length;

    const foreignSatellites = data.launches.reduce((acc, launch) => {
      return acc + countSatellites(launch.payload.satellites, false);
    }, 0);

    const totalMass = data.launches.reduce((acc, launch) => {
      if (launch.payload.totalMass) {
        return acc + launch.payload.totalMass;
      }
      return (
        acc +
        launch.payload.satellites.reduce((massAcc, sat) => {
          if (sat.mass) return massAcc + sat.mass;
          if (sat.constellation?.totalConstellationMass)
            return massAcc + sat.constellation.totalConstellationMass;
          return massAcc;
        }, 0)
      );
    }, 0);

    const uniqueOrbits = new Set(
      data.launches
        .map((launch) => launch.orbit)
        .filter((orbit) => orbit && orbit.length > 0)
    ).size;

    let currentStreak = 0;
    for (let i = data.launches.length - 1; i >= 0; i--) {
      if (data.launches[i].launchOutcome === "Success") {
        currentStreak++;
      } else {
        break;
      }
    }

    const years = data.launches.map((launch) =>
      new Date(launch.dateTime.split(" ")[0]).getFullYear()
    );
    const yearsActive = Math.max(...years) - Math.min(...years) + 1;

    return [
      {
        title: "Total Launches",
        value: totalLaunches,
        subtext: `${successfulLaunches} successful (${(
          (successfulLaunches / totalLaunches) *
          100
        ).toFixed(1)}%)`,
        icon: Rocket,
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        title: "Foreign Satellites",
        value: foreignSatellites,
        subtext: "International Payloads",
        icon: Satellite,
        gradient: "from-green-500 to-emerald-500",
      },
      {
        title: "Total Payload Mass",
        value: `${(totalMass / 1000).toFixed(1)}`,
        subtext: "Metric tonnes to orbit",
        icon: Weight,
        gradient: "from-yellow-500 to-orange-500",
      },
      {
        title: "Years Active",
        value: yearsActive,
        subtext: "Of space exploration",
        icon: Calendar,
        gradient: "from-purple-500 to-pink-500",
      },
      {
        title: "Unique Orbits",
        value: uniqueOrbits,
        subtext: "Orbital destinations",
        icon: Globe,
        gradient: "from-red-500 to-pink-500",
      },
      {
        title: "Current Streak",
        value: currentStreak,
        subtext: "Successful launches",
        icon: Award,
        gradient: "from-teal-500 to-green-500",
      },
    ];
  }, [data]);

  return (
    <div className="grid gap-4 mb-8 grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`${colors.glassBg} border ${colors.border} relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300`}
          >
            <motion.div
              initial={false}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={`text-sm font-medium ${colors.text}`}>
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`h-4 w-4 ${colors.subText} group-hover:text-blue-500 transition-colors duration-300`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <p className={`text-xs ${colors.subText}`}>{stat.subtext}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
