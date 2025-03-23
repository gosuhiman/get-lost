'use client';

import React, { memo } from 'react';
import { Cell } from '@/lib/maze/types';
import styles from './styles.module.css';

interface MazeGridProps {
  mazeData: Cell[][];
  cellSize?: number;
}

const MazeGrid: React.FC<MazeGridProps> = memo(({ 
  mazeData, 
  cellSize = 10 
}) => {
  if (!mazeData || !mazeData.length) {
    return (
      <div className={styles.container}>
        <div style={{ 
          width: '300px', 
          height: '200px', 
          border: '1px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px',
          textAlign: 'center',
          padding: '20px'
        }}>
          Maze loading or no maze data available.
          <br />
          Try clicking the Generate button.
        </div>
      </div>
    );
  }

  const height = mazeData.length;
  const width = mazeData[0].length;
  
  // SVG viewBox dimensions
  const viewBoxWidth = width * cellSize;
  const viewBoxHeight = height * cellSize;
  
  // Entry and exit points (top-left and bottom-right)
  const startX = 0;
  const startY = 0;
  const endX = width - 1;
  const endY = height - 1;
  
  return (
    <div className={styles.container}>
      <svg 
        className={styles.mazeGrid}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%" 
        height="100%"
        style={{ 
          border: '1px solid #ddd',
          width: `${Math.min(1200, viewBoxWidth * 1.5)}px`,
          height: `${Math.min(1000, viewBoxHeight * 1.5)}px`,
          minWidth: '500px',
          minHeight: '500px'
        }}
      >
        {/* Draw the maze grid */}
        {mazeData.map((row, y) => 
          row.map((cell, x) => (
            <g key={`${x}-${y}`}>
              {/* Draw walls */}
              {cell.walls[0] && (
                <line 
                  className={styles.wall}
                  x1={x * cellSize} 
                  y1={y * cellSize} 
                  x2={(x + 1) * cellSize} 
                  y2={y * cellSize} 
                />
              )}
              {cell.walls[1] && (
                <line 
                  className={styles.wall}
                  x1={(x + 1) * cellSize} 
                  y1={y * cellSize} 
                  x2={(x + 1) * cellSize} 
                  y2={(y + 1) * cellSize} 
                />
              )}
              {cell.walls[2] && (
                <line 
                  className={styles.wall}
                  x1={x * cellSize} 
                  y1={(y + 1) * cellSize} 
                  x2={(x + 1) * cellSize} 
                  y2={(y + 1) * cellSize} 
                />
              )}
              {cell.walls[3] && (
                <line 
                  className={styles.wall}
                  x1={x * cellSize} 
                  y1={y * cellSize} 
                  x2={x * cellSize} 
                  y2={(y + 1) * cellSize} 
                />
              )}
            </g>
          ))
        )}
        
        {/* Start point (top-left) */}
        <circle 
          className={styles.startPoint}
          cx={startX * cellSize + cellSize / 2} 
          cy={startY * cellSize + cellSize / 2} 
          r={cellSize / 4} 
        />
        
        {/* End point (bottom-right) */}
        <circle 
          className={styles.endPoint}
          cx={endX * cellSize + cellSize / 2} 
          cy={endY * cellSize + cellSize / 2} 
          r={cellSize / 4} 
        />
      </svg>
    </div>
  );
});

MazeGrid.displayName = 'MazeGrid';

export default MazeGrid; 