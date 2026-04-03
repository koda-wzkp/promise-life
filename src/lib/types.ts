// --- Core Substrate Data ---

export interface SubstrateColor {
  primary: string;
  dim: string;
  ghost: string;
  dead: string;
  glow: string;
  label: string;
  border: string;
}

export interface SubstrateParams {
  id: string;
  name: string;
  shortName: string;
  description: string;
  n: number;
  r2: number;
  k: number;
  g_obs: number;
  g_dec: number;
  g_prs: number;
  cooperative: boolean;
  color: SubstrateColor;
}

// --- Cell State ---

export interface Cell {
  alive: boolean;
  age: number;
  vitality: number;
  justBorn: boolean;
  justDied: boolean;
}

// --- Grid State ---

export interface GridState {
  width: number;
  height: number;
  cells: Cell[][];
  generation: number;
  livingCount: number;
  substrate: SubstrateParams;
}

// --- Simulation Rules (derived from SubstrateParams) ---

export interface DerivedRules {
  birthMin: number;
  birthMax: number;
  survivalFn: (age: number, neighbors: number) => number;
  vitalityDecayRate: number;
  healingRate: number;
  remediationRate: number;
  noiseRate: number;
  measurementProb: number;
}

// --- Simulation Config ---

export interface SimulationConfig {
  gridSize: number;
  tickInterval: number;
  speed: number;
  paused: boolean;
  initialDensity: number;
  seed: number;
}

// --- Laboratory Mode ---

export interface LabState {
  active: boolean;
  paintMode: boolean;
  singleStep: boolean;
  hoveredCell: { row: number; col: number } | null;
}

// --- View Mode ---

export type ViewMode = "overview" | "fullscreen";

export interface AppState {
  viewMode: ViewMode;
  activeSubstrate: string | null;
  config: SimulationConfig;
  lab: LabState;
  grids: Map<string, GridState>;
}

// --- Parameter overrides for sliders ---

export interface ParameterOverrides {
  k?: number;
  g_dec?: number;
  g_obs?: number;
  r2?: number;
}
