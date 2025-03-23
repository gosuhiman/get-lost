'use client';

import React from 'react';
import { MazeSize, SIZE_CONFIGS } from '@/lib/maze/types';
import styles from './styles.module.css';

interface ControlPanelProps {
  selectedSize: MazeSize;
  portalPairs: number;
  onSizeChange: (size: MazeSize) => void;
  onPortalPairsChange: (pairs: number) => void;
  onGenerate: () => void;
  onPrint: () => void;
  isGenerating: boolean;
  hasMaze: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedSize,
  portalPairs,
  onSizeChange,
  onPortalPairsChange,
  onGenerate,
  onPrint,
  isGenerating,
  hasMaze,
}) => {
  const sizeOptions: MazeSize[] = ['S', 'M', 'L', 'XL'];
  const portalOptions = [0, 1, 2, 3, 4];
  
  return (
    <div className={styles.controlPanel}>
      <div className={styles.controlRow}>
        <label className={styles.controlLabel}>Maze Size:</label>
        <div className={styles.sizeSelector}>
          {sizeOptions.map((size) => (
            <button
              key={size}
              className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeButtonActive : ''}`}
              onClick={() => onSizeChange(size)}
              disabled={isGenerating}
            >
              {size} ({SIZE_CONFIGS[size].width}x{SIZE_CONFIGS[size].height})
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.controlRow}>
        <label className={styles.controlLabel}>Portal Pairs:</label>
        <div className={styles.sizeSelector}>
          {portalOptions.map((pairs) => (
            <button
              key={pairs}
              className={`${styles.sizeButton} ${portalPairs === pairs ? styles.sizeButtonActive : ''}`}
              onClick={() => onPortalPairsChange(pairs)}
              disabled={isGenerating}
            >
              {pairs}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.controlRow}>
        <button
          className={styles.actionButton}
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Maze'}
        </button>
        
        <button
          className={`${styles.actionButton} ${styles.printButton}`}
          onClick={onPrint}
          disabled={!hasMaze || isGenerating}
        >
          Print Maze
        </button>
      </div>
    </div>
  );
};

export default ControlPanel; 