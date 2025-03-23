import React from 'react';
import { Cell } from '@/lib/maze/types';
import { MazeTheme } from '@/app/page';
import { renderPortalIcon } from './MazeSvgIcons';
import { getThemeColors } from '@/lib/maze/themeUtils';
import styles from './styles.module.css';

interface MazeCellsProps {
  mazeData: Cell[][];
  cellSize: number;
  theme: MazeTheme;
}

const MazeCells: React.FC<MazeCellsProps> = ({
  mazeData,
  cellSize,
  theme
}) => {
  const colors = getThemeColors(theme);
  
  return (
    <>
      {mazeData.map((row, y) => (
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
                stroke={colors.wall}
              />
            )}
            {cell.walls[1] && (
              <line 
                className={styles.wall}
                x1={(x + 1) * cellSize} 
                y1={y * cellSize} 
                x2={(x + 1) * cellSize} 
                y2={(y + 1) * cellSize} 
                stroke={colors.wall}
              />
            )}
            {cell.walls[2] && (
              <line 
                className={styles.wall}
                x1={x * cellSize} 
                y1={(y + 1) * cellSize} 
                x2={(x + 1) * cellSize} 
                y2={(y + 1) * cellSize} 
                stroke={colors.wall}
              />
            )}
            {cell.walls[3] && (
              <line 
                className={styles.wall}
                x1={x * cellSize} 
                y1={y * cellSize} 
                x2={x * cellSize} 
                y2={(y + 1) * cellSize} 
                stroke={colors.wall}
              />
            )}
            
            {/* Draw portal icons */}
            {cell.portal && renderPortalIcon(cell, x, y, cellSize, theme)}
          </g>
        ))
      ))}
    </>
  );
};

export default MazeCells; 