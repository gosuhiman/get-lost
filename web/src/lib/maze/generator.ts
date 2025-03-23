import { Cell } from './types';

// Direction indices: [North, East, South, West]
const dx = [0, 1, 0, -1];
const dy = [-1, 0, 1, 0];

// Returns the opposite direction index (N<->S, E<->W)
const oppositeDirection = (dir: number): number => (dir + 2) % 4;

// Initialize a maze grid with walls on all sides
export const initializeGrid = (width: number, height: number): Cell[][] => {
  const grid: Cell[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        walls: [true, true, true, true], // All walls present initially
        visited: false,
      });
    }
    grid.push(row);
  }
  
  return grid;
};

// Shuffle array in place
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Generate maze using DFS algorithm with backtracking
export const generateMaze = (width: number, height: number): Cell[][] => {
  const grid = initializeGrid(width, height);
  const stack: [number, number][] = [];
  
  // Start at a random cell
  const startX = Math.floor(Math.random() * width);
  const startY = Math.floor(Math.random() * height);
  
  grid[startY][startX].visited = true;
  stack.push([startX, startY]);
  
  let iterations = 0;
  while (stack.length > 0) {
    iterations++;
    if (iterations > 100000) {
      break; // Safety check to prevent infinite loops
    }
    
    const [currentX, currentY] = stack[stack.length - 1];
    
    // Find unvisited neighbors
    const neighbors: [number, number, number][] = []; // [x, y, direction]
    
    for (let dir = 0; dir < 4; dir++) {
      const newX = currentX + dx[dir];
      const newY = currentY + dy[dir];
      
      if (
        newX >= 0 && newX < width && 
        newY >= 0 && newY < height && 
        !grid[newY][newX].visited
      ) {
        neighbors.push([newX, newY, dir]);
      }
    }
    
    if (neighbors.length > 0) {
      // Randomly choose a neighbor
      const [nextX, nextY, direction] = shuffleArray(neighbors)[0];
      
      // Remove wall between current cell and chosen neighbor
      grid[currentY][currentX].walls[direction] = false;
      grid[nextY][nextX].walls[oppositeDirection(direction)] = false;
      
      // Mark the neighbor as visited and add to stack
      grid[nextY][nextX].visited = true;
      stack.push([nextX, nextY]);
    } else {
      // Backtrack
      stack.pop();
    }
  }
  
  // Reset visited flags for rendering
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      grid[y][x].visited = false;
    }
  }
  
  return grid;
}; 