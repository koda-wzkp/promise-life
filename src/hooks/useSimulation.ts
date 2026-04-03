"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { GridState, SimulationConfig, ParameterOverrides } from "@/lib/types";
import { SUBSTRATES } from "@/lib/substrates";
import { initGrid, tick } from "@/lib/simulation";

const DEFAULT_CONFIG: SimulationConfig = {
  gridSize: 80,
  tickInterval: 150,
  speed: 1,
  paused: false,
  initialDensity: 0.35,
  seed: 20260402,
};

export function useSimulation() {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [grids, setGrids] = useState<Map<string, GridState>>(new Map());
  const [overrides, setOverrides] = useState<
    Map<string, ParameterOverrides>
  >(new Map());
  const [generation, setGeneration] = useState(0);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridsRef = useRef<Map<string, GridState>>(new Map());

  // Initialize all grids
  const initAllGrids = useCallback(
    (seed: number) => {
      const newGrids = new Map<string, GridState>();
      for (const sub of SUBSTRATES) {
        newGrids.set(
          sub.id,
          initGrid(sub, config.gridSize, config.gridSize, seed, config.initialDensity)
        );
      }
      gridsRef.current = newGrids;
      setGrids(new Map(newGrids));
      setGeneration(0);
    },
    [config.gridSize, config.initialDensity]
  );

  // Initialize on mount
  useEffect(() => {
    initAllGrids(config.seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulation tick
  const doTick = useCallback(() => {
    const current = gridsRef.current;
    const next = new Map<string, GridState>();
    for (const [id, grid] of current) {
      const ov = overrides.get(id);
      next.set(id, tick(grid, ov));
    }
    gridsRef.current = next;
    setGrids(new Map(next));
    setGeneration((g) => g + 1);
  }, [overrides]);

  // Tick loop
  useEffect(() => {
    if (config.paused) {
      if (tickRef.current) {
        clearTimeout(tickRef.current);
        tickRef.current = null;
      }
      return;
    }

    const interval = config.tickInterval / config.speed;

    const loop = () => {
      doTick();
      tickRef.current = setTimeout(loop, interval);
    };

    tickRef.current = setTimeout(loop, interval);

    return () => {
      if (tickRef.current) {
        clearTimeout(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [config.paused, config.tickInterval, config.speed, doTick]);

  const togglePause = useCallback(() => {
    setConfig((c) => ({ ...c, paused: !c.paused }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setConfig((c) => ({ ...c, speed }));
  }, []);

  const reset = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 2147483647);
    setConfig((c) => ({ ...c, seed: newSeed }));
    initAllGrids(newSeed);
    setOverrides(new Map());
  }, [initAllGrids]);

  const updateGrid = useCallback((id: string, grid: GridState) => {
    gridsRef.current.set(id, grid);
    setGrids(new Map(gridsRef.current));
  }, []);

  const setSubstrateOverrides = useCallback(
    (id: string, ov: ParameterOverrides) => {
      setOverrides((prev) => {
        const next = new Map(prev);
        if (Object.keys(ov).length === 0) {
          next.delete(id);
        } else {
          next.set(id, ov);
        }
        return next;
      });
    },
    []
  );

  const clearSubstrateOverrides = useCallback(
    (id: string) => {
      setOverrides((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    },
    []
  );

  return {
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
  };
}
