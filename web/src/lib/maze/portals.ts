import { Cell } from './types';

/**
 * Add portal pairs to an existing maze
 * @param maze - The maze to add portals to
 * @param numPairs - Number of portal pairs to add (default: 2)
 * @returns Updated maze with portal data
 */
export function addPortals(maze: Cell[][], numPairs: number = 2): Cell[][] {
  const height = maze.length;
  const width = maze[0].length;
  
  // Create a deep copy of the maze to avoid modifying the original
  const mazeCopy: Cell[][] = JSON.parse(JSON.stringify(maze));
  
  // Find all cells that are not the entrance or exit
  const validCells: [number, number][] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Skip entrance (0,0) and exit (last cell)
      if ((x === 0 && y === 0) || (x === width - 1 && y === height - 1)) {
        continue;
      }
      validCells.push([x, y]);
    }
  }
  
  // Shuffle the valid cells to select random locations
  for (let i = validCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [validCells[i], validCells[j]] = [validCells[j], validCells[i]];
  }
  
  // Place portal pairs
  for (let i = 0; i < numPairs && i * 2 + 1 < validCells.length; i++) {
    const portalId = i + 1; // Portal IDs start at 1
    
    // Get two random cells for this pair
    const pos1 = validCells[i * 2];
    const pos2 = validCells[i * 2 + 1];
    
    // Add portal data to both cells
    mazeCopy[pos1[1]][pos1[0]].portal = {
      id: portalId,
      pairIndex: 0
    };
    
    mazeCopy[pos2[1]][pos2[0]].portal = {
      id: portalId,
      pairIndex: 1
    };
  }
  
  return mazeCopy;
}

/**
 * Checks if a portal exists at given coordinates
 * @param maze - The maze to check
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Whether a portal exists at given coordinates
 */
export function hasPortal(maze: Cell[][], x: number, y: number): boolean {
  return !!maze[y][x].portal;
}

/**
 * Get the coordinates of the paired portal
 * @param maze - The maze to check
 * @param x - X coordinate of the portal
 * @param y - Y coordinate of the portal
 * @returns Coordinates of the paired portal or null if no portal at given coordinates
 */
export function getPortalPair(maze: Cell[][], x: number, y: number): [number, number] | null {
  const portal = maze[y][x].portal;
  
  if (!portal) return null;
  
  // Find the paired portal (same id, different pairIndex)
  for (let py = 0; py < maze.length; py++) {
    for (let px = 0; px < maze[0].length; px++) {
      // Skip the original portal
      if (px === x && py === y) continue;
      
      const otherPortal = maze[py][px].portal;
      if (otherPortal && otherPortal.id === portal.id && otherPortal.pairIndex !== portal.pairIndex) {
        return [px, py];
      }
    }
  }
  
  return null;
} 