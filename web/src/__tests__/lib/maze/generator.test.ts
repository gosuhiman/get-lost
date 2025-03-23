import { generateMaze, initializeGrid } from '@/lib/maze/generator';

describe('Maze Generator', () => {
  describe('initializeGrid', () => {
    it('should create a grid with the specified dimensions', () => {
      const width = 5;
      const height = 7;
      const grid = initializeGrid(width, height);
      
      expect(grid.length).toBe(height);
      expect(grid[0].length).toBe(width);
    });
    
    it('should initialize all cells with all walls intact', () => {
      const grid = initializeGrid(3, 3);
      
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          expect(grid[y][x].walls).toEqual([true, true, true, true]);
          expect(grid[y][x].visited).toBe(false);
        }
      }
    });
  });

  describe('generateMaze', () => {
    it('should create a connected path through the maze', () => {
      const width = 10;
      const height = 10;
      const maze = generateMaze(width, height);
      
      // Test a complete path exists by checking if all cells are reachable from the start
      // We'll use a simple flood fill algorithm to verify
      const visited = Array(height).fill(false).map(() => Array(width).fill(false));
      
      // Start at 0,0 and flood fill
      const stack: [number, number][] = [[0, 0]];
      visited[0][0] = true;
      
      const dx = [0, 1, 0, -1]; // East, South, West, North
      const dy = [-1, 0, 1, 0];
      
      while (stack.length > 0) {
        const [x, y] = stack.pop()!;
        
        // Check all four directions
        for (let dir = 0; dir < 4; dir++) {
          // If there's no wall in this direction
          if (!maze[y][x].walls[dir]) {
            const nx = x + dx[dir];
            const ny = y + dy[dir];
            
            // If within bounds and not visited
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx]) {
              visited[ny][nx] = true;
              stack.push([nx, ny]);
            }
          }
        }
      }
      
      // All cells should have been visited
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          expect(visited[y][x]).toBe(true);
        }
      }
    });
    
    it('should have no isolated cells', () => {
      const width = 8;
      const height = 8;
      const maze = generateMaze(width, height);
      
      // Every cell should have at least one open wall
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const hasOpenWall = maze[y][x].walls.some(wall => !wall);
          expect(hasOpenWall).toBe(true);
        }
      }
    });
    
    it('should have consistent walls between adjacent cells', () => {
      const width = 5;
      const height = 5;
      const maze = generateMaze(width, height);
      
      // Directions: [N, E, S, W]
      const dx = [0, 1, 0, -1];
      const dy = [-1, 0, 1, 0];
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          for (let dir = 0; dir < 4; dir++) {
            const nx = x + dx[dir];
            const ny = y + dy[dir];
            
            // Skip cells on the boundary
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
            
            // The opposite direction
            const oppositeDir = (dir + 2) % 4;
            
            // The walls should be consistent (if one is open, the other should be too)
            expect(maze[y][x].walls[dir]).toBe(maze[ny][nx].walls[oppositeDir]);
          }
        }
      }
    });
  });
}); 