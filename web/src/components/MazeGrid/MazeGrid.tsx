'use client';

import React, { memo, useEffect, useState } from 'react';
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
  const [isDesktop, setIsDesktop] = useState(true);

  // Handle resize events to determine if we're on desktop or mobile
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Debug: Check if maze data contains portals
  useEffect(() => {
    if (mazeData && mazeData.length) {
      let portalCount = 0;
      for (let y = 0; y < mazeData.length; y++) {
        for (let x = 0; x < mazeData[0].length; x++) {
          if (mazeData[y][x].portal) {
            portalCount++;
          }
        }
      }
      console.log(`MazeGrid received ${portalCount} portals`);
    }
  }, [mazeData]);

  if (!mazeData || !mazeData.length) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🧩</div>
          <div className={styles.emptyStateText}>
            Generate a maze to begin your adventure
          </div>
          <div className={styles.emptyStateSubtext}>
            Use the controls to select size and portal options
          </div>
        </div>
      </div>
    );
  }

  const height = mazeData.length;
  const width = mazeData[0].length;
  
  // SVG viewBox dimensions
  const viewBoxWidth = width * cellSize;
  const viewBoxHeight = height * cellSize;
  
  // A4 proportion calculation (1:1.414 ratio - width:height)
  const a4Ratio = 1.414;
  
  // For screen display
  const maxWidth = isDesktop ? Math.min(900, viewBoxWidth * 1.5) : Math.min(500, viewBoxWidth);
  const maxHeight = maxWidth * a4Ratio;
  
  // Entry and exit points (top-left and bottom-right)
  const startX = 0;
  const startY = 0;
  const endX = width - 1;
  const endY = height - 1;
  
  return (
    <div className={styles.container} data-print-container="true">
      <div className={styles.mazeWrapper}>
        <svg 
          className={`${styles.mazeGrid} ${styles.a4Paper}`}
          viewBox={`-1 -1 ${viewBoxWidth + 2} ${viewBoxHeight + 2}`}
          preserveAspectRatio="xMidYMid meet"
          width="100%" 
          height="100%"
          style={{ 
            width: `${maxWidth}px`,
            height: `${maxHeight}px`,
            minWidth: isDesktop ? '700px' : '320px',
            minHeight: isDesktop ? '800px' : '450px',
          }}
          data-print-svg="true"
        >
          {/* Draw a subtle grid background */}
          <defs>
            <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
              <path 
                d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} 
                fill="none" 
                stroke="#f0f0f0" 
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Draw the maze grid */}
          {mazeData.map((row, y) => 
            row.map((cell, x) => (
              <g key={`${x}-${y}`} className={styles.cell}>
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
                
                {/* Draw portal indicators */}
                {cell.portal && (
                  <>
                    <circle 
                      className={styles.portal}
                      cx={x * cellSize + cellSize / 2} 
                      cy={y * cellSize + cellSize / 2} 
                      r={cellSize / 3} 
                      stroke="black"
                      strokeWidth="1.2"
                      fill="yellow"
                    />
                    <text 
                      x={x * cellSize + cellSize / 2} 
                      y={y * cellSize + cellSize / 2 + cellSize / 12} 
                      fontSize={cellSize / 2.5}
                      fontWeight="bold"
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      fill="black"
                      className={styles.portalText}
                    >
                      {cell.portal.id}
                    </text>
                  </>
                )}
              </g>
            ))
          )}
          
          {/* Start point (top-left) with label */}
          <g className={styles.startPointGroup}>
            <circle 
              className={styles.startPoint}
              cx={startX * cellSize + cellSize / 2} 
              cy={startY * cellSize + cellSize / 2} 
              r={cellSize / 3} 
            />
            <text
              x={startX * cellSize + cellSize / 2}
              y={startY * cellSize + cellSize / 2}
              fontSize={cellSize / 2.5}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              className={styles.startEndText}
            >
              S
            </text>
          </g>
          
          {/* End point (bottom-right) with label */}
          <g className={styles.endPointGroup}>
            <circle 
              className={styles.endPoint}
              cx={endX * cellSize + cellSize / 2} 
              cy={endY * cellSize + cellSize / 2} 
              r={cellSize / 3} 
            />
            <text
              x={endX * cellSize + cellSize / 2}
              y={endY * cellSize + cellSize / 2}
              fontSize={cellSize / 2.5}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              className={styles.startEndText}
            >
              E
            </text>
          </g>
        </svg>
        
        <div className={styles.mazeInfo}>
          <span className={styles.mazeSizeInfo}>
            {width}x{height} maze
          </span>
          {/* Only show on desktop */}
          {isDesktop && (
            <span className={styles.mazeInstructions}>
              <span className={styles.mazeInstructionIcon}>💡</span>
              Use portals to navigate between maze sections!
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

MazeGrid.displayName = 'MazeGrid';

export default MazeGrid; 