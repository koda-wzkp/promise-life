"use client";

interface CellTooltipProps {
  age: number;
  vitality: number;
  neighbors: number;
  alive: boolean;
}

export default function CellTooltip({
  age,
  vitality,
  neighbors,
  alive,
}: CellTooltipProps) {
  return (
    <div
      className="absolute z-50 px-2.5 py-1.5 rounded text-xs font-mono pointer-events-none"
      style={{
        background: "rgba(28, 25, 23, 0.95)",
        border: "1px solid #374151",
      }}
      role="tooltip"
    >
      <div className="text-foreground">
        {alive ? "Alive" : "Dead"} · age {age} · vitality{" "}
        {vitality.toFixed(2)} · {neighbors} neighbors
      </div>
    </div>
  );
}
