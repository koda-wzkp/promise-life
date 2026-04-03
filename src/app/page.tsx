"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { ViewMode, ParameterOverrides } from "@/lib/types";
import { useSimulation } from "@/hooks/useSimulation";
import OverviewLayout from "@/components/OverviewLayout";
import FullscreenView from "@/components/FullscreenView";
import TransportControls from "@/components/TransportControls";
import Legend from "@/components/Legend";

function useResponsiveDishSize(): number {
  const [size, setSize] = useState(240);

  useEffect(() => {
    function calc() {
      const w = window.innerWidth;
      if (w < 768) setSize(Math.floor((w - 48) / 2));
      else if (w < 1024) setSize(180);
      else setSize(Math.min(240, Math.floor((w - 200) / 3.8)));
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return size;
}

export default function Home() {
  const {
    config,
    grids,
    generation,
    overrides,
    togglePause,
    setSpeed,
    reset,
    updateGrid,
    setSubstrateOverrides,
    clearSubstrateOverrides,
  } = useSimulation();

  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [activeSubstrate, setActiveSubstrate] = useState<string | null>(null);
  const dishSize = useResponsiveDishSize();

  const handleSelectSubstrate = useCallback((id: string) => {
    setActiveSubstrate(id);
    setViewMode("fullscreen");
  }, []);

  const handleBack = useCallback(() => {
    setViewMode("overview");
    setActiveSubstrate(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && viewMode === "fullscreen") {
        handleBack();
      }
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        togglePause();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewMode, handleBack, togglePause]);

  const activeGrid = activeSubstrate ? grids.get(activeSubstrate) : null;
  const activeOverrides = useMemo(
    () => (activeSubstrate ? overrides.get(activeSubstrate) ?? {} : {}),
    [activeSubstrate, overrides]
  );

  // Generation for screen reader announcement (every 10 gens)
  const announceGen = Math.floor(generation / 10) * 10;

  return (
    <>
      <header className="px-4 md:px-8 pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold font-serif text-foreground">
          Promise Life
        </h1>
        <p className="text-sm text-muted font-sans mt-1">
          Same seed. Six rulesets. Six futures.
        </p>
      </header>

      <main id="main-content" className="flex-1 px-4 md:px-8 py-4">
        {viewMode === "overview" && (
          <>
            <p className="text-xs text-muted font-mono max-w-2xl mb-6 leading-relaxed">
              Conway&apos;s Game of Life with one modification: the rules come
              from real data. Each grid runs a cellular automaton whose birth,
              survival, and death rules are derived from Lindblad master
              equation parameters fitted to institutional commitment networks.
              Cooperative systems glow, self-repair, and breathe.
              Non-cooperative systems flatline. The cooperation
              diagnostic&mdash;visible.
            </p>

            <OverviewLayout
              grids={grids}
              onSelectSubstrate={handleSelectSubstrate}
              dishSize={dishSize}
            />

            <div className="mt-6 max-w-2xl">
              <TransportControls
                paused={config.paused}
                speed={config.speed}
                generation={generation}
                onTogglePause={togglePause}
                onSetSpeed={setSpeed}
                onReset={reset}
              />
            </div>

            <div className="mt-4">
              <Legend />
            </div>
          </>
        )}

        {viewMode === "fullscreen" && activeGrid && activeSubstrate && (
          <FullscreenView
            grid={activeGrid}
            paused={config.paused}
            speed={config.speed}
            overrides={activeOverrides}
            onBack={handleBack}
            onTogglePause={togglePause}
            onSetSpeed={setSpeed}
            onReset={reset}
            onOverridesChange={(ov: ParameterOverrides) =>
              setSubstrateOverrides(activeSubstrate, ov)
            }
            onOverridesReset={() => clearSubstrateOverrides(activeSubstrate)}
            onGridUpdate={(g) => updateGrid(activeSubstrate, g)}
          />
        )}

        {/* Screen reader generation announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Generation {announceGen}
        </div>
      </main>

      <footer className="px-4 md:px-8 py-4 border-t border-[#374151]">
        <p className="text-[10px] text-muted font-mono leading-relaxed max-w-2xl">
          Parameters from Nolan-Finkel (2026), &ldquo;The Data Wants Its
          Physics Back.&rdquo; 267,000+ observations across 9 substrates.
          benthos &middot; Pleco &middot; AGPL-3.0
        </p>
      </footer>
    </>
  );
}
