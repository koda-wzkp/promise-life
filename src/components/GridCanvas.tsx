"use client";

import { useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { GridState, SubstrateParams, Cell } from "@/lib/types";

interface GridCanvasProps {
  grid: GridState;
  width: number;
  height: number;
  onCellHover?: (row: number, col: number) => void;
  onCellClick?: (row: number, col: number) => void;
  onMouseLeave?: () => void;
  interactive?: boolean;
}

function cellColorRgb(
  cell: Cell,
  substrate: SubstrateParams
): [number, number, number] {
  if (!cell.alive) return hexToRgb(substrate.color.dead);

  if (!substrate.cooperative || substrate.color.glow === substrate.color.primary) {
    return hexToRgb(substrate.color.primary);
  }

  if (cell.vitality > 0.6) return hexToRgb(substrate.color.primary);
  if (cell.vitality > 0.3) return hexToRgb(substrate.color.dim);
  if (cell.vitality > 0.0) return hexToRgb(substrate.color.ghost);
  return hexToRgb(substrate.color.dead);
}

const colorCache = new Map<string, [number, number, number]>();

function hexToRgb(hex: string): [number, number, number] {
  const cached = colorCache.get(hex);
  if (cached) return cached;
  const n = parseInt(hex.slice(1), 16);
  const result: [number, number, number] = [
    (n >> 16) & 255,
    (n >> 8) & 255,
    n & 255,
  ];
  colorCache.set(hex, result);
  return result;
}

export default function GridCanvas({
  grid,
  width,
  height,
  onCellHover,
  onCellClick,
  onMouseLeave,
  interactive = false,
}: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowCanvasRef = useRef<HTMLCanvasElement>(null);

  const reducedMotion = useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
  const highContrast = useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia("(prefers-contrast: more)");
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-contrast: more)").matches,
    () => false
  );

  const cellSize = Math.floor(Math.min(width, height) / grid.width);
  const canvasW = cellSize * grid.width;
  const canvasH = cellSize * grid.height;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    ctx.scale(dpr, dpr);

    // Use ImageData for fast rendering
    const imgCanvas = document.createElement("canvas");
    imgCanvas.width = grid.width;
    imgCanvas.height = grid.height;
    const imgCtx = imgCanvas.getContext("2d")!;
    const imageData = imgCtx.createImageData(grid.width, grid.height);
    const data = imageData.data;

    for (let r = 0; r < grid.height; r++) {
      for (let c = 0; c < grid.width; c++) {
        const cell = grid.cells[r][c];
        const [red, green, blue] = cellColorRgb(cell, grid.substrate);
        const idx = (r * grid.width + c) * 4;
        data[idx] = red;
        data[idx + 1] = green;
        data[idx + 2] = blue;
        data[idx + 3] = 255;
      }
    }

    imgCtx.putImageData(imageData, 0, 0);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(imgCanvas, 0, 0, canvasW, canvasH);

    // High-contrast borders
    if (highContrast) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      for (let r = 0; r < grid.height; r++) {
        for (let c = 0; c < grid.width; c++) {
          if (grid.cells[r][c].alive) {
            ctx.strokeRect(
              c * cellSize + 0.5,
              r * cellSize + 0.5,
              cellSize - 1,
              cellSize - 1
            );
          }
        }
      }
    }

    // Glow layer
    if (
      !reducedMotion &&
      !highContrast &&
      grid.substrate.cooperative &&
      glowCanvasRef.current
    ) {
      const glowCanvas = glowCanvasRef.current;
      const glowCtx = glowCanvas.getContext("2d");
      if (glowCtx) {
        glowCanvas.width = canvasW * dpr;
        glowCanvas.height = canvasH * dpr;
        glowCtx.scale(dpr, dpr);
        glowCtx.clearRect(0, 0, canvasW, canvasH);

        const [gr, gg, gb] = hexToRgb(grid.substrate.color.glow);
        for (let r = 0; r < grid.height; r++) {
          for (let c = 0; c < grid.width; c++) {
            const cell = grid.cells[r][c];
            if (cell.alive && (cell.vitality > 0.8 || cell.justBorn)) {
              glowCtx.fillStyle = `rgba(${gr},${gg},${gb},${cell.justBorn ? 0.4 : 0.2})`;
              const expand = cellSize * 0.5;
              glowCtx.fillRect(
                c * cellSize - expand,
                r * cellSize - expand,
                cellSize + expand * 2,
                cellSize + expand * 2
              );
            }
          }
        }
      }
    }
  }, [grid, canvasW, canvasH, cellSize, reducedMotion, highContrast]);

  useEffect(() => {
    render();
  }, [render]);

  const getCellFromEvent = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasW / rect.width;
      const scaleY = canvasH / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);
      if (row >= 0 && row < grid.height && col >= 0 && col < grid.width) {
        return { row, col };
      }
      return null;
    },
    [canvasW, canvasH, cellSize, grid.height, grid.width]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!onCellHover) return;
      const cell = getCellFromEvent(e);
      if (cell) onCellHover(cell.row, cell.col);
    },
    [getCellFromEvent, onCellHover]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!onCellClick || !interactive) return;
      const cell = getCellFromEvent(e);
      if (cell) onCellClick(cell.row, cell.col);
    },
    [getCellFromEvent, onCellClick, interactive]
  );

  return (
    <div className="relative" style={{ width: canvasW, height: canvasH }}>
      {grid.substrate.cooperative && !reducedMotion && !highContrast && (
        <canvas
          ref={glowCanvasRef}
          className="glow-layer absolute inset-0 pointer-events-none"
          style={{
            width: canvasW,
            height: canvasH,
            filter: "blur(4px)",
            opacity: 0.6,
            mixBlendMode: "screen",
          }}
          aria-hidden="true"
        />
      )}
      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{ width: canvasW, height: canvasH }}
        role="img"
        aria-label={`${grid.substrate.name} cellular automata simulation, generation ${grid.generation}, ${grid.livingCount.toLocaleString()} living cells`}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={onMouseLeave}
      />
    </div>
  );
}
