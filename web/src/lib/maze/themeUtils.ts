import { MazeTheme } from '@/app/page';

// Theme colors for various elements
export const getThemeColors = (theme: MazeTheme = 'dungeon') => {
  switch(theme) {
    case 'space':
      return {
        background: '#0f172a',
        grid: '#334155',
        wall: '#94a3b8',
        start: {
          fill: '#4ade80',
          stroke: '#16a34a'
        },
        end: {
          fill: '#fb7185',
          stroke: '#e11d48'
        },
        portal1: {
          fill: '#c4b5fd',
          stroke: '#8b5cf6'
        },
        portal2: {
          fill: '#fcd34d',
          stroke: '#f59e0b'
        },
        portal3: {
          fill: '#5eead4',
          stroke: '#14b8a6'
        },
        portal4: {
          fill: '#f9a8d4',
          stroke: '#ec4899'
        },
        portal5: {
          fill: '#93c5fd',
          stroke: '#3b82f6'
        }
      };
    default: // dungeon
      return {
        background: '#44403c',
        grid: '#78716c',
        wall: '#292524',
        start: {
          fill: '#a3e635',
          stroke: '#65a30d'
        },
        end: {
          fill: '#f87171',
          stroke: '#b91c1c'
        },
        portal1: {
          fill: '#a78bfa',
          stroke: '#7c3aed'
        },
        portal2: {
          fill: '#facc15',
          stroke: '#ca8a04'
        },
        portal3: {
          fill: '#2dd4bf',
          stroke: '#0d9488'
        },
        portal4: {
          fill: '#f472b6',
          stroke: '#db2777'
        },
        portal5: {
          fill: '#60a5fa',
          stroke: '#2563eb'
        }
      };
  }
}; 