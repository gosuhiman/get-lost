import { Cell } from './types';

// Direction indices: [North, East, South, West]
const dx = [0, 1, 0, -1];
const dy = [-1, 0, 1, 0];

/**
 * Counts the number of walls surrounding a cell
 * @param maze - The maze to check
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Number of walls (0-4)
 */
function countWalls(maze: Cell[][], x: number, y: number): number {
  const walls = maze[y][x].walls;
  return walls.filter(wall => wall).length;
}

/**
 * Check if a cell is a dead-end (has 3 walls)
 * @param maze - The maze to check
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Whether the cell is a dead-end
 */
function isDeadEnd(maze: Cell[][], x: number, y: number): boolean {
  return countWalls(maze, x, y) === 3;
}

/**
 * Perform a depth-first search to find all cells reachable from a starting point
 * @param maze - The maze to search
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @returns Array of reachable cell coordinates [x, y]
 */
function findReachableCells(
  maze: Cell[][], 
  startX: number, 
  startY: number
): [number, number][] {
  const width = maze[0].length;
  const height = maze.length;
  const visited: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));
  const reachable: [number, number][] = [];
  const stack: [number, number][] = [[startX, startY]];
  
  visited[startY][startX] = true;
  
  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    reachable.push([x, y]);
    
    // Check all four directions
    for (let dir = 0; dir < 4; dir++) {
      // If there's no wall in this direction
      if (!maze[y][x].walls[dir]) {
        const newX = x + dx[dir];
        const newY = y + dy[dir];
        
        // If the neighbor hasn't been visited
        if (
          newX >= 0 && newX < width &&
          newY >= 0 && newY < height &&
          !visited[newY][newX]
        ) {
          visited[newY][newX] = true;
          stack.push([newX, newY]);
        }
      }
    }
  }
  
  return reachable;
}

/**
 * Add portal pairs to connect sections in a sectioned maze.
 * Each portal pair connects two different sections of the maze.
 * 
 * @param maze - The sectioned maze
 * @param sectionDeadEnds - Array of dead ends for each section
 * @param numPairs - Maximum number of portal pairs to add
 * @returns Updated maze with portals
 */
export function addPortalsToSections(
  maze: Cell[][], 
  sectionDeadEnds: [number, number][][],
  numPairs: number
): Cell[][] {
  const mazeCopy: Cell[][] = JSON.parse(JSON.stringify(maze));
  const numSections = sectionDeadEnds.length;
  
  console.log(`Adding portals to connect ${numSections} sections, requested pairs: ${numPairs}`);
  
  // We need at least 2 sections to create portal pairs
  if (numSections < 2) {
    console.warn("Not enough sections to create portal pairs");
    return mazeCopy;
  }
  
  // Count available dead ends in each section
  const deadEndCounts = sectionDeadEnds.map(deadEnds => deadEnds.length);
  console.log(`Dead ends per section: ${deadEndCounts.join(', ')}`);
  
  // Check if we have at least one dead end in each section
  const sectionsWithDeadEnds = deadEndCounts.filter(count => count > 0).length;
  
  if (sectionsWithDeadEnds < 2) {
    console.warn("Not enough sections with dead ends");
    return mazeCopy;
  }
  
  // Create adjacency list to determine which sections need to be connected
  // Each section should be connected to the next one in sequence
  const requiredConnections: [number, number][] = [];
  for (let i = 0; i < numSections - 1; i++) {
    if (deadEndCounts[i] > 0 && deadEndCounts[i + 1] > 0) {
      requiredConnections.push([i, i + 1]);
    }
  }
  
  // If we need more connections and have requested more portal pairs
  // add additional connections between non-adjacent sections
  if (requiredConnections.length < numPairs) {
    // Create a list of potential additional connections
    const additionalConnections: [number, number][] = [];
    
    for (let i = 0; i < numSections; i++) {
      for (let j = i + 2; j < numSections; j++) { // Skip adjacent sections (i+1)
        if (deadEndCounts[i] > 0 && deadEndCounts[j] > 0) {
          additionalConnections.push([i, j]);
        }
      }
    }
    
    // Shuffle the additional connections
    for (let i = additionalConnections.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [additionalConnections[i], additionalConnections[j]] = 
        [additionalConnections[j], additionalConnections[i]];
    }
    
    // Add as many additional connections as needed (up to numPairs)
    const connectionsToAdd = Math.min(
      numPairs - requiredConnections.length,
      additionalConnections.length
    );
    
    for (let i = 0; i < connectionsToAdd; i++) {
      requiredConnections.push(additionalConnections[i]);
    }
  }
  
  console.log(`Creating ${requiredConnections.length} portal connections`);
  
  // Keep track of which dead ends have been used
  const usedDeadEnds = new Set<string>();
  
  // Add portals for each required connection
  for (let i = 0; i < requiredConnections.length; i++) {
    const [section1, section2] = requiredConnections[i];
    
    // Find available dead ends in both sections
    const availableDeadEnds1 = sectionDeadEnds[section1].filter(
      ([x, y]) => !usedDeadEnds.has(`${x},${y}`)
    );
    
    const availableDeadEnds2 = sectionDeadEnds[section2].filter(
      ([x, y]) => !usedDeadEnds.has(`${x},${y}`)
    );
    
    // Skip if either section has no available dead ends
    if (availableDeadEnds1.length === 0 || availableDeadEnds2.length === 0) {
      console.warn(`Skipping connection between sections ${section1} and ${section2} due to lack of dead ends`);
      continue;
    }
    
    // Pick random dead ends from each section
    const pos1 = availableDeadEnds1[Math.floor(Math.random() * availableDeadEnds1.length)];
    const pos2 = availableDeadEnds2[Math.floor(Math.random() * availableDeadEnds2.length)];
    
    // Mark these dead ends as used
    usedDeadEnds.add(`${pos1[0]},${pos1[1]}`);
    usedDeadEnds.add(`${pos2[0]},${pos2[1]}`);
    
    // Add portal pair
    const portalId = i + 1;
    mazeCopy[pos1[1]][pos1[0]].portal = {
      id: portalId,
      pairIndex: 0
    };
    
    mazeCopy[pos2[1]][pos2[0]].portal = {
      id: portalId,
      pairIndex: 1
    };
    
    console.log(`Added portal pair ${portalId} connecting sections ${section1} and ${section2} at (${pos1[0]},${pos1[1]}) and (${pos2[0]},${pos2[1]})`);
  }
  
  return mazeCopy;
}

/**
 * Add portal pairs to an existing maze (old implementation, kept for compatibility)
 * @param maze - The maze to add portals to
 * @param numPairs - Number of portal pairs to add (default: 2)
 * @returns Updated maze with portal data
 */
export function addPortals(maze: Cell[][], numPairs: number = 2): Cell[][] {
  const height = maze.length;
  const width = maze[0].length;
  
  console.log(`Starting addPortals with numPairs=${numPairs}, maze size ${width}x${height}`);
  
  // Create a deep copy of the maze to avoid modifying the original
  const mazeCopy: Cell[][] = JSON.parse(JSON.stringify(maze));
  
  // Create a list of valid cells (not entrance or exit)
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
    
    console.log(`Adding portal pair ${portalId} at (${pos1[0]},${pos1[1]}) and (${pos2[0]},${pos2[1]})`);
    
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