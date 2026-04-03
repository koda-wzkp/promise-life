"use client";

import { useState, useCallback, useEffect } from "react";
import { GridState, ParameterOverrides } from "@/lib/types";
import { tick, toggleCell } from "@/lib/simulation";
import PetriDish from "./PetriDish";
import ParameterSliders from "./ParameterSliders";
import LaboratoryPanel from "./LaboratoryPanel";
import TransportControls from "./TransportControls";

interface FullscreenViewProps {
  grid: GridState;
  paused: boolean;
  speed: number;
  overrides: ParameterOverrides;
  onBack: () => void;
  onTogglePause: () => void;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
  onOverridesChange: (overrides: ParameterOverrides) => void;
  onOverridesReset: () => void;
  onGridUpdate: (grid: GridState) => void;
}

export default function FullscreenView({
  grid,
  paused,
  speed,
  overrides,
  onBack,
  onTogglePause,
  onSetSpeed,
  onReset,
  onOverridesChange,
  onOverridesReset,
  onGridUpdate,
}: FullscreenViewProps) {
  const [labActive, setLabActive] = useState(false);
  const [paintMode, setPaintMode] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState<{
    age: number;
    vitality: number;
    neighbors: number;
    alive: boolean;
  } | null>(null);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!labActive || !paused || !paintMode) return;
      onGridUpdate(toggleCell(grid, row, col));
    },
    [grid, labActive, paused, paintMode, onGridUpdate]
  );

  const handleSingleStep = useCallback(() => {
    if (!paused) return;
    onGridUpdate(tick(grid, overrides));
  }, [grid, paused, overrides, onGridUpdate]);

  // Responsive size
  const [canvasSize, setCanvasSize] = useState(480);
  useEffect(() => {
    function calc() {
      setCanvasSize(Math.min(window.innerWidth - 48, window.innerHeight - 380, 640));
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="text-sm font-mono text-muted hover:text-foreground transition-colors"
          aria-label="Back to overview"
        >
          &larr; Back to Overview
        </button>
        <h2
          className="text-lg font-semibold font-sans"
          style={{ color: grid.substrate.color.label }}
        >
          {grid.substrate.name}
        </h2>
      </div>

      <div className="text-xs text-muted font-mono mb-4">
        R&sup2; = {grid.substrate.r2.toFixed(3)} | N ={" "}
        {grid.substrate.n.toLocaleString()} | k = {grid.substrate.k.toFixed(3)}
      </div>

      <div className="flex justify-center mb-4">
        <PetriDish
          grid={grid}
          size={canvasSize}
          interactive={labActive && paused && paintMode}
          showTooltip
          onCellClick={handleCellClick}
          onCellHover={setHoveredInfo}
        />
      </div>

      <div className="mb-4">
        <TransportControls
          paused={paused}
          speed={speed}
          generation={grid.generation}
          onTogglePause={onTogglePause}
          onSetSpeed={onSetSpeed}
          onReset={onReset}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ParameterSliders
          substrate={grid.substrate}
          overrides={overrides}
          onChange={onOverridesChange}
          onReset={onOverridesReset}
        />
        <LaboratoryPanel
          active={labActive}
          paused={paused}
          paintMode={paintMode}
          hoveredInfo={hoveredInfo}
          onToggleActive={() => setLabActive(!labActive)}
          onTogglePaint={() => setPaintMode(!paintMode)}
          onSingleStep={handleSingleStep}
        />
      </div>
    </div>
  );
}
