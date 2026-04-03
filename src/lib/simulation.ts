import { Cell, GridState, SubstrateParams, ParameterOverrides } from "./types";
import { deriveRules } from "./rules";
import { mulberry32 } from "./rng";

export function initGrid(
  substrate: SubstrateParams,
  width: number,
  height: number,
  seed: number,
  density: number
): GridState {
  const rng = mulberry32(seed);
  const cells: Cell[][] = [];
  let livingCount = 0;

  for (let r = 0; r < height; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < width; c++) {
      const alive = rng() < density;
      if (alive) livingCount++;
      row.push({
        alive,
        age: 0,
        vitality: alive ? 1.0 : 0,
        justBorn: false,
        justDied: false,
      });
    }
    cells.push(row);
  }

  return { width, height, cells, generation: 0, livingCount, substrate };
}

function countLivingNeighbors(grid: GridState, r: number, c: number): number {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = (r + dr + grid.height) % grid.height;
      const nc = (c + dc + grid.width) % grid.width;
      if (grid.cells[nr][nc].alive) count++;
    }
  }
  return count;
}

function avgNeighborVitality(grid: GridState, r: number, c: number): number {
  let sum = 0;
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = (r + dr + grid.height) % grid.height;
      const nc = (c + dc + grid.width) % grid.width;
      const cell = grid.cells[nr][nc];
      if (cell.alive) {
        sum += cell.vitality;
        count++;
      }
    }
  }
  return count > 0 ? sum / count : 0;
}

export function tick(
  grid: GridState,
  overrides?: ParameterOverrides
): GridState {
  const rules = deriveRules(grid.substrate, overrides);
  const next: Cell[][] = [];
  let livingCount = 0;

  for (let r = 0; r < grid.height; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < grid.width; c++) {
      const cell = grid.cells[r][c];
      const neighbors = countLivingNeighbors(grid, r, c);
      const neighborVitality = avgNeighborVitality(grid, r, c);

      const measured = Math.random() < rules.measurementProb;

      if (!measured) {
        const newCell: Cell = {
          ...cell,
          vitality: cell.alive
            ? Math.max(0, cell.vitality - rules.vitalityDecayRate)
            : 0,
          age: cell.alive ? cell.age + 1 : 0,
          justBorn: false,
          justDied: false,
        };
        if (newCell.alive) livingCount++;
        row.push(newCell);
        continue;
      }

      // Measured cell
      if (cell.alive) {
        const survProb = rules.survivalFn(cell.age, neighbors);
        const survives = Math.random() < survProb;

        if (survives) {
          const restored = neighborVitality * 0.1;
          const newVitality = Math.min(
            1.0,
            cell.vitality - rules.vitalityDecayRate + restored
          );

          if (newVitality <= 0 && rules.vitalityDecayRate > 0) {
            row.push({
              alive: false,
              age: 0,
              vitality: 0,
              justBorn: false,
              justDied: true,
            });
          } else {
            livingCount++;
            row.push({
              alive: true,
              age: cell.age + 1,
              vitality: rules.vitalityDecayRate > 0 ? newVitality : 1.0,
              justBorn: false,
              justDied: false,
            });
          }
        } else {
          row.push({
            alive: false,
            age: 0,
            vitality: 0,
            justBorn: false,
            justDied: true,
          });
        }
      } else {
        let born = false;

        if (neighbors >= rules.birthMin && neighbors <= rules.birthMax) {
          born = true;
        }
        if (!born && neighbors >= 1 && Math.random() < rules.healingRate) {
          born = true;
        }
        if (
          !born &&
          cell.justDied &&
          Math.random() < rules.remediationRate
        ) {
          born = true;
        }

        if (born) {
          livingCount++;
          row.push({
            alive: true,
            age: 0,
            vitality: 1.0,
            justBorn: true,
            justDied: false,
          });
        } else {
          row.push({
            alive: false,
            age: 0,
            vitality: 0,
            justBorn: false,
            justDied: false,
          });
        }
      }

      // Noise
      if (rules.noiseRate > 0 && Math.random() < rules.noiseRate) {
        const n = row[row.length - 1];
        const flipped: Cell = {
          alive: !n.alive,
          age: 0,
          vitality: n.alive ? 0 : 1.0,
          justBorn: !n.alive,
          justDied: n.alive,
        };
        if (n.alive) livingCount--;
        if (flipped.alive) livingCount++;
        row[row.length - 1] = flipped;
      }
    }
    next.push(row);
  }

  return {
    ...grid,
    cells: next,
    generation: grid.generation + 1,
    livingCount,
  };
}

export function toggleCell(grid: GridState, r: number, c: number): GridState {
  const cells = grid.cells.map((row) => row.map((c) => ({ ...c })));
  const cell = cells[r][c];
  const wasAlive = cell.alive;
  cells[r][c] = {
    alive: !wasAlive,
    age: 0,
    vitality: wasAlive ? 0 : 1.0,
    justBorn: !wasAlive,
    justDied: wasAlive,
  };
  return {
    ...grid,
    cells,
    livingCount: grid.livingCount + (wasAlive ? -1 : 1),
  };
}

export function getCellInfo(
  grid: GridState,
  r: number,
  c: number
): { age: number; vitality: number; neighbors: number; alive: boolean } {
  const cell = grid.cells[r][c];
  return {
    age: cell.age,
    vitality: cell.vitality,
    neighbors: countLivingNeighbors(grid, r, c),
    alive: cell.alive,
  };
}
