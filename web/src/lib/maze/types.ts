export interface Cell {
  walls: [boolean, boolean, boolean, boolean]; // N,E,S,W
  visited: boolean;
}

export type MazeSize = 'S' | 'M' | 'L' | 'XL';

export interface SizeConfig {
  width: number;
  height: number;
}

export const SIZE_CONFIGS: Record<MazeSize, SizeConfig> = {
  'S': { width: 10, height: 10 },
  'M': { width: 20, height: 20 },
  'L': { width: 30, height: 30 },
  'XL': { width: 40, height: 40 },
}; 