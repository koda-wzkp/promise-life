import { SubstrateParams, DerivedRules, ParameterOverrides } from "./types";

export function deriveRules(
  s: SubstrateParams,
  overrides?: ParameterOverrides
): DerivedRules {
  const k = overrides?.k ?? s.k;
  const g_dec = overrides?.g_dec ?? s.g_dec;
  const g_obs = overrides?.g_obs ?? s.g_obs;
  const r2 = overrides?.r2 ?? s.r2;

  // Birth: strict B3 for all. Cooperation advantage is healing, not easier birth.
  const birthMin = 3;
  const birthMax = 3;

  // Survival: Weibull age-dependent. Lambda raised to 30 to let structures live longer.
  const lambda = 30;
  const survivalFn = (age: number, neighbors: number): number => {
    if (neighbors < 2 || neighbors > 3) return 0;
    return Math.exp(-Math.pow(age / lambda, k));
  };

  // Vitality decay: log-scaled to tame ECHO outlier
  const maxGDec = 6.611;
  const vitalityDecayRate =
    g_dec > 0
      ? 0.005 + (Math.log(1 + g_dec) / Math.log(1 + maxGDec)) * 0.035
      : 0;

  // Healing: 10x lower than original. Cooperative self-repair, not chaos injection.
  const healingRate = g_dec > 0 ? Math.min(g_dec * 0.002, 0.015) : 0;

  // Remediation: unchanged
  const remediationRate = s.g_prs > 0 ? Math.min(s.g_prs * 0.02, 0.1) : 0;

  // Noise: cut by 3x
  const noiseRate = (1 - r2) * 0.01;

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
