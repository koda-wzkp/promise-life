import { SubstrateParams } from "./types";

export const SUBSTRATES: SubstrateParams[] = [
  {
    id: "freedom-house",
    name: "Freedom House",
    shortName: "FH",
    description: "Democratic liberty scores across 195 countries, 1973-2023.",
    n: 1514,
    r2: 0.994,
    k: 1.01,
    g_obs: 0.102,
    g_dec: 0.231,
    g_prs: 0.0,
    cooperative: true,
    color: {
      primary: "#F59E0B",
      dim: "#D97706",
      ghost: "#92400E",
      dead: "#1C1917",
      glow: "#FCD34D",
      label: "#FDE68A",
      border: "#B45309",
    },
  },
  {
    id: "wgi",
    name: "World Governance Indicators",
    shortName: "WGI",
    description: "Six governance dimensions across 200+ economies, 1996-2022.",
    n: 3333,
    r2: 0.992,
    k: 1.004,
    g_obs: 0.191,
    g_dec: 0.279,
    g_prs: 0.0,
    cooperative: true,
    color: {
      primary: "#F97316",
      dim: "#EA580C",
      ghost: "#9A3412",
      dead: "#1C1917",
      glow: "#FDBA74",
      label: "#FED7AA",
      border: "#C2410C",
    },
  },
  {
    id: "mona",
    name: "MONA (IMF)",
    shortName: "MONA",
    description:
      "69,847 IMF lending conditions across 91 countries, 2002-2024.",
    n: 69847,
    r2: 0.947,
    k: 0.667,
    g_obs: 0.515,
    g_dec: 0.195,
    g_prs: 0.0,
    cooperative: true,
    color: {
      primary: "#EF4444",
      dim: "#DC2626",
      ghost: "#991B1B",
      dead: "#1C1917",
      glow: "#FCA5A5",
      label: "#FECACA",
      border: "#B91C1C",
    },
  },
  {
    id: "echo",
    name: "ECHO (EPA)",
    shortName: "ECHO",
    description: "Oregon NPDES effluent violations, EPA compliance data.",
    n: 155,
    r2: 0.721,
    k: 1.196,
    g_obs: 0.991,
    g_dec: 6.611,
    g_prs: 0.0,
    cooperative: true,
    color: {
      primary: "#10B981",
      dim: "#059669",
      ghost: "#065F46",
      dead: "#1C1917",
      glow: "#6EE7B7",
      label: "#A7F3D0",
      border: "#047857",
    },
  },
  {
    id: "nyc-taxi",
    name: "NYC Taxi",
    shortName: "TAXI",
    description: "~45,000 taxi queue observations. Non-cooperative control.",
    n: 45000,
    r2: 0.903,
    k: 1.394,
    g_obs: 0.445,
    g_dec: 0.0,
    g_prs: 0.0,
    cooperative: false,
    color: {
      primary: "#6B7280",
      dim: "#4B5563",
      ghost: "#374151",
      dead: "#1C1917",
      glow: "#6B7280",
      label: "#9CA3AF",
      border: "#4B5563",
    },
  },
  {
    id: "mycelium",
    name: "Mycelium",
    shortName: "MYC",
    description: "Fungal network nutrient transport, 2,440 observations.",
    n: 2440,
    r2: 0.985,
    k: 1.06,
    g_obs: 0.0,
    g_dec: 0.026,
    g_prs: 0.0,
    cooperative: true,
    color: {
      primary: "#14B8A6",
      dim: "#0D9488",
      ghost: "#115E59",
      dead: "#1C1917",
      glow: "#5EEAD4",
      label: "#99F6E4",
      border: "#0F766E",
    },
  },
];

/** Pentagon layout order: FH (top-left), WGI (top-right), MONA (right), TAXI (bottom), ECHO (left). Mycelium at center. */
export const PENTAGON_ORDER = [
  "freedom-house",
  "wgi",
  "mona",
  "nyc-taxi",
  "echo",
];
export const CENTER_ID = "mycelium";

export function getSubstrate(id: string): SubstrateParams {
  const s = SUBSTRATES.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown substrate: ${id}`);
  return s;
}

export function getSubstrateLabel(s: SubstrateParams): string {
  const coop = s.cooperative
    ? s.id === "echo"
      ? "Composting regime"
      : "Cooperative"
    : "Non-cooperative";
  const nLabel =
    s.n >= 1000 ? `${(s.n / 1000).toFixed(s.n >= 10000 ? 0 : 1)}k` : `${s.n}`;
  return `R\u00B2 = ${s.r2.toFixed(3)} \u00B7 ${nLabel} obs \u00B7 ${coop}`;
}
