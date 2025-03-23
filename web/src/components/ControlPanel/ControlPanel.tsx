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
      <div className={styles.controlSection}>
        <label className={styles.controlLabel}>Maze Size</label>
        <div className={styles.sizeSelector}>
          {sizeOptions.map((size) => (
            <button
              key={size}
              className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeButtonActive : ''}`}
              onClick={() => onSizeChange(size)}
              disabled={isGenerating}
              title={`${size} - ${SIZE_CONFIGS[size].width}x${SIZE_CONFIGS[size].height}`}
            >
              <span className={styles.sizeLabel}>{size}</span>
              <span className={styles.sizeDimension}>({SIZE_CONFIGS[size].width}x{SIZE_CONFIGS[size].height})</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.controlSection}>
        <label className={styles.controlLabel}>Portal Pairs</label>
        <div className={styles.portalSelector}>
          {portalOptions.map((pairs) => (
            <button
              key={pairs}
              className={`${styles.portalButton} ${portalPairs === pairs ? styles.portalButtonActive : ''}`}
              onClick={() => onPortalPairsChange(pairs)}
              disabled={isGenerating}
              title={`${pairs} portal pair${pairs !== 1 ? 's' : ''}`}
            >
              {pairs}
            </button>
          ))}
        </div>
        <p className={styles.helpText}>
          {portalPairs === 0 ? 
            "No portals - traditional maze." : 
            `${portalPairs} portal pair${portalPairs !== 1 ? 's' : ''} will connect different maze sections.`
          }
        </p>
      </div>
      
      <div className={styles.actionsSection}>
        <button
          className={styles.actionButton}
          onClick={onGenerate}
          disabled={isGenerating}
          title="Generate a new maze with current settings"
        >
          <span className={styles.actionIcon}>🔄</span>
          <span>{isGenerating ? 'Generating...' : 'Generate Maze'}</span>
        </button>
        
        <button
          className={`${styles.actionButton} ${styles.printButton}`}
          onClick={onPrint}
          disabled={!hasMaze || isGenerating}
          title="Print the current maze"
        >
          <span className={styles.actionIcon}>🖨️</span>
          <span>Print Maze</span>
        </button>
      </div>
      
      <div className={styles.keyboardSection}>
        <h3 className={styles.keyboardTitle}>Keyboard Shortcuts</h3>
        <div className={styles.shortcutList}>
          <div className={styles.shortcut}>
            <kbd className={styles.key}>G</kbd>
            <span className={styles.shortcutDesc}>Generate maze</span>
          </div>
          <div className={styles.shortcut}>
            <kbd className={styles.key}>P</kbd>
            <span className={styles.shortcutDesc}>Print maze</span>
          </div>
          <div className={styles.shortcut}>
            <kbd className={styles.key}>1-4</kbd>
            <span className={styles.shortcutDesc}>Set maze size</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel; 