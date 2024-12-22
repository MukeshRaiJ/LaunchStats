"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  Rocket,
  Ruler,
  Weight,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe2,
  Atom,
  Flame,
  Building2,
  Boxes,
  Flag,
  Clock,
  ArrowBigUpDash,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "../themes/ThemeContext";
import { AnimatedBackground } from "../themes/AnimatedBackground";
import Image from "next/image";
import "swiper/css";

import RocketNavigation from "./button";
import vehicleData from "./vehicle.json";
import launch_vehicle_images from "./rocket_image";

// Interfaces
interface PayloadMass {
  mass: number | { min: number; max: number } | Record<string, any>;
  altitude?: number;
  inclination?: number;
  perigee?: number;
  apogee?: number;
}

interface Vehicle {
  id: string;
  name: string;
  status: string;
  manufacturer: string;
  country: string;
  vehicle_class?: string;
  description?: string;
  cost_per_launch?: string;
  dimensions: {
    height?: number;
    length?: number;
    diameter?: number;
    wingspan?: number;
    mass: number | { min: number; max: number } | Record<string, number>;
  };
  payload_capacity?: {
    LEO?: PayloadMass | Record<string, PayloadMass>;
    GTO?: PayloadMass | Record<string, PayloadMass>;
    SSO?: PayloadMass | Record<string, PayloadMass>;
    TLI?: PayloadMass;
    max_payload?: number;
  };
  stages?: Record<string, any>;
  launch_history: {
    total_launches?: number;
    successes?: number;
    failures?: number;
    partial_failures?: number;
    first_flight?: string | Record<string, string>;
    last_flight?: string | Record<string, string>;
    launch_sites?: string[];
    launch_pad?: string[];
    total_tests?: number;
    first_orbital_flight?: string;
    notable_payloads?: string[];
  };
  special_features?: string[];
  generation?: {
    generation: string;
    period: string;
    description: string;
  };
  variants?: string[] | Array<{ name: string; description: string }>;
}

// Component interfaces remain the same...
interface RocketSpecCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

interface LaunchStatsProps {
  stats: {
    successes?: number;
    failures?: number;
    partial_failures?: number;
    total_launches?: number;
    first_flight?: string | Record<string, string>;
    last_flight?: string | Record<string, string>;
  };
}

interface StageCardProps {
  stage: string;
  details: any;
  index: number;
}

// Utility functions remain the same...
const formatPayloadCapacity = (
  payload: PayloadMass | Record<string, any> | undefined
): string => {
  if (!payload) return "N/A";

  if ("mass" in payload) {
    if (typeof payload.mass === "number") {
      return `${payload.mass.toLocaleString()}kg`;
    }
    if (typeof payload.mass === "object") {
      if ("min" in payload.mass) {
        return `${payload.mass.min.toLocaleString()}-${payload.mass.max.toLocaleString()}kg`;
      }
    }
  }

  const variants = Object.values(payload);
  if (variants.length > 0) {
    const masses = variants.map((v) => v.mass).filter((m) => m !== undefined);
    if (masses.length > 0) {
      const min = Math.min(...masses);
      const max = Math.max(...masses);
      return `${min.toLocaleString()}-${max.toLocaleString()}kg`;
    }
  }

  return "N/A";
};

const formatMass = (
  mass:
    | number
    | { min: number; max: number }
    | Record<string, number>
    | undefined
): string => {
  if (!mass) return "N/A";
  if (typeof mass === "number") return `${mass.toLocaleString()}kg`;
  if ("min" in mass && "max" in mass) {
    return `${mass.min.toLocaleString()}-${mass.max.toLocaleString()}kg`;
  }
  const values = Object.values(mass);
  if (values.length > 0) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return `${min.toLocaleString()}-${max.toLocaleString()}kg`;
  }
  return "N/A";
};

const getLatestFlightDate = (
  lastFlight: string | Record<string, string> | undefined
): string => {
  if (!lastFlight) return "N/A";
  if (typeof lastFlight === "string") return lastFlight.split("-")[0];

  return Object.values(lastFlight)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
    .split("-")[0];
};

// Components remain the same...
const RocketSpecCard: React.FC<RocketSpecCardProps> = ({
  title,
  value,
  icon: Icon,
}) => {
  const { colors } = useTheme();
  return (
    <div className={`${colors.cardBg} p-4 rounded-lg flex items-center gap-3`}>
      <div className={`${colors.cardGlow} p-2 rounded-md`}>
        <Icon className={colors.highlight} size={24} />
      </div>
      <div>
        <p className={`text-xs ${colors.subText} uppercase tracking-wider`}>
          {title}
        </p>
        <p className={`text-sm font-bold ${colors.text}`}>{value}</p>
      </div>
    </div>
  );
};

// LaunchStats component remains the same...
const LaunchStats: React.FC<LaunchStatsProps> = ({ stats }) => {
  const { colors } = useTheme();
  const total = stats.total_launches || 0;
  const successes = stats.successes || 0;
  const failures = stats.failures || 0;
  const partialFailures = stats.partial_failures || 0;

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      <div className={`col-span-4 ${colors.cardBg} p-4 rounded-lg`}>
        <div className="flex justify-between mb-3">
          <span className={`text-sm font-bold ${colors.text}`}>
            Total Launches: {total}
          </span>
          <span className={`text-sm ${colors.subText}`}>
            Success Rate:{" "}
            {total > 0 ? ((successes / total) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-sm overflow-hidden">
          <div className="h-full flex">
            <div
              style={{ width: `${(successes / total) * 100}%` }}
              className="bg-green-500"
            />
            <div
              style={{ width: `${(failures / total) * 100}%` }}
              className="bg-red-500"
            />
            <div
              style={{ width: `${(partialFailures / total) * 100}%` }}
              className="bg-yellow-500"
            />
          </div>
        </div>
      </div>
      {[
        {
          icon: CheckCircle,
          label: "Successful",
          value: successes,
          color: "text-green-500",
        },
        {
          icon: XCircle,
          label: "Failed",
          value: failures,
          color: "text-red-500",
        },
        {
          icon: AlertCircle,
          label: "Partial",
          value: partialFailures,
          color: "text-yellow-500",
        },
        {
          icon: Clock,
          label: "Last Launch",
          value: getLatestFlightDate(stats.last_flight),
          color: colors.highlight,
        },
      ].map(({ icon: Icon, label, value, color }) => (
        <div
          key={label}
          className={`${colors.cardBg} p-3 rounded-lg flex items-center gap-2`}
        >
          <Icon className={color} size={16} />
          <div>
            <p className={`text-xs ${colors.subText}`}>{label}</p>
            <p className={`text-sm font-bold ${colors.text}`}>{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const StageCard: React.FC<StageCardProps> = ({ stage, details, index }) => {
  const { colors } = useTheme();
  return (
    <div className={`${colors.cardBg} p-4 rounded-lg space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`${colors.cardGlow} p-2 rounded-md`}>
            <ArrowBigUpDash className={colors.highlight} size={20} />
          </div>
          <h4 className={`font-bold ${colors.text}`}>
            {stage.replace(/_/g, " ")}
          </h4>
        </div>
        <span className={`text-xs px-3 py-1 rounded-md ${colors.cardGlow}`}>
          Stage {index + 1}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {details.engine_type && (
          <div className="flex items-center gap-2">
            <Atom size={16} className={colors.highlight} />
            <span className={`text-sm ${colors.text}`}>
              {details.engine_type}
            </span>
          </div>
        )}
        {details.propellant && (
          <div className="flex items-center gap-2">
            <Flame size={16} className={colors.highlight} />
            <span className={`text-sm ${colors.text}`}>
              {Array.isArray(details.propellant)
                ? details.propellant.join(", ")
                : details.propellant}
            </span>
          </div>
        )}
        {(details.thrust ||
          (details.engines && details.engines.total_thrust)) && (
          <div className="flex items-center gap-2">
            <Rocket size={16} className={colors.highlight} />
            <span className={`text-sm ${colors.text}`}>
              {details.thrust || details.engines.total_thrust}
            </span>
          </div>
        )}
        {details.burn_time && (
          <div className="flex items-center gap-2">
            <Clock size={16} className={colors.highlight} />
            <span className={`text-sm ${colors.text}`}>
              {details.burn_time}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const RocketShowcase: React.FC = () => {
  const [vehicles] = useState<Vehicle[]>(() => {
    // Get vehicles from the launch_vehicles section of the new JSON structure
    return Object.entries(vehicleData.launch_vehicles).map(([key, vehicle]) => {
      // Find generation info from metadata
      let generation = null;
      const generations = vehicleData.metadata.vehicle_generations;

      Object.entries(generations).forEach(
        ([genKey, genData]: [string, any]) => {
          const vehicles = Array.isArray(genData.vehicle)
            ? genData.vehicle
            : [genData.vehicle];

          if (vehicles.includes(key.split("_")[0])) {
            generation = {
              generation: genKey.replace(/_/g, " "),
              period: genData.period,
              description: genData.description,
            };
          }
        }
      );

      return {
        id: key,
        name: key,
        ...vehicle,
        generation,
      };
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>(vehicles[0]);
  const { colors } = useTheme();
  const swiperRef = React.useRef<SwiperType>();

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.activeIndex);
    setCurrentVehicle(vehicles[swiper.activeIndex]);
  };

  const navigateRocket = (direction: "prev" | "next") => {
    if (!swiperRef.current) return;
    if (direction === "prev") {
      swiperRef.current.slidePrev();
    } else {
      swiperRef.current.slideNext();
    }
  };

  const getPrevNextVehicles = () => {
    const prevIndex =
      currentIndex === 0 ? vehicles.length - 1 : currentIndex - 1;
    const nextIndex =
      currentIndex === vehicles.length - 1 ? 0 : currentIndex + 1;
    return {
      prev: vehicles[prevIndex].name,
      next: vehicles[nextIndex].name,
    };
  };

  const { prev, next } = getPrevNextVehicles();

  const getDefaultImage = (vehicle: Vehicle) => {
    const imageData = launch_vehicle_images.find(
      (item) => item.rocket === vehicle.name
    );
    return imageData ? imageData.image : "/rockets/default.png";
  };

  return (
    <section
      className={`relative h-screen py-6 px-4 sm:px-6 lg:px-8 ${colors.background}`}
    >
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto relative z-10 h-full">
        <div className="flex flex-col xl:flex-row xl:gap-8 h-full">
          {/* Image Card */}
          <motion.div
            className="w-full xl:w-1/3 h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              className="h-full rounded-xl overflow-hidden shadow-2xl"
              onSlideChange={handleSlideChange}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {vehicles.map((vehicle) => (
                <SwiperSlide key={vehicle.id}>
                  <motion.div
                    className="relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center overflow-hidden group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                      <Image
                        src={getDefaultImage(vehicle)}
                        alt={vehicle.name}
                        fill
                        className="object-contain transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div
                      className={`absolute inset-x-0 bottom-0 ${colors.cardBg} backdrop-blur-lg bg-opacity-95 p-4`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-xl font-bold ${colors.text}`}>
                          {vehicle.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            vehicle.status === "Active"
                              ? "bg-green-500"
                              : vehicle.status === "Retired"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          } text-white`}
                        >
                          {vehicle.status}
                        </span>
                      </div>
                      {vehicle.generation && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm ${colors.subText}`}>
                            {vehicle.generation.period}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-4">
                        {vehicle.dimensions?.height && (
                          <div className="flex items-center gap-1">
                            <Ruler size={16} className={colors.highlight} />
                            <span className={`text-sm ${colors.text}`}>
                              {vehicle.dimensions.height}m
                            </span>
                          </div>
                        )}
                        {vehicle.payload_capacity?.LEO && (
                          <div className="flex items-center gap-1">
                            <Rocket size={16} className={colors.highlight} />
                            <span className={`text-sm ${colors.text}`}>
                              {formatPayloadCapacity(
                                vehicle.payload_capacity.LEO
                              )}{" "}
                              LEO
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* Data Card */}
          <motion.div
            className="w-full xl:w-2/3 h-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`${colors.cardBg} rounded-xl p-6 h-full`}>
              <RocketNavigation
                prev={prev}
                next={next}
                onNavigate={navigateRocket}
                colors={colors}
                currentIndex={currentIndex}
                totalRockets={vehicles.length}
              />
              <ScrollArea className="h-[calc(100%-3rem)] pr-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className={`text-3xl font-bold ${colors.text}`}>
                        {currentVehicle.name}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-medium ${
                          currentVehicle.status === "Active"
                            ? "bg-green-500"
                            : currentVehicle.status === "Retired"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        } text-white`}
                      >
                        {currentVehicle.status}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      {currentVehicle.manufacturer && (
                        <div className="flex items-center gap-1">
                          <Building2 size={16} className={colors.highlight} />
                          <span className={`text-sm ${colors.subText}`}>
                            {currentVehicle.manufacturer}
                          </span>
                        </div>
                      )}
                      {currentVehicle.country && (
                        <div className="flex items-center gap-1">
                          <Flag size={16} className={colors.highlight} />
                          <span className={`text-sm ${colors.subText}`}>
                            {currentVehicle.country}
                          </span>
                        </div>
                      )}
                    </div>
                    {currentVehicle.description && (
                      <p className={`mt-2 text-sm ${colors.subText}`}>
                        {currentVehicle.description}
                      </p>
                    )}
                  </div>
                  {currentVehicle.generation && (
                    <div
                      className={`${colors.cardGlow} p-3 rounded-lg text-right`}
                    >
                      <p className={`text-xs font-bold ${colors.text}`}>
                        {currentVehicle.generation.generation} Generation
                      </p>
                      <p className={`text-xs ${colors.subText}`}>
                        {currentVehicle.generation.period}
                      </p>
                    </div>
                  )}
                </div>

                {currentVehicle.dimensions && (
                  <div className="mb-6">
                    <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                      Vehicle Specifications
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <RocketSpecCard
                        title="Height"
                        value={`${currentVehicle.dimensions.height}m`}
                        icon={Ruler}
                      />
                      <RocketSpecCard
                        title="Diameter"
                        value={`${currentVehicle.dimensions.diameter}m`}
                        icon={Target}
                      />
                      <RocketSpecCard
                        title="Mass"
                        value={formatMass(currentVehicle.dimensions.mass)}
                        icon={Weight}
                      />
                    </div>
                  </div>
                )}

                {currentVehicle.payload_capacity && (
                  <div className="mb-6">
                    <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                      Payload Capacity
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {currentVehicle.payload_capacity.LEO && (
                        <RocketSpecCard
                          title="LEO Payload"
                          value={formatPayloadCapacity(
                            currentVehicle.payload_capacity.LEO
                          )}
                          icon={Rocket}
                        />
                      )}
                      {currentVehicle.payload_capacity.GTO && (
                        <RocketSpecCard
                          title="GTO Payload"
                          value={formatPayloadCapacity(
                            currentVehicle.payload_capacity.GTO
                          )}
                          icon={Globe2}
                        />
                      )}
                      {currentVehicle.payload_capacity.SSO && (
                        <RocketSpecCard
                          title="SSO Payload"
                          value={formatPayloadCapacity(
                            currentVehicle.payload_capacity.SSO
                          )}
                          icon={Boxes}
                        />
                      )}
                    </div>
                  </div>
                )}

                {currentVehicle.launch_history && (
                  <div className="mb-6">
                    <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                      Launch History
                    </h3>
                    <LaunchStats stats={currentVehicle.launch_history} />
                  </div>
                )}

                {currentVehicle.stages && (
                  <div className="mb-6">
                    <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                      Stage Configuration
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(currentVehicle.stages)
                        .filter(([stage]) => stage !== "boosters")
                        .map(([stage, details], index) => (
                          <StageCard
                            key={stage}
                            stage={stage}
                            details={details}
                            index={index}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {currentVehicle.special_features && (
                  <div>
                    <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                      Special Features
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {currentVehicle.special_features.map((feature, index) => (
                        <div
                          key={index}
                          className={`${colors.cardBg} p-3 rounded-lg flex items-start gap-2`}
                        >
                          <Rocket
                            className={`${colors.highlight} mt-1`}
                            size={16}
                          />
                          <span className={`${colors.text} text-sm`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RocketShowcase;
