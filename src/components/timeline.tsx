import React, { useState, useMemo, useCallback } from "react";
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
  Filter,
  Clock,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "../themes/ThemeContext";
import { AnimatedBackground } from "../themes/AnimatedBackground";

// Custom hook for media queries
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

const FilterBadge = ({ label, value, onClear }) => {
  const { colors } = useTheme();
  return value !== "all" ? (
    <Badge className={`${colors.cardBg} flex items-center gap-1`}>
      {label}: {value}
      <X className="w-3 h-3 cursor-pointer" onClick={onClear} />
    </Badge>
  ) : null;
};

const TimelineCard = ({ launch }) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = useCallback((outcome) => {
    switch (outcome.toLowerCase()) {
      case "success":
        return "text-emerald-500 bg-emerald-500/10";
      case "failure":
        return "text-red-500 bg-red-500/10";
      case "partial success":
      case "partial failure":
        return "text-amber-500 bg-amber-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  }, []);

  const getStatusIcon = useCallback((outcome) => {
    switch (outcome.toLowerCase()) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "failure":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  }, []);

  const launchDate = new Date(launch.dateTime.split("|")[0]);
  const launchTime = launch.dateTime.split("|")[1]?.trim() || "N/A";

  return (
    <div className="relative ml-8 md:ml-16 mb-6">
      {/* Timeline connector */}
      <div
        className="absolute -left-8 md:-left-12 top-1/2 w-8 md:w-12 h-0.5 
                    bg-gradient-to-r from-blue-500 to-transparent"
      />

      {/* Launch number circle */}
      <div
        className="absolute -left-12 md:-left-16 top-1/2 transform -translate-y-1/2 
                   w-8 h-8 md:w-10 md:h-10 rounded-full 
                   bg-gradient-to-r from-blue-500 to-cyan-500 
                   flex items-center justify-center shadow-lg z-10
                   hover:scale-110 transition-transform duration-200"
      >
        <span className="text-white text-xs md:text-sm font-bold">
          {launch.launchNo}
        </span>
      </div>

      <Card
        className={`${colors.glassBg} ${colors.border} hover:shadow-lg transition-shadow duration-300`}
      >
        <CardHeader
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <CardTitle
                className={`text-lg md:text-xl flex items-center gap-2 ${colors.text}`}
              >
                <Rocket className={`w-5 h-5 ${colors.highlight}`} />
                {launch.rocket}{" "}
                {launch.configuration && `(${launch.configuration})`} •{" "}
                {launch.flightNo}
              </CardTitle>
              <Button variant="ghost" size="sm" className={colors.text}>
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className={`${colors.text} text-sm`}>
                  {launchDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {launchTime !== "N/A" && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className={`${colors.text} text-sm`}>
                    {launchTime} IST
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={`${getStatusColor(
                  launch.launchOutcome
                )} flex items-center gap-1`}
              >
                {getStatusIcon(launch.launchOutcome)}
                {launch.launchOutcome}
              </Badge>

              {launch.orbit && (
                <Badge className="bg-blue-500/10 text-blue-500 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {launch.orbit}
                </Badge>
              )}

              {launch.launchSite && (
                <Badge className="bg-purple-500/10 text-purple-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {launch.launchSite}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          {/* Basic Info (Always Visible) */}
          <div className="mb-4">
            <p className={`${colors.text} text-sm`}>
              {launch.missionDescription}
            </p>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-4 mt-4 pt-4 border-t border-gray-700/20">
              {/* Detailed Mission Info */}
              <div className="space-y-2">
                <h4
                  className={`${colors.text} font-medium flex items-center gap-2`}
                >
                  <Info className="w-4 h-4 text-blue-500" />
                  Mission Details
                </h4>

                {/* Launch Site */}
                {launch.launchSite && (
                  <div
                    className={`${colors.text} text-sm flex items-center gap-2`}
                  >
                    <MapPin className="w-4 h-4 text-purple-500" />
                    Launch Site: {launch.launchSite}
                  </div>
                )}

                {/* User/Customer */}
                {launch.user && (
                  <div
                    className={`${colors.text} text-sm flex items-center gap-2`}
                  >
                    <Flag className="w-4 h-4 text-green-500" />
                    Customer: {launch.user}
                  </div>
                )}
              </div>

              {/* Payload Information */}
              <div className="space-y-4">
                {launch.payload.totalMass && (
                  <Badge className="bg-green-500/10 text-green-500">
                    <Weight className="w-3 h-3 mr-1" />
                    Total Payload Mass: {launch.payload.totalMass}{" "}
                    {launch.payload.massUnit}
                  </Badge>
                )}

                {/* Satellites Section */}
                {launch.payload.satellites.length > 0 && (
                  <div className="space-y-2">
                    <h4
                      className={`${colors.text} font-medium flex items-center gap-2`}
                    >
                      <Satellite className="w-4 h-4 text-blue-500" />
                      Satellites ({launch.payload.satellites.length})
                    </h4>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {launch.payload.satellites.map((sat, idx) => (
                        <div
                          key={`${launch.launchNo}-sat-${idx}`}
                          className={`${colors.cardBg} rounded-lg p-3 text-sm border border-gray-700/20`}
                        >
                          <div className={`font-medium ${colors.text}`}>
                            {sat.name}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <Flag className="w-3 h-3 text-blue-500" />
                              <span className={colors.subText}>
                                {sat.country}
                              </span>
                            </span>
                            {sat.mass && (
                              <span
                                className={`${colors.subText} flex items-center gap-1`}
                              >
                                <Weight className="w-3 h-3 text-green-500" />
                                {sat.mass} {sat.massUnit}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {launch.notes && (
                  <div
                    className={`${colors.cardBg} rounded-lg p-3 mt-4 text-sm border-l-4 border-blue-500`}
                  >
                    <p className={colors.text}>{launch.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const FilterSection = ({
  filters,
  setFilters,
  uniqueValues,
  isMobile = false,
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const FilterSelect = ({ label, value, options, onChange }) => (
    <div className="flex flex-col gap-1">
      <label className={`${colors.subText} text-sm font-medium`}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${colors.cardBg} ${colors.text} ${colors.border} 
                   rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500`}
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

  if (isMobile) {
    return (
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between ${colors.border}`}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 mt-4"
            >
              {Object.entries(filters).map(([key, value]) => (
                <FilterSelect
                  key={`mobile-filter-${key}`}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  options={uniqueValues[key]}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, [key]: value }))
                  }
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="hidden md:grid grid-cols-5 gap-4">
      {Object.entries(filters).map(([key, value]) => (
        <FilterSelect
          key={`desktop-filter-${key}`}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          options={uniqueValues[key]}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, [key]: value }))
          }
        />
      ))}
    </div>
  );
};

const Timeline = ({ data }) => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    year: "all",
    orbit: "all",
    status: "all",
    rocket: "all",
    country: "all",
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Memoized unique values for filters
  const uniqueValues = useMemo(() => {
    const values = {
      year: new Set(),
      orbit: new Set(),
      status: new Set(),
      rocket: new Set(),
      country: new Set(),
    };

    data.forEach((launch) => {
      values.year.add(launch.dateTime.split("-")[0]);
      if (launch.orbit) values.orbit.add(launch.orbit);
      values.status.add(launch.launchOutcome);
      values.rocket.add(launch.rocket);
      launch.payload.satellites.forEach((sat) => {
        if (sat.country) values.country.add(sat.country);
      });
    });

    return Object.fromEntries(
      Object.entries(values).map(([key, set]) => [key, Array.from(set).sort()])
    );
  }, [data]);

  // Memoized filtered launches - Latest first (by date)
  const filteredLaunches = useMemo(() => {
    // First, ensure the data is sorted by date (latest first)
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.dateTime.split("|")[0]);
      const dateB = new Date(b.dateTime.split("|")[0]);
      return dateB - dateA;
    });

    const searchTermLower = searchTerm.toLowerCase();

    return sortedData
      .filter((launch) => {
        if (
          searchTerm &&
          !launch.rocket.toLowerCase().includes(searchTermLower) &&
          !launch.missionDescription.toLowerCase().includes(searchTermLower) &&
          !launch.flightNo.toLowerCase().includes(searchTermLower)
        ) {
          return false;
        }

        if (filters.year !== "all" && !launch.dateTime.startsWith(filters.year))
          return false;
        if (filters.orbit !== "all" && launch.orbit !== filters.orbit)
          return false;
        if (filters.status !== "all" && launch.launchOutcome !== filters.status)
          return false;
        if (filters.rocket !== "all" && launch.rocket !== filters.rocket)
          return false;
        if (
          filters.country !== "all" &&
          !launch.payload.satellites.some(
            (sat) => sat.country === filters.country
          )
        )
          return false;

        return true;
      })
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  }, [data, searchTerm, filters]);

  const activeFilters = Object.entries(filters).filter(
    ([_, value]) => value !== "all"
  );

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div
        className={`sticky top-0 z-20 mb-6 p-4 ${colors.glassBg} rounded-xl ${colors.border} 
                      backdrop-blur-md shadow-lg`}
      >
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <Input
              className={`pl-10 ${colors.cardBg} ${colors.border} ${colors.text}
                         focus:ring-2 focus:ring-blue-500 w-full`}
              placeholder="Search launches by rocket, mission, or flight number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <FilterSection
            filters={filters}
            setFilters={setFilters}
            uniqueValues={uniqueValues}
            isMobile={isMobile}
          />

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => (
                <FilterBadge
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  onClear={() =>
                    setFilters((prev) => ({ ...prev, [key]: "all" }))
                  }
                />
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFilters({
                    year: "all",
                    orbit: "all",
                    status: "all",
                    rocket: "all",
                    country: "all",
                  })
                }
                className="text-blue-500 hover:text-blue-600"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all filters
              </Button>
            </div>
          )}

          {/* Results Count */}
          <div
            className={`text-sm ${colors.subText} flex items-center justify-between`}
          >
            <span>
              Showing {filteredLaunches.length} of {data.length} launches
            </span>
            <span className="text-blue-500">Latest launches first</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Main timeline line */}
        <div
          className="absolute left-0 md:left-4 top-0 bottom-0 w-0.5 
                       bg-gradient-to-b from-blue-500 via-blue-500/50 to-transparent"
        />

        {filteredLaunches.length > 0 ? (
          filteredLaunches.map((launch) => (
            <TimelineCard key={`launch-${launch.launchNo}`} launch={launch} />
          ))
        ) : (
          <div
            className={`ml-8 md:ml-16 p-8 ${colors.glassBg} rounded-xl 
                         text-center ${colors.text}`}
          >
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-medium mb-2">No launches found</h3>
            <p className={`${colors.subText} text-sm`}>
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
