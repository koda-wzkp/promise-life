"use client";

import { GridState } from "@/lib/types";
import { PENTAGON_ORDER, CENTER_ID } from "@/lib/substrates";
import PetriDish from "./PetriDish";

interface OverviewLayoutProps {
  grids: Map<string, GridState>;
  onSelectSubstrate: (id: string) => void;
  dishSize: number;
}

export default function OverviewLayout({
  grids,
  onSelectSubstrate,
  dishSize,
}: OverviewLayoutProps) {
  const pentagonGrids = PENTAGON_ORDER.map((id) => grids.get(id)).filter(
    Boolean
  ) as GridState[];
  const centerGrid = grids.get(CENTER_ID);

  return (
    <div className="w-full" role="region" aria-label="Six substrate simulations in pentagon layout">
      {/* Desktop: Pentagon + Center */}
      <div className="hidden lg:block">
        <div className="relative mx-auto" style={{ width: dishSize * 3.5, height: dishSize * 3.2 }}>
          {/* Top row: FH, WGI */}
          <div className="absolute" style={{ left: dishSize * 0.5, top: 0 }}>
            {pentagonGrids[0] && (
              <PetriDish
                grid={pentagonGrids[0]}
                size={dishSize}
                compact
                onClick={() => onSelectSubstrate(PENTAGON_ORDER[0])}
              />
            )}
          </div>
          <div className="absolute" style={{ left: dishSize * 2.2, top: 0 }}>
            {pentagonGrids[1] && (
              <PetriDish
                grid={pentagonGrids[1]}
                size={dishSize}
                compact
                onClick={() => onSelectSubstrate(PENTAGON_ORDER[1])}
              />
            )}
          </div>

          {/* Middle row: ECHO, Mycelium (center), MONA */}
          <div className="absolute" style={{ left: 0, top: dishSize * 1.15 }}>
            {pentagonGrids[4] && (
              <PetriDish
                grid={pentagonGrids[4]}
                size={dishSize}
                compact
                onClick={() => onSelectSubstrate(PENTAGON_ORDER[4])}
              />
            )}
          </div>
          <div className="absolute" style={{ left: dishSize * 1.35, top: dishSize * 0.95 }}>
            {centerGrid && (
              <PetriDish
                grid={centerGrid}
                size={dishSize}
                compact
                onClick={() => onSelectSubstrate(CENTER_ID)}
              />
            )}
          </div>
          <div className="absolute" style={{ left: dishSize * 2.7, top: dishSize * 1.15 }}>
            {pentagonGrids[2] && (
              <PetriDish
                grid={pentagonGrids[2]}
                size={dishSize}
                compact
                onClick={() => onSelectSubstrate(PENTAGON_ORDER[2])}
              />
            )}
          </div>

          {/* Bottom: TAXI */}
          <div className="absolute" style={{ left: dishSize * 1.35, top: dishSize * 2.1 }}>
            {pentagonGrids[3] && (
              <PetriDish
                grid={pentagonGrids[3]}
                size={dishSize}
                compact
                onClick={() => onSelectSubstrate(PENTAGON_ORDER[3])}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tablet: 3x2 grid */}
      <div className="hidden md:grid lg:hidden grid-cols-3 gap-4 justify-items-center">
        {[...PENTAGON_ORDER, CENTER_ID].map((id) => {
          const g = grids.get(id);
          if (!g) return null;
          return (
            <PetriDish
              key={id}
              grid={g}
              size={dishSize}
              compact
              onClick={() => onSelectSubstrate(id)}
            />
          );
        })}
      </div>

      {/* Mobile: 2-column grid */}
      <div className="grid md:hidden grid-cols-2 gap-3 justify-items-center">
        {[CENTER_ID, ...PENTAGON_ORDER].map((id) => {
          const g = grids.get(id);
          if (!g) return null;
          return (
            <PetriDish
              key={id}
              grid={g}
              size={dishSize}
              compact
              onClick={() => onSelectSubstrate(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
