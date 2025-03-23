import { Cell } from './types';
import { hasPortal, getPortalPair } from './portals';

/**
 * Find a path from the start position to the goal position in a maze
 * This function uses breadth-first search to find the shortest path
 * and handles portal teleportation
 * 
 * @param maze - The maze to solve
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param goalX - Goal X coordinate
 * @param goalY - Goal Y coordinate
 * @returns Array of coordinates representing the path, or empty array if no path found
 */
export function findPath(
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