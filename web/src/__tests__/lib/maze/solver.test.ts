import { findPath } from '@/lib/maze/solver';
import { Cell } from '@/lib/maze/types';

// Helper function to create a simple test maze with portals
function createTestMaze(): Cell[][] {
  // Create a 5x5 maze with all walls intact
  const maze: Cell[][] = Array(5).fill(null).map(() => 
    Array(5).fill(null).map(() => ({
      walls: [true, true, true, true],
      visited: false
    }))
  );
  
  // Open specific walls to create a path with portals
  // Row 0
  maze[0][0].walls[1] = false; // Right wall open
  maze[0][1].walls[3] = false; // Left wall open
  maze[0][1].walls[2] = false; // Bottom wall open
  
  // Row 1
  maze[1][1].walls[0] = false; // Top wall open
  maze[1][1].walls[1] = false; // Right wall open
  maze[1][2].walls[3] = false; // Left wall open
  
  // Add a portal pair
  maze[1][2].portal = { id: 1, pairIndex: 0 };
  maze[3][3].portal = { id: 1, pairIndex: 1 };
  
  // Row 3 (after portal teleport)
  maze[3][3].walls[2] = false; // Bottom wall open
  
  // Row 4 (final row)
  maze[4][3].walls[0] = false; // Top wall open
  maze[4][3].walls[1] = false; // Right wall open
  maze[4][4].walls[3] = false; // Left wall open
  
  return maze;
}

describe('Maze Solver', () => {
  describe('findPath', () => {
    it('should find a path in a simple maze without portals', () => {
      // Create a simple 3x3 maze with a direct path
      const simpleMaze: Cell[][] = Array(3).fill(null).map(() => 
        Array(3).fill(null).map(() => ({
          walls: [true, true, true, true],
          visited: false
        }))
      );
      
      // Create a direct path from (0,0) to (2,2)
      // Open the right wall of (0,0) and left wall of (0,1)
      simpleMaze[0][0].walls[1] = false;
      simpleMaze[0][1].walls[3] = false;
      
      // Open the right wall of (0,1) and left wall of (0,2)
      simpleMaze[0][1].walls[1] = false;
      simpleMaze[0][2].walls[3] = false;
      
      // Open the bottom wall of (0,2) and top wall of (1,2)
      simpleMaze[0][2].walls[2] = false;
      simpleMaze[1][2].walls[0] = false;
      
      // Open the bottom wall of (1,2) and top wall of (2,2)
      simpleMaze[1][2].walls[2] = false;
      simpleMaze[2][2].walls[0] = false;
      
      const path = findPath(simpleMaze, 0, 0, 2, 2);
      
      // We expect a path with 4 points: (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2)
      expect(path).toHaveLength(5);
      expect(path[0]).toEqual([0, 0]);
      expect(path[path.length - 1]).toEqual([2, 2]);
    });
    
    it('should return an empty array if no path exists', () => {
      // Create a 3x3 maze with no paths
      const noPathMaze: Cell[][] = Array(3).fill(null).map(() => 
        Array(3).fill(null).map(() => ({
          walls: [true, true, true, true],
          visited: false
        }))
      );
      
      const path = findPath(noPathMaze, 0, 0, 2, 2);
      
      // No path should exist
      expect(path).toHaveLength(0);
    });
    
    it('should navigate through portals correctly', () => {
      const mazeWithPortals = createTestMaze();
      
      // Find path from start (0,0) to end (4,4)
      const path = findPath(mazeWithPortals, 0, 0, 4, 4);
      
      // Verify path exists
      expect(path.length).toBeGreaterThan(0);
      
      // Verify start and end points
      expect(path[0]).toEqual([0, 0]);
      expect(path[path.length - 1]).toEqual([4, 4]);
      
      // Verify portal traversal
      // Find the portal positions in the path
      const portalEntryIdx = path.findIndex(([x, y]) => x === 2 && y === 1);
      const portalExitIdx = path.findIndex(([x, y]) => x === 3 && y === 3);
      
      expect(portalEntryIdx).not.toBe(-1);
      expect(portalExitIdx).not.toBe(-1);
      expect(portalExitIdx).toBe(portalEntryIdx + 1);
    });
    
    it('should find the shortest path when multiple paths exist', () => {
      // Create a simple 3x3 maze with two possible paths from (0,0) to (2,2)
      const multiPathMaze: Cell[][] = Array(3).fill(null).map(() => 
        Array(3).fill(null).map(() => ({
          walls: [true, true, true, true],
          visited: false
        }))
      );
      
      // Create a short path: (0,0) -> (1,0) -> (1,1) -> (2,1) -> (2,2)
      multiPathMaze[0][0].walls[1] = false; // (0,0) right wall open
      multiPathMaze[1][0].walls[3] = false; // (1,0) left wall open
      
      multiPathMaze[1][0].walls[2] = false; // (1,0) bottom wall open
      multiPathMaze[1][1].walls[0] = false; // (1,1) top wall open
      
      multiPathMaze[1][1].walls[1] = false; // (1,1) right wall open
      multiPathMaze[2][1].walls[3] = false; // (2,1) left wall open
      
      multiPathMaze[2][1].walls[2] = false; // (2,1) bottom wall open
      multiPathMaze[2][2].walls[0] = false; // (2,2) top wall open
      
      // Create a longer path: (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2)
      multiPathMaze[0][0].walls[2] = false; // (0,0) bottom wall open
      multiPathMaze[0][1].walls[0] = false; // (0,1) top wall open
      
      multiPathMaze[0][1].walls[2] = false; // (0,1) bottom wall open
      multiPathMaze[0][2].walls[0] = false; // (0,2) top wall open
      
      multiPathMaze[0][2].walls[1] = false; // (0,2) right wall open
      multiPathMaze[1][2].walls[3] = false; // (1,2) left wall open
      
      multiPathMaze[1][2].walls[1] = false; // (1,2) right wall open
      multiPathMaze[2][2].walls[3] = false; // (2,2) left wall open
      
      const path = findPath(multiPathMaze, 0, 0, 2, 2);
      
      // Since we're using BFS, we should find the shortest path
      // The expected path is 4 steps: [0,0] -> [1,0] -> [1,1] -> [2,2]
      expect(path).toEqual([[0, 0], [1, 0], [1, 1], [2, 2]]);
    });
  });
}); 