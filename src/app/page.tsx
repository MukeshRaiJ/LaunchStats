"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import StatsGrid from "@/components/StatsGrid";
import LaunchFrequencyChart from "@/components/Frequency";
import RocketShowcase from "@/components/launch_vehicles/index";
import PayloadAnalysis from "@/components/Payload";
import Timeline from "@/components/timeline";
import Footer from "@/components/footer";
import { ThemeProvider, useTheme } from "@/themes/ThemeContext";

interface Launch {
  launchNo: number;
  flightNo: string;
  dateTime: string;
  rocket: string;
  configuration: string;
  launchOutcome: string;
  orbit?: string;
  payload: {
    totalMass?: number;
    massUnit?: string;
    satellites: Array<{
      name: string;
      country: string;
      mass?: number;
      massUnit?: string;
    }>;
  };
  missionDescription: string;
  notes: string;
}

interface LaunchData {
  metadata: {
    lastUpdated: string;
    totalLaunches: number;
    launchVehicles: string[];
  };
  launches: Launch[];
}

const LaunchVisualizerContent: React.FC<{ launchData: LaunchData }> = ({
  launchData,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const { colors } = useTheme();

  const processedData = useMemo(() => {
    const years = Array.from(
      new Set(
        launchData.launches.map((launch) => launch.dateTime.split("-")[0])
      )
    ).sort();
    const firstYear = parseInt(years[0]);
    const lastYear = parseInt(years[years.length - 1]);
    const yearData: Record<string, number> = {};

    for (let year = firstYear; year <= lastYear; year++) {
      yearData[year.toString()] = 0;
    }

    launchData.launches.forEach((launch) => {
      const year = launch.dateTime.split("-")[0];
      yearData[year] = (yearData[year] || 0) + 1;
    });

    return {
      launchFrequencyData: Object.entries(yearData).map(([year, launches]) => ({
        year,
        launches,
      })),
    };
  }, [launchData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full relative z-10 p-4"
    >
      <header className="mb-8 relative">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"
        />
        <h1
          className={`text-4xl md:text-5xl font-bold ${colors.text} mb-2 relative bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500`}
        >
          ISRO Launch Analytics
        </h1>
        <p className={`${colors.subText} text-lg`}>
          Exploring India's Journey to the Stars (Last Updated:{" "}
          {launchData.metadata.lastUpdated})
        </p>
      </header>

      <StatsGrid data={launchData} colors={colors} />

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full space-y-4"
      >
        <TabsList
          className={`${colors.glassBg} p-1 rounded-xl w-full grid grid-cols-4`}
        >
          {["Overview", "Vehicles", "TimeLine", "Payloads"].map((tab) => (
            <TabsTrigger
              key={tab.toLowerCase()}
              value={tab.toLowerCase()}
              className="rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="w-full">
          <div className="grid gap-4">
            <LaunchFrequencyChart
              data={processedData.launchFrequencyData}
              colors={colors}
            />
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="w-full">
          <RocketShowcase colors={colors} />
        </TabsContent>

        <TabsContent value="timeline" className="w-full">
          <Timeline data={launchData.launches} colors={colors} />
        </TabsContent>

        <TabsContent value="payloads" className="w-full">
          <PayloadAnalysis data={launchData} colors={colors} />
        </TabsContent>
      </Tabs>
      <Footer />
    </motion.div>
  );
};

const LaunchVisualizer: React.FC = () => {
  const [launchData, setLaunchData] = useState<LaunchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/isro_data.json");
        const data = await response.json();
        setLaunchData(data);
      } catch (error) {
        console.error("Error fetching launch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!launchData) {
    return <div>Error loading data</div>;
  }

  return (
    <ThemeProvider>
      <LaunchVisualizerContent launchData={launchData} />
    </ThemeProvider>
  );
};

export default LaunchVisualizer;
