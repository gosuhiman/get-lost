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
export function generateMaze(size: number | { width: number; height: number }): Cell[][] {
  // Parse the size parameter
  let width: number;
  let height: number;
  
  if (typeof size === 'number') {
    width = size;
    height = size;
  } else {
    width = size.width;
    height = size.height;
  }
  
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
}

/**
 * Check if a cell is a dead-end (has 3 walls)
 * @param maze - The maze to check
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Whether the cell is a dead-end
 */
function isDeadEnd(maze: Cell[][], x: number, y: number): boolean {
  return maze[y][x].walls.filter(wall => wall).length === 3;
}

/**
 * Generate a maze with isolated sections for portal placement
 * 
 * @param size - Size of the maze (width and height or MazeSize object)
 * @param numSections - Number of isolated sections (default: 2)
 * @returns Object containing the maze and dead ends for each section
 */
export function generateSectionedMaze(
  size: number | { width: number; height: number },
  numSections: number = 2
): { 
  maze: Cell[][];
  deadEnds: [number, number][][];
} {
  // Parse the size parameter
  let width: number;
  let height: number;
  
  if (typeof size === 'number') {
    width = size;
    height = size;
  } else {
    width = size.width;
    height = size.height;
  }
  
  // Calculate maximum reasonable number of sections based on maze size
  // Each section should be at least 3x3 for a meaningful maze
  const maxHorizontalSections = Math.floor(width / 3);
  const maxVerticalSections = Math.floor(height / 3);
  const maxSections = Math.max(2, Math.min(maxHorizontalSections, maxVerticalSections));
  
  // Limit sections to a reasonable number based on maze size
  const sections = Math.min(Math.max(2, numSections), maxSections);
  
  console.log(`Creating maze with ${sections} sections (limited from requested ${numSections})`);
  
  const maze = initializeGrid(width, height);
  
  // Decide how to split the maze based on its dimensions
  const isHorizontalSplit = height >= width;
  
  const sectionBoundaries: number[] = [];
  
  if (isHorizontalSplit) {
    // Split horizontally (into rows)
    const rowsPerSection = Math.max(3, Math.floor(height / sections));
    
    // Calculate section boundaries (row indices where sections begin)
    for (let i = 0; i <= sections; i++) {
      sectionBoundaries.push(Math.min(i * rowsPerSection, height));
    }
    
    // Ensure the last boundary is at the end of the maze
    sectionBoundaries[sections] = height;
    
    // Generate each section
    for (let s = 0; s < sections; s++) {
      const startY = sectionBoundaries[s];
      const endY = sectionBoundaries[s + 1] - 1;
      
      // Generate maze for this section
      generateSectionMaze(maze, 0, width - 1, startY, endY, s);
    }
  } else {
    // Split vertically (into columns)
    const colsPerSection = Math.max(3, Math.floor(width / sections));
    
    // Calculate section boundaries (column indices where sections begin)
    for (let i = 0; i <= sections; i++) {
      sectionBoundaries.push(Math.min(i * colsPerSection, width));
    }
    
    // Ensure the last boundary is at the end of the maze
    sectionBoundaries[sections] = width;
    
    // Generate each section
    for (let s = 0; s < sections; s++) {
      const startX = sectionBoundaries[s];
      const endX = sectionBoundaries[s + 1] - 1;
      
      // Generate maze for this section
      generateSectionMaze(maze, startX, endX, 0, height - 1, s);
    }
  }
  
  // Reset visited flags
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      maze[y][x].visited = false;
    }
  }
  
  // Special handling for entrance and exit
  // Make sure entrance is in section 0 and exit is in the last section
  maze[0][0].sectionId = 0;
  maze[height - 1][width - 1].sectionId = sections - 1;
  
  // Ensure entrance and exit are not completely closed in
  // Open one wall at the entrance (top or left)
  const entranceWall = Math.random() < 0.5 ? 0 : 3; // North or West
  maze[0][0].walls[entranceWall] = false;
  
  // Open one wall at the exit (bottom or right)
  const exitWall = Math.random() < 0.5 ? 1 : 2; // East or South
  maze[height - 1][width - 1].walls[exitWall] = false;
  
  // Find dead ends in each section
  const deadEnds = findSectionDeadEnds(maze, sections);
  
  return { maze, deadEnds };
}

/**
 * Generate a maze within a specific section using DFS
 */
function generateSectionMaze(
  maze: Cell[][], 
  startX: number, endX: number, 
  startY: number, endY: number, 
  sectionId: number
): void {
  const stack: [number, number][] = [];
  
  // Ensure valid section bounds
  startX = Math.max(0, startX);
  endX = Math.min(maze[0].length - 1, endX);
  startY = Math.max(0, startY);
  endY = Math.min(maze.length - 1, endY);
  
  // Check if section has valid size
  if (startX > endX || startY > endY) {
    console.warn(`Invalid section bounds: (${startX},${startY}) to (${endX},${endY})`);
    return;
  }
  
  // Calculate width and height of section
  const sectionWidth = endX - startX + 1;
  const sectionHeight = endY - startY + 1;
  
  // Ensure valid section size for maze generation
  if (sectionWidth <= 0 || sectionHeight <= 0) {
    console.warn(`Section ${sectionId} has invalid dimensions: ${sectionWidth}x${sectionHeight}`);
    return;
  }
  
  // Start at a random cell within the section
  const x = startX + Math.floor(Math.random() * sectionWidth);
  const y = startY + Math.floor(Math.random() * sectionHeight);
  
  // Double check that x and y are valid
  if (x < startX || x > endX || y < startY || y > endY || 
      x < 0 || x >= maze[0].length || y < 0 || y >= maze.length) {
    console.error(`Invalid starting point (${x},${y}) for section ${sectionId}`);
    return;
  }
  
  maze[y][x].visited = true;
  maze[y][x].sectionId = sectionId;
  stack.push([x, y]);
  
  while (stack.length > 0) {
    const [currentX, currentY] = stack[stack.length - 1];
    
    // Find unvisited neighbors within the section
    const neighbors: [number, number, number][] = [];
    
    for (let dir = 0; dir < 4; dir++) {
      const newX = currentX + dx[dir];
      const newY = currentY + dy[dir];
      
      // Ensure the neighbor is within the section bounds and the overall maze bounds
      if (
        newX >= startX && newX <= endX && 
        newY >= startY && newY <= endY &&
        newX >= 0 && newX < maze[0].length &&
        newY >= 0 && newY < maze.length &&
        !maze[newY][newX].visited
      ) {
        neighbors.push([newX, newY, dir]);
      }
    }
    
    if (neighbors.length > 0) {
      // Choose a random neighbor
      const [nextX, nextY, direction] = shuffleArray(neighbors)[0];
      
      // Double check indices are valid before accessing
      if (
        currentY >= 0 && currentY < maze.length && 
        currentX >= 0 && currentX < maze[0].length &&
        nextY >= 0 && nextY < maze.length && 
        nextX >= 0 && nextX < maze[0].length
      ) {
        // Remove the wall between cells
        maze[currentY][currentX].walls[direction] = false;
        maze[nextY][nextX].walls[oppositeDirection(direction)] = false;
        
        // Mark the new cell as visited and assign it to the current section
        maze[nextY][nextX].visited = true;
        maze[nextY][nextX].sectionId = sectionId;
        stack.push([nextX, nextY]);
      }
    } else {
      // Backtrack
      stack.pop();
    }
  }
}

/**
 * Find dead ends in each section of the maze
 * @param maze - The sectioned maze
 * @param numSections - Number of sections
 * @returns Array of dead end coordinates for each section
 */
export function findSectionDeadEnds(maze: Cell[][], numSections: number): [number, number][][] {
  const height = maze.length;
  const width = maze[0].length;
  
  // Initialize array to hold dead ends for each section
  const sectionDeadEnds: [number, number][][] = Array(numSections)
    .fill(null)
    .map(() => []);
  
  // Find dead ends in each section
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = maze[y][x];
      
      // Skip entrance and exit
      if ((x === 0 && y === 0) || (x === width - 1 && y === height - 1)) {
        continue;
      }
      
      if (cell.sectionId !== undefined && isDeadEnd(maze, x, y)) {
        sectionDeadEnds[cell.sectionId].push([x, y]);
      }
    }
  }
  
  // Ensure each section has at least one dead end (if possible)
  for (let s = 0; s < numSections; s++) {
    if (sectionDeadEnds[s].length === 0) {
      // If no dead ends, try to create one
      createDeadEndInSection(maze, s);
      
      // Re-scan for dead ends in this section
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const cell = maze[y][x];
          if (cell.sectionId === s && isDeadEnd(maze, x, y)) {
            sectionDeadEnds[s].push([x, y]);
          }
        }
      }
    }
  }
  
  return sectionDeadEnds;
}

/**
 * Create a dead end in a section if there isn't one already
 */
function createDeadEndInSection(maze: Cell[][], sectionId: number): void {
  const height = maze.length;
  const width = maze[0].length;
  
  // Find all cells in the section
  const sectionCells: [number, number][] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (maze[y][x].sectionId === sectionId) {
        sectionCells.push([x, y]);
      }
    }
  }
  
  if (sectionCells.length === 0) return;
  
  // Shuffle cells to try different ones
  shuffleArray(sectionCells);
  
  // Try to create a dead end by adding walls
  for (const [x, y] of sectionCells) {
    // Skip entrance and exit
    if ((x === 0 && y === 0) || (x === width - 1 && y === height - 1)) {
      continue;
    }
    
    // Count existing open passages
    const openDirs = [];
    for (let dir = 0; dir < 4; dir++) {
      if (!maze[y][x].walls[dir]) {
        openDirs.push(dir);
      }
    }
    
    // If there are at least 2 open directions, we can close all but one
    if (openDirs.length >= 2) {
      // Keep one direction open
      const keepOpen = openDirs[Math.floor(Math.random() * openDirs.length)];
      
      // Close all other directions
      for (const dir of openDirs) {
        if (dir !== keepOpen) {
          maze[y][x].walls[dir] = true;
          
          // Also close the corresponding wall in the adjacent cell
          const nx = x + dx[dir];
          const ny = y + dy[dir];
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            maze[ny][nx].walls[oppositeDirection(dir)] = true;
          }
        }
      }
      
      // Successfully created a dead end
      return;
    }
  }
} 