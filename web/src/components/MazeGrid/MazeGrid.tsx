'use client';

import React, { memo, useEffect, useState } from 'react';
import { Cell } from '@/lib/maze/types';
import styles from './styles.module.css';
import { MazeTheme } from '@/app/page';
import { findPath } from '@/lib/maze/solver';
import { getThemeColors } from '@/lib/maze/themeUtils';
import { startPointSvg, endPointSvg } from './MazeSvgIcons';
import MazeCells from './MazeCells';
import MazeSolutionPath from './MazeSolutionPath';

interface MazeGridProps {
  mazeData: Cell[][];
  cellSize?: number;
  theme?: MazeTheme;
}

const MazeGrid: React.FC<MazeGridProps> = memo(({ 
  mazeData, 
  cellSize = 10,
  theme = 'dungeon'
}) => {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionPath, setSolutionPath] = useState<[number, number][]>([]);
  const colors = getThemeColors(theme);

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
  
  // Listen for print events
  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
    };
    
    const afterPrint = () => {
      setIsPrinting(false);
    };
    
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    
    // For browsers that don't support beforeprint/afterprint
    if (window.matchMedia) {
      const mediaQueryList = window.matchMedia('print');
      const handlePrintChange = (mql: MediaQueryListEvent) => {
        setIsPrinting(mql.matches);
      };
      
      mediaQueryList.addEventListener('change', handlePrintChange);
      
      return () => {
        window.removeEventListener('beforeprint', beforePrint);
        window.removeEventListener('afterprint', afterPrint);
        mediaQueryList.removeEventListener('change', handlePrintChange);
      };
    }
    
    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
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

  // Reset solution when maze data changes
  useEffect(() => {
    // When a new maze is generated, hide and clear the solution
    setShowSolution(false);
    setSolutionPath([]);
  }, [mazeData]);

  // Handle solution button click
  const handleSolveMaze = () => {
    if (!mazeData || !mazeData.length) return;
    
    // If solution is already shown, just toggle visibility
    if (showSolution) {
      setShowSolution(false);
      return;
    }
    
    // Calculate the solution path
    const height = mazeData.length;
    const width = mazeData[0].length;
    const path = findPath(mazeData, 0, 0, width - 1, height - 1);
    
    // Store and show the solution
    setSolutionPath(path);
    setShowSolution(true);
  };

  if (!mazeData || !mazeData.length) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🏰</div>
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
  
  // For screen display - updated to allow larger size on desktop
  const maxWidth = isDesktop ? Math.min(1600, viewBoxWidth * 2.5) : Math.min(500, viewBoxWidth);
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
          className={`${styles.mazeGrid} ${styles.a4Paper} ${styles[`theme-${theme}`]}`}
          viewBox={`-1 -1 ${viewBoxWidth + 2} ${viewBoxHeight + 2}`}
          preserveAspectRatio="xMidYMid meet"
          width="100%" 
          height="100%"
          style={{ 
            width: `${maxWidth}px`,
            height: `${maxHeight}px`,
            minWidth: isDesktop ? '900px' : '320px',
            minHeight: isDesktop ? '900px' : '450px',
            backgroundColor: colors.background,
          }}
          data-print-svg="true"
        >
          {/* Draw a subtle grid background - only visible when not printing */}
          {!isPrinting && (
            <>
              <defs>
                <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
                  <path 
                    d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} 
                    fill="none" 
                    stroke={colors.grid} 
                    strokeWidth="0.5"
                    className={styles.gridPattern}
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" className={styles.gridBackground} />
            </>
          )}
          
          {/* Draw the solution path if it's visible */}
          {showSolution && solutionPath.length > 1 && (
            <MazeSolutionPath 
              solutionPath={solutionPath}
              mazeData={mazeData}
              cellSize={cellSize}
              theme={theme}
            />
          )}
          
          {/* Draw the maze cells and walls */}
          <MazeCells 
            mazeData={mazeData}
            cellSize={cellSize}
            theme={theme}
          />
          
          {/* Start point (top-left) with custom SVG */}
          {startPointSvg(
            startX * cellSize + cellSize / 2,
            startY * cellSize + cellSize / 2,
            cellSize,
            theme
          )}
          
          {/* End point (bottom-right) with custom SVG */}
          {endPointSvg(
            endX * cellSize + cellSize / 2,
            endY * cellSize + cellSize / 2,
            cellSize,
            theme
          )}
        </svg>
        
        <div className={styles.mazeInfo}>
          <span className={styles.mazeSizeInfo}>
            {width}x{height} maze
          </span>
        </div>
        
        {/* Solve button - positioned outside mazeInfo for better visibility */}
        {!isPrinting && mazeData.length > 0 && (
          <button 
            className={styles.solveButton}
            onClick={handleSolveMaze}
            aria-label="Solve Maze"
            type="button"
          >
            <span className={styles.solveButtonIcon}>
              {showSolution ? '🔍' : '💡'}
            </span>
            {showSolution ? 'Hide Solution' : 'Solve Maze'}
          </button>
        )}
      </div>
    </div>
  );
});

MazeGrid.displayName = 'MazeGrid';

export default MazeGrid; 