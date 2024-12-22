import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Search,
  Rocket,
  Calendar,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe,
  Weight,
  Satellite,
  X,
  MapPin,
  Flag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "../themes/ThemeContext";
import { AnimatedBackground } from "../themes/AnimatedBackground";

interface Launch {
  launchNo: number;
  flightNo: string;
  dateTime: string;
  rocket: string;
  configuration: string;
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
  orbit?: string;
  launchOutcome: string;
  missionDescription: string;
  notes: string;
}

interface Filters {
  year: string;
  orbit: string;
  status: string;
  rocket: string;
  country: string;
}

interface TimelineProps {
  data: Launch[];
  colors: unknown;
}

const Timeline: React.FC<TimelineProps> = ({ data }) => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    year: "all",
    orbit: "all",
    status: "all",
    rocket: "all",
    country: "all",
  });

  const getUniqueValues = (key: keyof Filters) => {
    const values = new Set<string>();
    data.forEach((launch) => {
      switch (key) {
        case "year":
          values.add(launch.dateTime.split("-")[0]);
          break;
        case "orbit":
          if (launch.orbit) values.add(launch.orbit);
          break;
        case "status":
          values.add(launch.launchOutcome);
          break;
        case "rocket":
          values.add(launch.rocket);
          break;
        case "country":
          launch.payload.satellites.forEach((sat) => {
            if (sat.country) values.add(sat.country);
          });
          break;
      }
    });
    return Array.from(values).sort();
  };

  const filteredLaunches = data.filter((launch) => {
    const searchMatch =
      searchTerm.toLowerCase() === "" ||
      launch.rocket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      launch.missionDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      launch.flightNo.toLowerCase().includes(searchTerm.toLowerCase());

    const yearMatch =
      filters.year === "all" || launch.dateTime.startsWith(filters.year);
    const orbitMatch =
      filters.orbit === "all" || launch.orbit === filters.orbit;
    const statusMatch =
      filters.status === "all" || launch.launchOutcome === filters.status;
    const rocketMatch =
      filters.rocket === "all" || launch.rocket === filters.rocket;
    const countryMatch =
      filters.country === "all" ||
      launch.payload.satellites.some((sat) => sat.country === filters.country);

    return (
      searchMatch &&
      yearMatch &&
      orbitMatch &&
      statusMatch &&
      rocketMatch &&
      countryMatch
    );
  });

  const FilterSelect = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }) => (
    <div className="flex flex-col gap-1 w-full">
      <label className={`${colors.subText} text-sm`}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${colors.cardBg} ${colors.text} ${colors.border} rounded-md p-2 text-sm w-full`}
      >
        <option value="all">All {label}s</option>
        {options.map((option) => (
          <option key={`${label}-${option}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const getOrbitColor = (orbit: string = "") => {
    const orbitType = orbit.toLowerCase();
    if (orbitType.includes("geo") || orbitType.includes("gto"))
      return colors.chartColors[4];
    if (orbitType.includes("leo")) return colors.chartColors[0];
    if (orbitType.includes("sso")) return colors.chartColors[5];
    if (orbitType.includes("sub")) return colors.chartColors[2];
    return colors.subText;
  };

  const getStatusColor = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case "success":
        return colors.success;
      case "failure":
        return colors.chartColors[3];
      case "partial success":
      case "partial failure":
        return colors.chartColors[2];
      default:
        return colors.subText;
    }
  };

  const getStatusIcon = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case "success":
        return (
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
        );
      case "failure":
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />;
    }
  };

  const clearFilters = () => {
    setFilters({
      year: "all",
      orbit: "all",
      status: "all",
      rocket: "all",
      country: "all",
    });
    setSearchTerm("");
    setShowFilters(false);
  };

  return (
    <div className="relative">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-4 p-4 ${colors.glassBg} rounded-xl ${colors.border}`}
      >
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <Input
              className={`pl-10 w-full ${colors.cardBg} ${colors.border} ${colors.text} text-sm`}
              placeholder="Search launches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full flex items-center justify-between ${colors.border}`}
          >
            <span>Filters</span>
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3"
              >
                {Object.entries(filters).map(([key, value]) => (
                  <FilterSelect
                    key={`filter-${key}`}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                    options={getUniqueValues(key as keyof Filters)}
                    onChange={(value) =>
                      setFilters({ ...filters, [key]: value })
                    }
                  />
                ))}

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full text-blue-500 border-blue-500"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`text-sm ${colors.subText}`}>
            {filteredLaunches.length} of {data.length} launches
          </div>
        </div>
      </motion.div>

      <LayoutGroup>
        <div className="relative">
          <div
            className={`absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b ${colors.chartColors[0]}/50`}
          />

          <AnimatePresence>
            {filteredLaunches.map((launch, index) => (
              <motion.div
                key={`launch-${launch.launchNo}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="mb-4 ml-8 sm:ml-16 relative"
              >
                <motion.div
                  className={`absolute -left-12 sm:-left-20 top-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                    bg-gradient-to-r from-${colors.chartColors[0]} to-${colors.chartColors[5]} 
                    flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                >
                  <span
                    className={`${colors.text} text-xs sm:text-sm font-bold`}
                  >
                    {launch.launchNo}
                  </span>
                </motion.div>

                <Card
                  className={`${colors.glassBg} ${colors.border} overflow-hidden group`}
                >
                  <CardHeader className="p-4">
                    <div className="flex flex-col gap-3">
                      <div>
                        <CardTitle
                          className={`text-lg sm:text-xl mb-2 flex items-center gap-2 ${colors.text}`}
                        >
                          <Rocket
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.highlight}`}
                          />
                          {launch.rocket} {launch.flightNo}
                        </CardTitle>
                        <div className="flex flex-col gap-1 text-xs sm:text-sm">
                          <p
                            className={`${colors.subText} flex items-center gap-2`}
                          >
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {new Date(
                              launch.dateTime.split("|")[0]
                            ).toLocaleDateString()}
                          </p>
                          <p
                            className={`${colors.subText} flex items-center gap-2`}
                          >
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            SDSC SHAR
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={`${getStatusColor(
                            launch.launchOutcome
                          )} text-xs`}
                        >
                          {getStatusIcon(launch.launchOutcome)}
                          <span className="ml-1">{launch.launchOutcome}</span>
                        </Badge>
                        {launch.orbit && (
                          <Badge
                            className={`${getOrbitColor(launch.orbit)} text-xs`}
                          >
                            <Globe className="w-3 h-3 mr-1" />
                            {launch.orbit}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <p
                      className={`${colors.text} text-sm flex items-start gap-2`}
                    >
                      <Info
                        className={`w-4 h-4 mt-1 flex-shrink-0 ${colors.highlight}`}
                      />
                      {launch.missionDescription}
                    </p>

                    {launch.notes && (
                      <p
                        className={`text-xs ${colors.subText} mt-2 italic border-l-2 ${colors.highlight} pl-2`}
                      >
                        {launch.notes}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {launch.payload.totalMass && (
                        <Badge className={`${colors.highlight} text-xs`}>
                          <Weight className="w-3 h-3 mr-1" />
                          {launch.payload.totalMass} {launch.payload.massUnit}
                        </Badge>
                      )}
                      {launch.payload.satellites.length > 0 && (
                        <Badge className={`${colors.chartColors[4]} text-xs`}>
                          <Satellite className="w-3 h-3 mr-1" />
                          {launch.payload.satellites.length} Satellites
                        </Badge>
                      )}
                    </div>

                    {launch.payload.satellites.length > 0 &&
                      launch.payload.satellites[0].country && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {Array.from(
                            new Set(
                              launch.payload.satellites.map(
                                (sat) => sat.country
                              )
                            )
                          ).map((country) => (
                            <Badge
                              key={`${launch.launchNo}-${country}`}
                              className={`${colors.cardBg} text-xs`}
                            >
                              <Flag className="w-3 h-3 mr-1" />
                              {country}
                            </Badge>
                          ))}
                        </div>
                      )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
};

export default Timeline;
