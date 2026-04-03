"use client";

interface TransportControlsProps {
  paused: boolean;
  speed: number;
  generation: number;
  onTogglePause: () => void;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
}

const SPEEDS = [0.5, 1, 2, 4];

export default function TransportControls({
  paused,
  speed,
  generation,
  onTogglePause,
  onSetSpeed,
  onReset,
}: TransportControlsProps) {
  return (
    <nav
      className="flex items-center gap-3 flex-wrap"
      role="toolbar"
      aria-label="Simulation controls"
    >
      <button
        onClick={onTogglePause}
        className="px-3 py-1.5 rounded text-sm font-mono bg-surface hover:bg-[#292524] transition-colors"
        aria-label={paused ? "Play simulation" : "Pause simulation"}
      >
        {paused ? "\u25B6 Play" : "\u23F8 Pause"}
      </button>

      <div className="flex items-center gap-1" role="radiogroup" aria-label="Simulation speed">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSetSpeed(s)}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
              speed === s
                ? "bg-[#374151] text-foreground"
                : "bg-surface text-muted hover:bg-[#292524]"
            }`}
            role="radio"
            aria-checked={speed === s}
            aria-label={`${s}x speed`}
          >
            {s}x
          </button>
        ))}
      </div>

      <button
        onClick={onReset}
        className="px-3 py-1.5 rounded text-sm font-mono bg-surface hover:bg-[#292524] transition-colors"
        aria-label="Reset simulation with new seed"
      >
        &#8635; Reset
      </button>

      <span
        className="text-xs text-muted font-mono ml-auto"
        aria-live="polite"
        aria-atomic="true"
      >
        Gen: {generation.toLocaleString()}
      </span>
    </nav>
  );
}
