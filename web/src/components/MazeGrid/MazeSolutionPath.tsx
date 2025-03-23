import React from 'react';
import { Cell } from '@/lib/maze/types';
import { MazeTheme } from '@/app/page';
import { hasPortal, getPortalPair } from '@/lib/maze/portals';
import styles from './styles.module.css';

interface MazeSolutionPathProps {
  solutionPath: [number, number][];
  mazeData: Cell[][];
  cellSize: number;
  theme: MazeTheme;
}

const MazeSolutionPath: React.FC<MazeSolutionPathProps> = ({
  solutionPath,
  mazeData,
  cellSize,
  theme
}) => {
  if (solutionPath.length <= 1) return null;
  
  return (
    <g className={styles.solutionPath}>
      {/* Draw path segments with appropriate colors */}
      {solutionPath.map((point, index) => {
        // Skip the last point as it won't have a "next" point to draw a line to
        if (index === solutionPath.length - 1) return null;
        
        const [x, y] = point;
        const [nextX, nextY] = solutionPath[index + 1];
        
        // Check if this segment involves teleportation (portal)
        const isTeleport = hasPortal(mazeData, x, y) && 
          (() => {
            const portalPair = getPortalPair(mazeData, x, y);
            return portalPair && portalPair[0] === nextX && portalPair[1] === nextY;
          })();
        
        const startX = x * cellSize + cellSize / 2;
        const startY = y * cellSize + cellSize / 2;
        const endX = nextX * cellSize + cellSize / 2;
        const endY = nextY * cellSize + cellSize / 2;
        
        return (
          <line
            key={`path-segment-${index}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={isTeleport 
              ? (theme === 'dungeon' ? '#e879f9' : '#8b5cf6') // Purple for teleport
              : (theme === 'dungeon' ? '#fbbf24' : '#60a5fa') // Regular path color
            }
            strokeWidth={cellSize * 0.25}
            strokeLinecap="round"
            strokeDasharray={isTeleport ? '0' : cellSize * 0.5}
            strokeOpacity={isTeleport ? 1 : 0.8}
          />
        );
      })}
      
      {/* Add dots at each waypoint */}
      {solutionPath.map((point, index) => {
        // Skip first and last points (start and end points)
        if (index === 0 || index === solutionPath.length - 1) return null;
        
        const [x, y] = point;
        const pathX = x * cellSize + cellSize / 2;
        const pathY = y * cellSize + cellSize / 2;
        
        // Check if this point is on a portal
        const isPortal = hasPortal(mazeData, x, y);
        
        return (
          <circle
            key={`solution-point-${index}`}
            cx={pathX}
            cy={pathY}
            r={cellSize * 0.15}
            fill={isPortal 
              ? (theme === 'dungeon' ? '#e879f9' : '#8b5cf6') // Purple for portal points
              : (theme === 'dungeon' ? '#fbbf24' : '#60a5fa') // Regular path color
            }
            strokeWidth="0"
          />
        );
      })}
    </g>
  );
};

export default MazeSolutionPath; 