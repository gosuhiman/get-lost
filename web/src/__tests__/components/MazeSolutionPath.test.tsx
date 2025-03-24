import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MazeSolutionPath from '@/components/MazeGrid/MazeSolutionPath';
import { Cell } from '@/lib/maze/types';

// Mock the portal utilities
jest.mock('@/lib/maze/portals', () => ({
  hasPortal: jest.fn().mockImplementation((mazeData, x, y) => {
    // Return true for our test portal coordinates
    return (x === 1 && y === 1) || (x === 3 && y === 3);
  }),
  getPortalPair: jest.fn().mockImplementation((mazeData, x, y) => {
    // Return portal pair coordinates
    if (x === 1 && y === 1) return [3, 3];
    if (x === 3 && y === 3) return [1, 1];
    return null;
  })
}));

describe('MazeSolutionPath Component', () => {
  // Simple test maze
  const testMaze: Cell[][] = Array(5).fill(null).map(() =>
    Array(5).fill(null).map(() => ({
      walls: [true, true, true, true],
      visited: false
    }))
  );
  
  // Add portals to the test maze
  testMaze[1][1].portal = { id: 1, pairIndex: 0 };
  testMaze[3][3].portal = { id: 1, pairIndex: 1 };
  
  it('returns null when solution path is empty or has only one point', () => {
    // Empty path
    const { container: emptyContainer } = render(
      <svg>
        <MazeSolutionPath 
          solutionPath={[]}
          mazeData={testMaze}
          cellSize={10}
          theme="dungeon"
        />
      </svg>
    );
    expect(emptyContainer.querySelector('.solutionPath')).toBeNull();
    
    // Single point path
    const { container: singleContainer } = render(
      <svg>
        <MazeSolutionPath 
          solutionPath={[[0, 0]]}
          mazeData={testMaze}
          cellSize={10}
          theme="dungeon"
        />
      </svg>
    );
    expect(singleContainer.querySelector('.solutionPath')).toBeNull();
  });
  
  it('renders the correct number of line segments for a simple path', () => {
    const path: [number, number][] = [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0]
    ];
    
    const { container } = render(
      <svg>
        <MazeSolutionPath 
          solutionPath={path}
          mazeData={testMaze}
          cellSize={10}
          theme="dungeon"
        />
      </svg>
    );
    
    // Should have 4 line segments (one less than number of points)
    const lines = container.querySelectorAll('line');
    expect(lines.length).toBe(path.length - 1);
  });
  
  it('renders the correct number of waypoint circles', () => {
    const path: [number, number][] = [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0]
    ];
    
    const { container } = render(
      <svg>
        <MazeSolutionPath 
          solutionPath={path}
          mazeData={testMaze}
          cellSize={10}
          theme="dungeon"
        />
      </svg>
    );
    
    // Should have 3 circles (number of points - 2, as start and end don't get circles)
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(path.length - 2);
  });
  
  it('renders teleport and normal line segments differently', () => {
    // Create a path with a teleport
    const path: [number, number][] = [
      [0, 0], [1, 1], // Normal segment
      [3, 3], [4, 4]  // Teleport from [1,1] to [3,3], then normal segment
    ];
    
    const { container } = render(
      <svg>
        <MazeSolutionPath 
          solutionPath={path}
          mazeData={testMaze}
          cellSize={10}
          theme="dungeon"
        />
      </svg>
    );
    
    const lines = container.querySelectorAll('line');
    expect(lines.length).toBe(3); // Should have 3 line segments
    
    // Check that all lines are rendered 
    expect(lines[0]).toBeInTheDocument();
    expect(lines[1]).toBeInTheDocument();
    expect(lines[2]).toBeInTheDocument();
    
    // Check line colors based on whether they're teleport or normal segments
    // Normal segments should have different stroke colors than teleport segments
    const firstSegmentStroke = lines[0].getAttribute('stroke');
    const teleportSegmentStroke = lines[1].getAttribute('stroke');
    
    // Teleport segment should have a different color
    expect(firstSegmentStroke).not.toBe(teleportSegmentStroke);
    
    // Second and third segments should match the expected pattern
    const thirdSegmentStroke = lines[2].getAttribute('stroke');
    expect(firstSegmentStroke).toBe(thirdSegmentStroke); // Both normal segments
  });
  
  it('renders portal waypoints differently', () => {
    // Create a path with portals
    const path: [number, number][] = [
      [0, 0], [1, 1], [3, 3], [4, 4]
    ];
    
    const { container } = render(
      <svg>
        <MazeSolutionPath 
          solutionPath={path}
          mazeData={testMaze}
          cellSize={10}
          theme="dungeon"
        />
      </svg>
    );
    
    const circles = container.querySelectorAll('circle');
    
    // First circle (at portal [1,1]) should have the portal fill color
    expect(circles[0]).toHaveAttribute('fill', '#e879f9');
    
    // Second circle (at portal [3,3]) should have the portal fill color
    expect(circles[1]).toHaveAttribute('fill', '#e879f9');
  });
  
  it('changes colors based on theme', () => {
    const path: [number, number][] = [
      [0, 0], [1, 0], [2, 0]
    ];
    
    // Render with dungeon theme
    const { container: dungeonContainer } = render(
      <svg>
        <MazeSolutionPath 
          solutionPath={path}
          mazeData={testMaze}
          cellSize={10}
          theme="dungeon"
        />
      </svg>
    );
    
    // Render with space theme
    const { container: spaceContainer } = render(
      <svg>
        <MazeSolutionPath 
          solutionPath={path}
          mazeData={testMaze}
          cellSize={10}
          theme="space"
        />
      </svg>
    );
    
    const dungeonLine = dungeonContainer.querySelector('line');
    const spaceLine = spaceContainer.querySelector('line');
    
    // Colors should be different between themes
    expect(dungeonLine?.getAttribute('stroke')).not.toBe(
      spaceLine?.getAttribute('stroke')
    );
  });
}); 