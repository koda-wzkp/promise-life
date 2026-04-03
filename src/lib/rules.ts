import { SubstrateParams, DerivedRules, ParameterOverrides } from "./types";

const MAX_G_DEC = 6.611;
const LAMBDA = 20;

export function deriveRules(
  s: SubstrateParams,
  overrides?: ParameterOverrides
): DerivedRules {
  const k = overrides?.k ?? s.k;
  const g_dec = overrides?.g_dec ?? s.g_dec;
  const g_obs = overrides?.g_obs ?? s.g_obs;
  const r2 = overrides?.r2 ?? s.r2;
  const cooperative = g_dec > 0;

  // Birth
  const birthMin = cooperative ? 2 : 3;
  const birthMax = 3;

  // Survival (age-dependent via Weibull k)
  const survivalFn = (age: number, neighbors: number): number => {
    if (neighbors < 2 || neighbors > 3) return 0;
    return Math.exp(-Math.pow(age / LAMBDA, k));
  };

  // Vitality decay
  const vitalityDecayRate =
    g_dec > 0 ? 0.005 + (g_dec / MAX_G_DEC) * 0.045 : 0;

  // Healing (self-repair)
  const healingRate = g_dec > 0 ? Math.min(g_dec * 0.02, 0.15) : 0;

  // Remediation
  const remediationRate = s.g_prs > 0 ? Math.min(s.g_prs * 0.02, 0.1) : 0;

  // Noise from fit quality
  const noiseRate = (1 - r2) * 0.03;

  // Measurement probability
  const measurementProb = Math.min(1.0, 0.6 + (g_obs / 1.0) * 0.4);

  return {
    birthMin,
    birthMax,
    survivalFn,
    vitalityDecayRate,
    healingRate,
    remediationRate,
    noiseRate,
    measurementProb,
  };
}
