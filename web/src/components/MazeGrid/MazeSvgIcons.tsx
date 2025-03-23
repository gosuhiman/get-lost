import React from 'react';
import { Cell } from '@/lib/maze/types';
import { MazeTheme } from '@/app/page';
import { getThemeColors } from '@/lib/maze/themeUtils';
import styles from './styles.module.css';

// SVG definitions for portal icons (5 unique designs)
export const portalSvgIcons = [
  // Portal 1 - Spiral design
  (size: number, cx: number, cy: number, theme: MazeTheme) => {
    const colors = getThemeColors(theme);
    return (
      <g className={styles.portalSvg}>
        <path 
          d={`M ${cx} ${cy} 
             m ${-size * 0.35} 0 
             a ${size * 0.35} ${size * 0.35} 0 1 1 ${size * 0.7} 0 
             a ${size * 0.35} ${size * 0.35} 0 1 1 ${-size * 0.7} 0`} 
          fill="none" 
          stroke={colors.portal1.stroke} 
          strokeWidth={size * 0.15} 
        />
      </g>
    );
  },
  // Portal 2 - Star design
  (size: number, cx: number, cy: number, theme: MazeTheme) => {
    const colors = getThemeColors(theme);
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
        <path d={pathData} fill={colors.portal2.fill} stroke={colors.portal2.stroke} strokeWidth="1.5" />
      </g>
    );
  },
  // Portal 3 - Hexagon design
  (size: number, cx: number, cy: number, theme: MazeTheme) => {
    const colors = getThemeColors(theme);
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
        <path d={pathData} fill={colors.portal3.fill} stroke={colors.portal3.stroke} strokeWidth="1.5" />
      </g>
    );
  },
  // Portal 4 - Diamond design
  (size: number, cx: number, cy: number, theme: MazeTheme) => {
    const colors = getThemeColors(theme);
    return (
      <g className={styles.portalSvg}>
        <rect 
          x={cx - size * 0.35} 
          y={cy - size * 0.35}
          width={size * 0.7}
          height={size * 0.7}
          fill={colors.portal4.fill}
          stroke={colors.portal4.stroke}
          strokeWidth="1.5"
          transform={`rotate(45 ${cx} ${cy})`}
        />
      </g>
    );
  },
  // Portal 5 - Concentric circles design
  (size: number, cx: number, cy: number, theme: MazeTheme) => {
    const colors = getThemeColors(theme);
    return (
      <g className={styles.portalSvg}>
        <circle cx={cx} cy={cy} r={size * 0.35} fill={colors.portal5.fill} stroke={colors.portal5.stroke} strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={size * 0.20} fill="none" stroke="white" strokeWidth="1.5" />
      </g>
    );
  }
];

// Function to render the appropriate portal icon based on ID
export const renderPortalIcon = (cell: Cell, x: number, y: number, cellSize: number, theme: MazeTheme) => {
  if (!cell.portal) return null;
  
  // Get the portal ID and use it to determine which icon to use (modulo the number of available icons)
  const portalId = cell.portal.id;
  const iconIndex = (portalId - 1) % portalSvgIcons.length;
  
  // Calculate the center position
  const cx = x * cellSize + cellSize / 2;
  const cy = y * cellSize + cellSize / 2;
  
  // Render the SVG icon
  return portalSvgIcons[iconIndex](cellSize, cx, cy, theme);
};

// SVG definitions for start point
export const startPointSvg = (cx: number, cy: number, size: number, theme: MazeTheme = 'dungeon') => {
  const colors = getThemeColors(theme);
  return (
    <g className={styles.startPointGroup}>
      <path 
        d={`M ${cx - size * 0.35} ${cy}
           L ${cx + size * 0.35} ${cy - size * 0.35}
           L ${cx + size * 0.35} ${cy + size * 0.35}
           Z`} 
        fill={colors.start.fill}
        stroke={colors.start.stroke}
        strokeWidth="1.5"
      />
    </g>
  );
};

// SVG definition for end point
export const endPointSvg = (cx: number, cy: number, size: number, theme: MazeTheme = 'dungeon') => {
  const colors = getThemeColors(theme);
  return (
    <g className={styles.endPointGroup}>
      <path
        d={`M ${cx - size * 0.35} ${cy - size * 0.35}
           L ${cx + size * 0.35} ${cy - size * 0.35}
           L ${cx + size * 0.35} ${cy + size * 0.35}
           L ${cx - size * 0.35} ${cy + size * 0.35}
           Z`}
        fill={colors.end.fill}
        stroke={colors.end.stroke}
        strokeWidth="1.5"
      />
      <path
        d={`M ${cx - size * 0.15} ${cy - size * 0.15}
           L ${cx + size * 0.15} ${cy - size * 0.15}
           L ${cx + size * 0.15} ${cy + size * 0.15}
           L ${cx - size * 0.15} ${cy + size * 0.15}
           Z`}
        fill="white"
        stroke={colors.end.stroke}
        strokeWidth="1"
      />
    </g>
  );
}; 