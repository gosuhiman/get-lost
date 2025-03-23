import { addPortals, hasPortal, getPortalPair } from '@/lib/maze/portals';
import { generateMaze } from '@/lib/maze/generator';
import { Cell } from '@/lib/maze/types';

// Helper to count walls around a cell
function countWalls(maze: Cell[][], x: number, y: number): number {
  return maze[y][x].walls.filter((wall: boolean) => wall).length;
}

// Helper function to find all cells reachable from a starting position without using portals
function findReachableCells(maze: Cell[][], startX: number, startY: number): [number, number][] {
  const width = maze[0].length;
  const height = maze.length;
  const visited: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));
  const reachable: [number, number][] = [];
  const stack: [number, number][] = [[startX, startY]];
  
  // Direction indices: [North, East, South, West]
  const dx = [0, 1, 0, -1];
  const dy = [-1, 0, 1, 0];
  
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

describe('Portal System', () => {
  describe('addPortals', () => {
    it('should add the correct number of portal pairs', () => {
      const width = 10;
      const height = 10;
      const numPairs = 3;
      
      const maze = generateMaze({ width, height });
      const mazeWithPortals = addPortals(maze, numPairs);
      
      // Count the number of portals
      let portalCount = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (mazeWithPortals[y][x].portal) {
            portalCount++;
          }
        }
      }
      
      // Should be 2 cells per pair, but might be fewer if we couldn't place all pairs
      expect(portalCount).toBeLessThanOrEqual(numPairs * 2);
      expect(portalCount % 2).toBe(0); // Should always be an even number
    });
    
    it('should not place portals at entrance or exit', () => {
      const width = 8;
      const height = 8;
      const maze = generateMaze({ width, height });
      const mazeWithPortals = addPortals(maze, 5);
      
      // Check entrance (0,0)
      expect(mazeWithPortals[0][0].portal).toBeUndefined();
      
      // Check exit (width-1, height-1)
      expect(mazeWithPortals[height - 1][width - 1].portal).toBeUndefined();
    });
    
    it('should create valid portal pair links', () => {
      const width = 15;
      const height = 15;
      const numPairs = 4;
      
      const maze = generateMaze({ width, height });
      const mazeWithPortals = addPortals(maze, numPairs);
      
      // For each portal, find its pair and verify properties
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const portal = mazeWithPortals[y][x].portal;
          if (portal) {
            // Find its pair
            let pairFound = false;
            for (let py = 0; py < height; py++) {
              for (let px = 0; px < width; px++) {
                if (px === x && py === y) continue; // Skip self
                
                const otherPortal = mazeWithPortals[py][px].portal;
                if (otherPortal && otherPortal.id === portal.id) {
                  pairFound = true;
                  
                  // Verify pair has matching ID but different pairIndex
                  expect(otherPortal.id).toBe(portal.id);
                  expect(otherPortal.pairIndex).not.toBe(portal.pairIndex);
                  
                  // One should be 0 and the other 1
                  expect(
                    (portal.pairIndex === 0 && otherPortal.pairIndex === 1) ||
                    (portal.pairIndex === 1 && otherPortal.pairIndex === 0)
                  ).toBe(true);
                }
              }
            }
            
            expect(pairFound).toBe(true);
          }
        }
      }
    });

    it('should place portals at dead-ends (cells with 3 walls)', () => {
      const width = 20;
      const height = 20;
      const numPairs = 5;
      
      const maze = generateMaze({ width, height });
      const mazeWithPortals = addPortals(maze, numPairs);
      
      // Check that all portals are at dead-ends
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (mazeWithPortals[y][x].portal) {
            const wallCount = countWalls(mazeWithPortals, x, y);
            expect(wallCount).toBe(3);
          }
        }
      }
    });
    
    it('should ensure portal pairs are not reachable from each other without using portals', () => {
      const width = 20;
      const height = 20;
      const numPairs = 3;
      
      const maze = generateMaze({ width, height });
      const mazeWithPortals = addPortals(maze, numPairs);
      
      // For each portal, check that its pair is not reachable
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const portal = mazeWithPortals[y][x].portal;
          if (portal) {
            // Find its pair coordinates
            const pairCoords = getPortalPair(mazeWithPortals, x, y);
            expect(pairCoords).not.toBeNull();
            
            if (pairCoords) {
              const [pairX, pairY] = pairCoords;
              
              // Find all cells reachable from this portal without using portals
              const reachableCells = findReachableCells(mazeWithPortals, x, y);
              
              // The pair should not be in the reachable cells
              const isPairReachable = reachableCells.some(
                ([rx, ry]) => rx === pairX && ry === pairY
              );
              
              expect(isPairReachable).toBe(false);
            }
          }
        }
      }
    });
  });
  
  describe('hasPortal', () => {
    it('should correctly identify cells with portals', () => {
      const width = 10;
      const height = 10;
      const maze = generateMaze({ width, height });
      const mazeWithPortals = addPortals(maze, 2);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const hasPortalActual = !!mazeWithPortals[y][x].portal;
          expect(hasPortal(mazeWithPortals, x, y)).toBe(hasPortalActual);
        }
      }
    });
  });
  
  describe('getPortalPair', () => {
    it('should return null for cells without portals', () => {
      const width = 8;
      const height = 8;
      const maze = generateMaze({ width, height });
      const mazeWithPortals = addPortals(maze, 2);
      
      // Find a cell without a portal
      let nonPortalX = -1, nonPortalY = -1;
      outerLoop: for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (!mazeWithPortals[y][x].portal) {
            nonPortalX = x;
            nonPortalY = y;
            break outerLoop;
          }
        }
      }
      
      if (nonPortalX !== -1 && nonPortalY !== -1) {
        expect(getPortalPair(mazeWithPortals, nonPortalX, nonPortalY)).toBeNull();
      }
    });
    
    it('should correctly find portal pairs', () => {
      const width = 10;
      const height = 10;
      const maze = generateMaze({ width, height });
      const mazeWithPortals = addPortals(maze, 3);
      
      // For each portal, check that getPortalPair returns the correct coordinates
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const portal = mazeWithPortals[y][x].portal;
          if (portal) {
            const pair = getPortalPair(mazeWithPortals, x, y);
            
            // Should have found a pair
            expect(pair).not.toBeNull();
            
            if (pair) {
              const [pairX, pairY] = pair;
              
              // The pair should have a portal with matching ID
              const pairPortal = mazeWithPortals[pairY][pairX].portal;
              expect(pairPortal).toBeDefined();
              expect(pairPortal?.id).toBe(portal.id);
              expect(pairPortal?.pairIndex).not.toBe(portal.pairIndex);
            }
          }
        }
      }
    });
  });
}); 