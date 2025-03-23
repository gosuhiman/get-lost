import { Cell, MazeSize, SIZE_CONFIGS } from './types';
import { generateMaze, generateSectionedMaze } from './generator';
import { addPortals, addPortalsToSections, hasPortal, getPortalPair } from './portals';

/**
 * Find a path through the maze from start to end
 * Simple implementation to avoid needing a separate solver module
 */
function findPath(
  maze: Cell[][], 
  startX: number, 
  startY: number, 
  goalX: number, 
  goalY: number
): [number, number][] {
  const height = maze.length;
  const width = maze[0].length;
  
  // Direction indices: [North, East, South, West]
  const dx = [0, 1, 0, -1];
  const dy = [-1, 0, 1, 0];
  
  // Keep track of visited cells and the path
  const visited: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));
  const parent: { [key: string]: string } = {}; // Store parent of each cell for path reconstruction
  
  // Queue for BFS
  const queue: [number, number][] = [[startX, startY]];
  visited[startY][startX] = true;
  
  let found = false;
  
  // BFS until we find the goal or exhaust all possibilities
  while (queue.length > 0 && !found) {
    const [x, y] = queue.shift()!;
    
    // Check if we've reached the goal
    if (x === goalX && y === goalY) {
      found = true;
      break;
    }
    
    // First check if we're on a portal
    if (hasPortal(maze, x, y)) {
      const portalPair = getPortalPair(maze, x, y);
      if (portalPair) {
        const [portalX, portalY] = portalPair;
        if (!visited[portalY][portalX]) {
          visited[portalY][portalX] = true;
          parent[`${portalX},${portalY}`] = `${x},${y}`;
          queue.push([portalX, portalY]);
        }
      }
    }
    
    // Check all four directions
    for (let dir = 0; dir < 4; dir++) {
      // If there's no wall in this direction
      if (!maze[y][x].walls[dir]) {
        const newX = x + dx[dir];
        const newY = y + dy[dir];
        
        // If the neighbor is valid and hasn't been visited
        if (
          newX >= 0 && newX < width &&
          newY >= 0 && newY < height &&
          !visited[newY][newX]
        ) {
          visited[newY][newX] = true;
          parent[`${newX},${newY}`] = `${x},${y}`;
          queue.push([newX, newY]);
        }
      }
    }
  }
  
  // If we didn't find a path to the goal
  if (!found) {
    console.warn("No path found in the maze!");
    return [];
  }
  
  // Reconstruct the path from goal to start, then reverse it
  const path: [number, number][] = [];
  let current = `${goalX},${goalY}`;
  
  while (current !== `${startX},${startY}`) {
    const [x, y] = current.split(',').map(Number);
    path.push([x, y]);
    current = parent[current];
  }
  
  // Add the start position
  path.push([startX, startY]);
  
  // Reverse the path to get start-to-goal order
  return path.reverse();
}

/**
 * Generate a new maze with the specified number of portals
 * 
 * @param size - The size of the maze
 * @param numPortals - The number of portal pairs to add
 * @returns A new maze with portals
 */
export function generateMazeWithPortals(
  size: MazeSize,
  numPortals: number
): { maze: Cell[][], path: [number, number][] } {
  // Get the actual dimensions from the size enum
  const dimensions = SIZE_CONFIGS[size];
  
  if (numPortals <= 0) {
    // No portals requested, generate a standard maze
    const maze = generateMaze(dimensions);
    const path = findPath(maze, 0, 0, maze[0].length - 1, maze.length - 1);
    return { maze, path };
  }
  
  // Calculate number of sections based on the number of portals
  // We need at least (numPortals + 1) sections to place numPortals portal pairs
  // Each portal pair connects two sections
  const requestedSections = numPortals + 1;
  
  // Generate a sectioned maze for portals
  console.log(`Generating sectioned maze with requested ${requestedSections} sections for ${numPortals} portal pairs`);
  const result = generateSectionedMaze(dimensions, requestedSections);
  const sectionedMaze = result.maze;
  const deadEnds = result.deadEnds;
  
  // Count how many sections actually got created
  const actualSections = deadEnds.length;
  console.log(`Maze was created with ${actualSections} sections`);
  
  // Calculate max possible portal pairs based on actual sections
  // We can connect at most (n-1) sections with portals in a sequence
  const maxPossiblePortals = Math.max(0, actualSections - 1);
  const adjustedPortals = Math.min(numPortals, maxPossiblePortals);
  
  if (adjustedPortals < numPortals) {
    console.warn(`Can only create ${adjustedPortals} portal pairs with ${actualSections} sections (requested ${numPortals})`);
  }
  
  // Add portals between the sections
  const mazeWithPortals = addPortalsToSections(sectionedMaze, deadEnds, adjustedPortals);
  
  // Find the solution path
  const path = findPath(mazeWithPortals, 0, 0, mazeWithPortals[0].length - 1, mazeWithPortals.length - 1);
  
  console.log(`Generated maze with ${adjustedPortals} portal pairs, path length: ${path.length}`);
  
  return { maze: mazeWithPortals, path };
}

// Re-export other functions for use elsewhere
export {
  generateMaze,
  generateSectionedMaze,
  addPortals,
  addPortalsToSections,
  hasPortal,
  getPortalPair,
  findPath
}; 