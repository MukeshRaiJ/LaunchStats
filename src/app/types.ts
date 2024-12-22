// Vehicle Interfaces
export interface PayloadCapacity {
  mass?: number | { payload?: number };
  altitude?: number;
  inclination?: number;
  perigee?: number;
  apogee?: number;
  crew_capacity?: string;
}

export interface Dimensions {
  height?: number;
  diameter?: number;
  mass: number | { min: number; max: number };
}

export interface LaunchHistory {
  total_launches?: number;
  successes?: number;
  failures?: number;
  partial_failures?: number;
  first_flight?: string | Record<string, string>;
  last_flight?: string | Record<string, string>;
  launch_sites?: string[];
  notable_payloads?: string[];
}

export interface Stage {
  designation?: string;
  propellant_mass?: number;
  engine_type?: string;
  engine_count?: number;
  thrust?: number;
  specific_impulse?: number;
  burn_time?: number | string;
  propellant?: string;
  height?: number;
  diameter?: number;
  engine_name?: string;
  modifications?: Record<string, any>;
  powered_by?: string;
  maximum_thrust?: number | string;
}

export interface Vehicle {
  status: string;
  manufacturer: string;
  country: string;
  cost_per_launch?: string;
  description?: string;
  dimensions?: Dimensions;
  payload_capacity?: {
    LEO?: PayloadCapacity | Record<string, PayloadCapacity>;
    GTO?: PayloadCapacity | Record<string, PayloadCapacity>;
    SSO?: PayloadCapacity | Record<string, PayloadCapacity>;
    TLI?: PayloadCapacity;
    "Sub-GTO"?: Record<string, PayloadCapacity>;
  };
  launch_history: LaunchHistory;
  stages?: Record<string, Stage | Record<string, Stage>>;
  special_features?: string[];
  development_timeline?: {
    design_start?: string;
    first_flight?: string;
    first_crewed_mission?: string;
  };
  variants?: string[];
}

// Component Props Interfaces
export interface RocketSpecCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

export interface LaunchStatsProps {
  stats: LaunchHistory;
}

export interface StageCardProps {
  stage: string;
  details: Stage;
  index: number;
}
