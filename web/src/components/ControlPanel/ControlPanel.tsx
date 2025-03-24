'use client';

import React from 'react';
import { MazeSize } from '@/lib/maze/types';
import styles from './styles.module.css';
import { MazeTheme } from '@/app/page';
import {
  SizeSelector,
  PortalSelector,
  ThemeSelector,
  ActionButtons,
  KeyboardShortcuts,
} from './components';

interface ControlPanelProps {
  selectedSize: MazeSize;
  portalPairs: number;
  selectedTheme: MazeTheme;
  onSizeChange: (size: MazeSize) => void;
  onPortalPairsChange: (pairs: number) => void;
  onThemeChange: (theme: MazeTheme) => void;
  onGenerate: () => void;
  onPrint: () => void;
  isGenerating: boolean;
  hasMaze: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedSize,
  portalPairs,
  selectedTheme,
  onSizeChange,
  onPortalPairsChange,
  onThemeChange,
  onGenerate,
  onPrint,
  isGenerating,
  hasMaze,
}) => {
  return (
    <div className={styles.controlPanel}>
      <SizeSelector
        selectedSize={selectedSize}
        onSizeChange={onSizeChange}
        isGenerating={isGenerating}
      />
      
      <PortalSelector
        portalPairs={portalPairs}
        onPortalPairsChange={onPortalPairsChange}
        isGenerating={isGenerating}
      />
      
      <ThemeSelector
        selectedTheme={selectedTheme}
        onThemeChange={onThemeChange}
        isGenerating={isGenerating}
      />
      
      <ActionButtons
        onGenerate={onGenerate}
        onPrint={onPrint}
        isGenerating={isGenerating}
        hasMaze={hasMaze}
      />
      
      <KeyboardShortcuts />
    </div>
  );
};

export default ControlPanel; 