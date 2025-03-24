import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MazeCells from '@/components/MazeGrid/MazeCells';
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

describe('MazeCells Component', () => {
  it('renders the correct number of cells', () => {
    const width = 3;
    const height = 4;
    const mazeData = createTestMaze(width, height);
    
    const { container } = render(
      <svg>
        <MazeCells mazeData={mazeData} cellSize={10} theme="dungeon" />
      </svg>
    );
    
    const cells = container.querySelectorAll('g.cell');
    expect(cells.length).toBe(width * height);
  });
  
  it('renders the correct number of walls', () => {
    const width = 3;
    const height = 3;
    const mazeData = createTestMaze(width, height);
    
    const { container } = render(
      <svg>
        <MazeCells mazeData={mazeData} cellSize={10} theme="dungeon" />
      </svg>
    );
    
    // Count wall lines (each cell has up to 4 walls)
    // We removed 2 walls from our test maze
    const expectedWallCount = (width * height * 4) - 2;
    const wallElements = container.querySelectorAll('.wall');
    
    expect(wallElements.length).toBe(expectedWallCount);
  });
  
  it('renders portal icons for cells with portals', () => {
    const mazeData = createTestMaze(5, 5);
    
    const { container } = render(
      <svg>
        <MazeCells mazeData={mazeData} cellSize={10} theme="dungeon" />
      </svg>
    );
    
    // Find portal SVG elements
    const portalElements = container.querySelectorAll('.portalSvg');
    expect(portalElements.length).toBe(2);
  });
  
  it('renders no portals for a maze without portals', () => {
    // Create a maze without portals
    const maze: Cell[][] = [
      [{ walls: [true, true, true, true], visited: false }],
      [{ walls: [true, true, true, true], visited: false }]
    ];
    
    const { container } = render(
      <svg>
        <MazeCells mazeData={maze} cellSize={10} theme="dungeon" />
      </svg>
    );
    
    // Should be no portal SVG elements
    const portalElements = container.querySelectorAll('.portalSvg');
    expect(portalElements.length).toBe(0);
  });
  
  it('applies the correct positions to wall lines', () => {
    const cellSize = 20;
    const maze: Cell[][] = [
      [{ walls: [true, true, true, true], visited: false }]
    ];
    
    const { container } = render(
      <svg>
        <MazeCells mazeData={maze} cellSize={cellSize} theme="dungeon" />
      </svg>
    );
    
    const walls = container.querySelectorAll('.wall');
    
    // Check if the walls have correct positions
    // Top wall
    expect(walls[0]).toHaveAttribute('x1', '0');
    expect(walls[0]).toHaveAttribute('y1', '0');
    expect(walls[0]).toHaveAttribute('x2', `${cellSize}`);
    expect(walls[0]).toHaveAttribute('y2', '0');
    
    // Right wall
    expect(walls[1]).toHaveAttribute('x1', `${cellSize}`);
    expect(walls[1]).toHaveAttribute('y1', '0');
    expect(walls[1]).toHaveAttribute('x2', `${cellSize}`);
    expect(walls[1]).toHaveAttribute('y2', `${cellSize}`);
    
    // Bottom wall
    expect(walls[2]).toHaveAttribute('x1', '0');
    expect(walls[2]).toHaveAttribute('y1', `${cellSize}`);
    expect(walls[2]).toHaveAttribute('x2', `${cellSize}`);
    expect(walls[2]).toHaveAttribute('y2', `${cellSize}`);
    
    // Left wall
    expect(walls[3]).toHaveAttribute('x1', '0');
    expect(walls[3]).toHaveAttribute('y1', '0');
    expect(walls[3]).toHaveAttribute('x2', '0');
    expect(walls[3]).toHaveAttribute('y2', `${cellSize}`);
  });
}); 