"use client";

import { SubstrateParams, ParameterOverrides } from "@/lib/types";

interface ParameterSlidersProps {
  substrate: SubstrateParams;
  overrides: ParameterOverrides;
  onChange: (overrides: ParameterOverrides) => void;
  onReset: () => void;
}

interface SliderDef {
  key: keyof ParameterOverrides;
  label: string;
  tooltip: string;
  min: number;
  max: number;
  step: number;
  empirical: number;
}

export default function ParameterSliders({
  substrate,
  overrides,
  onChange,
  onReset,
}: ParameterSlidersProps) {
  const sliders: SliderDef[] = [
    {
      key: "k",
      label: "Commitment Shape",
      tooltip:
        "k < 1: older commitments get stronger. k > 1: they get weaker. k = 1: age doesn't matter.",
      min: 0.3,
      max: 3.0,
      step: 0.01,
      empirical: substrate.k,
    },
    {
      key: "g_dec",
      label: "Drift Rate",
      tooltip:
        "How fast verified commitments fade without re-verification. Zero in non-cooperative systems.",
      min: 0.0,
      max: 7.0,
      step: 0.01,
      empirical: substrate.g_dec,
    },
    {
      key: "g_obs",
      label: "Observation Rate",
      tooltip:
        "How often rules are enforced. Higher = more frequent measurement.",
      min: 0.0,
      max: 1.0,
      step: 0.01,
      empirical: substrate.g_obs,
    },
    {
      key: "r2",
      label: "Fit Quality",
      tooltip:
        "How deterministic the rules are. Lower = more random noise.",
      min: 0.5,
      max: 1.0,
      step: 0.005,
      empirical: substrate.r2,
    },
  ];

  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <section
      className="rounded-lg p-4"
      style={{
        background: "rgba(28, 25, 23, 0.6)",
        border: "1px solid #374151",
      }}
      aria-label="Parameter controls"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold font-sans text-foreground">
          Parameters
        </h3>
        <button
          onClick={onReset}
          disabled={!hasOverrides}
          className="text-xs font-mono px-2 py-1 rounded bg-surface hover:bg-[#292524] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Reset parameters to empirical values"
        >
          Reset to Empirical
        </button>
      </div>

      <div className="space-y-3">
        {sliders.map((s) => {
          const value = overrides[s.key] ?? s.empirical;
          return (
            <div key={s.key}>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor={`slider-${s.key}`}
                  className="text-xs text-muted font-mono"
                  title={s.tooltip}
                >
                  {s.label} ({s.key})
                </label>
                <span className="text-xs font-mono text-foreground tabular-nums">
                  {value.toFixed(s.step < 0.01 ? 3 : 2)}
                </span>
              </div>
              <input
                id={`slider-${s.key}`}
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={value}
                onChange={(e) =>
                  onChange({ ...overrides, [s.key]: parseFloat(e.target.value) })
                }
                aria-label={`${s.label}: ${value.toFixed(3)}`}
                aria-valuemin={s.min}
                aria-valuemax={s.max}
                aria-valuenow={value}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
