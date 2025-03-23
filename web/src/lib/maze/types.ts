export interface Cell {
  walls: [boolean, boolean, boolean, boolean]; // N,E,S,W
  visited: boolean;
  portal?: {
    id: number;      // Unique identifier for the portal pair
    pairIndex: number; // Index of the paired portal cell (0 or 1)
  };
}

export type MazeSize = 'S' | 'M' | 'L' | 'XL';

export interface SizeConfig {
  width: number;
  height: number;
}

// Adjusted for A4 paper size (1:1.414 ratio)
export const SIZE_CONFIGS: Record<MazeSize, SizeConfig> = {
  'S': { width: 12, height: 17 },  // A4 proportional
  'M': { width: 21, height: 30 },  // A4 proportional
  'L': { width: 30, height: 42 },  // A4 proportional
  'XL': { width: 40, height: 56 }, // A4 proportional
}; 