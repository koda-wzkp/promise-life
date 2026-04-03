"use client";

import { useCallback, useState } from "react";
import { GridState } from "@/lib/types";
import { getCellInfo } from "@/lib/simulation";
import GridCanvas from "./GridCanvas";
import SubstrateLabel from "./SubstrateLabel";
import CellTooltip from "./CellTooltip";

interface PetriDishProps {
  grid: GridState;
  size: number;
  compact?: boolean;
  onClick?: () => void;
  onCellClick?: (row: number, col: number) => void;
  onCellHover?: (info: { age: number; vitality: number; neighbors: number; alive: boolean }) => void;
  interactive?: boolean;
  showTooltip?: boolean;
}

export default function PetriDish({
  grid,
  size,
  compact = false,
  onClick,
  onCellClick,
  onCellHover: onCellHoverProp,
  interactive = false,
  showTooltip = false,
}: PetriDishProps) {
  const [tooltip, setTooltip] = useState<{
    age: number;
    vitality: number;
    neighbors: number;
    alive: boolean;
  } | null>(null);

  const handleHover = useCallback(
    (row: number, col: number) => {
      if (!showTooltip && !onCellHoverProp) return;
      const info = getCellInfo(grid, row, col);
      if (showTooltip) setTooltip(info);
      onCellHoverProp?.(info);
    },
    [grid, showTooltip, onCellHoverProp]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <article
      className="flex flex-col items-center"
      role="region"
      aria-label={`${grid.substrate.name} simulation`}
    >
      <div
        className="relative rounded-lg overflow-hidden cursor-pointer"
        style={{
          border: `2px solid ${grid.substrate.color.border}`,
          background: grid.substrate.color.dead,
        }}
        onClick={!interactive ? onClick : undefined}
        onKeyDown={
          !interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
        tabIndex={!interactive ? 0 : undefined}
        role={!interactive ? "button" : undefined}
        aria-label={
          !interactive
            ? `View ${grid.substrate.name} fullscreen`
            : undefined
        }
      >
        <GridCanvas
          grid={grid}
          width={size}
          height={size}
          onCellHover={handleHover}
          onCellClick={onCellClick}
          onMouseLeave={handleMouseLeave}
          interactive={interactive}
        />
        {tooltip && (
          <div className="absolute bottom-2 left-2">
            <CellTooltip {...tooltip} />
          </div>
        )}
      </div>
      <SubstrateLabel substrate={grid.substrate} compact={compact} />
    </article>
  );
}
