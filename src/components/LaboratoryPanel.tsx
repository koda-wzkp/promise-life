"use client";

interface LaboratoryPanelProps {
  active: boolean;
  paused: boolean;
  paintMode: boolean;
  hoveredInfo: { age: number; vitality: number; neighbors: number; alive: boolean } | null;
  onToggleActive: () => void;
  onTogglePaint: () => void;
  onSingleStep: () => void;
}

export default function LaboratoryPanel({
  active,
  paused,
  paintMode,
  hoveredInfo,
  onToggleActive,
  onTogglePaint,
  onSingleStep,
}: LaboratoryPanelProps) {
  return (
    <section
      className="rounded-lg p-4"
      style={{
        background: "rgba(28, 25, 23, 0.6)",
        border: "1px solid #374151",
      }}
      aria-label="Laboratory controls"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold font-sans text-foreground">
          Laboratory
        </h3>
        <button
          onClick={onToggleActive}
          className={`text-xs font-mono px-2 py-1 rounded transition-colors ${
            active
              ? "bg-[#374151] text-foreground"
              : "bg-surface text-muted hover:bg-[#292524]"
          }`}
          aria-pressed={active}
          aria-label="Toggle laboratory mode"
        >
          {active ? "Active" : "Off"}
        </button>
      </div>

      {active && (
        <div className="space-y-2">
          {!paused && (
            <p className="text-xs text-muted font-mono">
              Pause simulation to use laboratory tools.
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePaint}
              disabled={!paused}
              className={`text-xs font-mono px-2.5 py-1 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                paintMode
                  ? "bg-[#374151] text-foreground"
                  : "bg-surface text-muted hover:bg-[#292524]"
              }`}
              aria-pressed={paintMode}
              aria-label="Toggle paint mode to draw cells"
            >
              Paint
            </button>
            <button
              onClick={onSingleStep}
              disabled={!paused}
              className="text-xs font-mono px-2.5 py-1 rounded bg-surface text-muted hover:bg-[#292524] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Advance simulation by one generation"
            >
              Step
            </button>
          </div>
          {hoveredInfo && (
            <p className="text-xs text-muted font-mono">
              {hoveredInfo.alive ? "Alive" : "Dead"} · age{" "}
              {hoveredInfo.age} · vitality {hoveredInfo.vitality.toFixed(2)} ·{" "}
              {hoveredInfo.neighbors} neighbors
            </p>
          )}
        </div>
      )}
    </section>
  );
}
