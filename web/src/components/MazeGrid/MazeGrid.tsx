'use client';

import React, { memo, useEffect, useState } from 'react';
import { Cell } from '@/lib/maze/types';
import styles from './styles.module.css';

interface MazeGridProps {
  mazeData: Cell[][];
  cellSize?: number;
}

// SVG definitions for portal icons (5 unique designs)
const portalSvgIcons = [
  // Portal 1 - Spiral design
  (size: number, cx: number, cy: number, id: number) => (
    <g className={styles.portalSvg}>
      <path 
        d={`M ${cx} ${cy} 
           m ${-size * 0.35} 0 
           a ${size * 0.35} ${size * 0.35} 0 1 1 ${size * 0.7} 0 
           a ${size * 0.35} ${size * 0.35} 0 1 1 ${-size * 0.7} 0`} 
        fill="none" 
        stroke="#6366f1" 
        strokeWidth={size * 0.15} 
      />
    </g>
  ),
  // Portal 2 - Star design
  (size: number, cx: number, cy: number, id: number) => {
    const points = 5;
    const outerRadius = size * 0.4;
    const innerRadius = size * 0.2;
    let pathData = "";
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 ? innerRadius : outerRadius;
      const angle = (Math.PI / points) * i;
      const x = cx + radius * Math.sin(angle);
      const y = cy - radius * Math.cos(angle);
      
      if (i === 0) pathData += `M ${x} ${y} `;
      else pathData += `L ${x} ${y} `;
    }
    pathData += "Z";
    
    return (
      <g className={styles.portalSvg}>
        <path d={pathData} fill="#f59e0b" stroke="#c2410c" strokeWidth="1.5" />
      </g>
    );
  },
  // Portal 3 - Hexagon design
  (size: number, cx: number, cy: number, id: number) => {
    const points = 6;
    const radius = size * 0.35;
    let pathData = "";
    
    for (let i = 0; i < points; i++) {
      const angle = (Math.PI * 2 / points) * i;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      
      if (i === 0) pathData += `M ${x} ${y} `;
      else pathData += `L ${x} ${y} `;
    }
    pathData += "Z";
    
    return (
      <g className={styles.portalSvg}>
        <path d={pathData} fill="#10b981" stroke="#047857" strokeWidth="1.5" />
      </g>
    );
  },
  // Portal 4 - Diamond design
  (size: number, cx: number, cy: number, id: number) => (
    <g className={styles.portalSvg}>
      <rect 
        x={cx - size * 0.35} 
        y={cy - size * 0.35}
        width={size * 0.7}
        height={size * 0.7}
        fill="#ec4899"
        stroke="#be185d"
        strokeWidth="1.5"
        transform={`rotate(45 ${cx} ${cy})`}
      />
    </g>
  ),
  // Portal 5 - Concentric circles design
  (size: number, cx: number, cy: number, id: number) => (
    <g className={styles.portalSvg}>
      <circle cx={cx} cy={cy} r={size * 0.35} fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={size * 0.20} fill="none" stroke="white" strokeWidth="1.5" />
    </g>
  )
];

// SVG definitions for start and end points
const startPointSvg = (cx: number, cy: number, size: number) => (
  <g className={styles.startPointGroup}>
    <path 
      d={`M ${cx - size * 0.35} ${cy}
         L ${cx + size * 0.35} ${cy - size * 0.35}
         L ${cx + size * 0.35} ${cy + size * 0.35}
         Z`} 
      className={styles.startPoint}
    />
  </g>
);

const endPointSvg = (cx: number, cy: number, size: number) => (
  <g className={styles.endPointGroup}>
    <path
      d={`M ${cx - size * 0.35} ${cy - size * 0.35}
         L ${cx + size * 0.35} ${cy - size * 0.35}
         L ${cx + size * 0.35} ${cy + size * 0.35}
         L ${cx - size * 0.35} ${cy + size * 0.35}
         Z`}
      className={styles.endPoint}
    />
    <path
      d={`M ${cx - size * 0.15} ${cy - size * 0.15}
         L ${cx + size * 0.15} ${cy - size * 0.15}
         L ${cx + size * 0.15} ${cy + size * 0.15}
         L ${cx - size * 0.15} ${cy + size * 0.15}
         Z`}
      fill="white"
      stroke="#8e0000"
      strokeWidth="1"
    />
  </g>
);

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
  
  // Function to render the appropriate portal icon based on ID
  const renderPortalIcon = (cell: Cell, x: number, y: number) => {
    if (!cell.portal) return null;
    
    // Get the portal ID and use it to determine which icon to use (modulo the number of available icons)
    const portalId = cell.portal.id;
    const iconIndex = (portalId - 1) % portalSvgIcons.length;
    
    // Calculate the center position
    const cx = x * cellSize + cellSize / 2;
    const cy = y * cellSize + cellSize / 2;
    
    // Render the SVG icon
    return portalSvgIcons[iconIndex](cellSize, cx, cy, portalId);
  };
  
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
                
                {/* Draw portal icons */}
                {cell.portal && renderPortalIcon(cell, x, y)}
              </g>
            ))
          )}
          
          {/* Start point (top-left) with custom SVG */}
          {startPointSvg(
            startX * cellSize + cellSize / 2,
            startY * cellSize + cellSize / 2,
            cellSize
          )}
          
          {/* End point (bottom-right) with custom SVG */}
          {endPointSvg(
            endX * cellSize + cellSize / 2,
            endY * cellSize + cellSize / 2,
            cellSize
          )}
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