import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

interface IsroDataProvider {
  children: ReactNode;
}

// Create context
const IsroDataContext = createContext<any>(null);

// Custom hook
export const useIsroData = () => {
  const context = useContext(IsroDataContext);
  if (!context) {
    throw new Error("useIsroData must be used within an IsroDataProvider");
  }
  return context;
};

// Main provider component
const IsroDataProvider = ({ children }: IsroDataProvider) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/vehicle.json");
        if (!response.ok) throw new Error("Failed to fetch ISRO data");
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const utils = useMemo(() => {
    if (!data) return {};

    return {
      // Program Information
      getProgramInfo: () => data.metadata.program_info,
      getProgramStartYear: () => data.metadata.program_info.program_start,
      getProgramLastUpdated: () => data.metadata.program_info.last_updated,
      getTotalLaunches: () => data.metadata.program_info.total_launches,

      // Launch Facilities
      getLaunchFacilities: () => data.metadata.launch_facilities,
      getPrimaryCenter: () => data.metadata.launch_facilities.primary_center,
      getPrimaryCenterCoordinates: () => ({
        latitude: data.metadata.launch_facilities.primary_center.coordinates
          .split("°")[0]
          .trim(),
        longitude: data.metadata.launch_facilities.primary_center.coordinates
          .split("°")[1]
          .trim(),
      }),
      getUpcomingFacilities: () =>
        data.metadata.launch_facilities.upcoming_facilities,
      getLaunchComplexes: () =>
        data.metadata.launch_facilities.primary_center.launch_complexes,
      getActiveLaunchPads: () =>
        data.metadata.launch_facilities.primary_center.launch_complexes.filter(
          (pad: any) => pad.status === "Active"
        ),
      getLaunchPadByName: (padName: string) =>
        data.metadata.launch_facilities.primary_center.launch_complexes.find(
          (pad: any) => pad.name === padName
        ),

      // Vehicle Generations
      getVehicleGenerations: () => data.metadata.vehicle_generations,
      getGenerationByVehicle: (vehicleName: string) =>
        Object.entries(data.metadata.vehicle_generations).find(
          ([_, gen]: [string, any]) => {
            const vehicles = Array.isArray(gen.vehicles)
              ? gen.vehicles
              : Array.isArray(gen.vehicle)
              ? gen.vehicle
              : [gen.vehicle];
            return vehicles.includes(vehicleName);
          }
        ),

      // Program Statistics
      getOverallStats: () =>
        data.metadata.program_statistics.overall_performance,
      getSuccessRate: () =>
        data.metadata.program_statistics.overall_performance.success_rate,
      getVehicleSpecificStats: () =>
        data.metadata.program_statistics.vehicle_specific,

      // Vehicle Information
      getAllVehicles: () => Object.keys(data.launch_vehicles),
      getVehicle: (name: string) => data.launch_vehicles[name],
      getActiveVehicles: () =>
        Object.entries(data.launch_vehicles)
          .filter(([_, v]: [string, any]) => v.status === "Active")
          .map(([name]) => name),
      getVehiclesByStatus: (status: string) =>
        Object.entries(data.launch_vehicles)
          .filter(([_, v]: [string, any]) => v.status === status)
          .map(([name]) => name),

      // Vehicle Details
      getVehicleVariants: (name: string) =>
        data.launch_vehicles[name]?.variants || [],
      getVehicleDimensions: (name: string) =>
        data.launch_vehicles[name]?.dimensions,
      getVehicleMass: (name: string, variant: string | null = null) => {
        const dimensions = data.launch_vehicles[name]?.dimensions;
        if (variant && dimensions?.mass?.[variant]) {
          return dimensions.mass[variant];
        }
        return dimensions?.mass;
      },

      // Launch History
      getLaunchHistory: (name: string) =>
        data.launch_vehicles[name]?.launch_history,
      getFirstFlight: (name: string, variant: string | null = null) => {
        const history =
          data.launch_vehicles[name]?.launch_history?.first_flight;
        return variant ? history?.[variant] : history;
      },
      getLastFlight: (name: string, variant: string | null = null) => {
        const history = data.launch_vehicles[name]?.launch_history?.last_flight;
        return variant ? history?.[variant] : history;
      },

      // Stage Information
      getStages: (name: string) => data.launch_vehicles[name]?.stages,
      getStageDetails: (vehicleName: string, stageName: string) =>
        data.launch_vehicles[vehicleName]?.stages?.[stageName],
      getBoosterConfiguration: (vehicleName: string) => {
        const vehicle = data.launch_vehicles[vehicleName];
        return vehicle?.stages?.strap_on_boosters || null;
      },

      // Payload Capabilities
      getPayloadCapacity: (
        vehicleName: string,
        orbitType: string,
        variant: string | null = null
      ) => {
        const vehicle = data.launch_vehicles[vehicleName];
        if (!vehicle?.payload_capacity?.[orbitType]) return null;

        if (variant && vehicle.payload_capacity[orbitType][variant]) {
          return vehicle.payload_capacity[orbitType][variant];
        }
        return vehicle.payload_capacity[orbitType];
      },

      // Development Status
      getDevelopmentStatus: (name: string) => ({
        status: data.launch_vehicles[name]?.status,
        timeline: data.launch_vehicles[name]?.development_timeline,
      }),

      // Special Features
      getSpecialFeatures: (name: string) =>
        data.launch_vehicles[name]?.special_features,
    };
  }, [data]);

  if (loading) return null;
  if (error) return null;

  return (
    <IsroDataContext.Provider value={utils}>
      {children}
    </IsroDataContext.Provider>
  );
};

export default IsroDataProvider;
