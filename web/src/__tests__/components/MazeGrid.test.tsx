import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MazeGrid from '@/components/MazeGrid/MazeGrid';
import { Cell } from '@/lib/maze/types';

// Helper to create a simple test maze
function createTestMaze(width: number, height: number): Cell[][] {
  // Create a maze with all walls intact
  const maze: Cell[][] = Array(height).fill(null).map(() => 
    Array(width).fill(null).map(() => ({
      walls: [true, true, true, true],
      visited: false
    }))
  );
  
  // Create a simple path from top-left to bottom-right
  // Start by removing some walls
  if (width > 1 && height > 1) {
    // Remove right wall of (0,0)
    maze[0][0].walls[1] = false;
    
    // Remove left wall of (0,1)
    maze[0][1].walls[3] = false;
    
    // Add a portal pair
    maze[0][1].portal = { id: 1, pairIndex: 0 };
    maze[height-1][width-2].portal = { id: 1, pairIndex: 1 };
  }
  
  return maze;
}

describe('MazeGrid Component', () => {
  it('renders empty state when no maze data is provided', () => {
    render(<MazeGrid mazeData={[]} />);
    
    const emptyStateText = screen.getByText(/Maze loading or no maze data available/i);
    expect(emptyStateText).toBeInTheDocument();
  });
  
  it('renders the SVG when maze data is provided', () => {
    const mazeData = createTestMaze(5, 5);
    
    const { container } = render(<MazeGrid mazeData={mazeData} />);
    
    // Check if SVG element is rendered
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
  
  it('renders the correct number of wall lines', () => {
    const width = 3;
    const height = 3;
    const mazeData = createTestMaze(width, height);
    
    const { container } = render(<MazeGrid mazeData={mazeData} />);
    
    // Count wall lines (each cell has up to 4 walls)
    // We removed 2 walls from our test maze
    const expectedWallCount = (width * height * 4) - 2;
    const wallElements = container.querySelectorAll('line');
    
    expect(wallElements.length).toBe(expectedWallCount);
  });
  
  it('renders start and end points', () => {
    const mazeData = createTestMaze(5, 5);
    
    const { container } = render(<MazeGrid mazeData={mazeData} />);
    
    // There should be start and end circles
    const circleElements = container.querySelectorAll('circle');
    // 2 circles for start/end plus 2 for portals
    expect(circleElements.length).toBe(4);
  });
  
  it('renders portal indicators correctly', () => {
    const mazeData = createTestMaze(5, 5);
    
    const { container } = render(<MazeGrid mazeData={mazeData} />);
    
    // Find portal text elements
    const portalTextElements = container.querySelectorAll('text');
    expect(portalTextElements.length).toBe(2);
    
    // Both portal texts should show the same ID
    expect(portalTextElements[0].textContent).toBe('1');
    expect(portalTextElements[1].textContent).toBe('1');
  });
  
  it('applies the correct viewBox based on maze dimensions', () => {
    const width = 10;
    const height = 8;
    const cellSize = 10;
    const mazeData = createTestMaze(width, height);
    
    const { container } = render(<MazeGrid mazeData={mazeData} cellSize={cellSize} />);
    
    const svgElement = container.querySelector('svg');
    const viewBox = svgElement?.getAttribute('viewBox');
    
    // viewBox should be set to cover the entire maze with 1px padding on each side
    const expectedViewBox = `-1 -1 ${width * cellSize + 2} ${height * cellSize + 2}`;
    expect(viewBox).toBe(expectedViewBox);
  });
  
  it('has proper print-related data attributes', () => {
    const mazeData = createTestMaze(5, 5);
    
    const { container } = render(<MazeGrid mazeData={mazeData} />);
    
    // Check container has print attribute
    const containerElement = container.querySelector('[data-print-container="true"]');
    expect(containerElement).toBeInTheDocument();
    
    // Check SVG has print attribute
    const svgElement = container.querySelector('[data-print-svg="true"]');
    expect(svgElement).toBeInTheDocument();
  });
}); 