'use client';

import React from 'react';
import { MazeSize, SIZE_CONFIGS } from '@/lib/maze/types';
import styles from './styles.module.css';
import { MazeTheme } from '@/app/page';

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
  const sizeOptions: MazeSize[] = ['S', 'M', 'L', 'XL'];
  const portalOptions = [0, 1, 2, 3];
  const themeOptions: { value: MazeTheme; label: string; icon: string }[] = [
    { value: 'dungeon', label: 'Dungeon', icon: '🏰' },
    { value: 'space', label: 'Space', icon: '🚀' }
  ];
  
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
      
      <div className={styles.controlSection}>
        <label className={styles.controlLabel}>Theme</label>
        <div className={styles.themeSelector}>
          {themeOptions.map((theme) => (
            <button
              key={theme.value}
              className={`${styles.themeButton} ${selectedTheme === theme.value ? styles.themeButtonActive : ''}`}
              onClick={() => onThemeChange(theme.value)}
              disabled={isGenerating}
              title={`${theme.label} theme`}
            >
              {theme.icon}
              <span className={styles.themeLabel}>{theme.label}</span>
            </button>
          ))}
        </div>
        <p className={styles.helpText}>
          {selectedTheme === 'space' ? 
            "Space-themed maze with cosmic elements." : 
            "Dungeon-themed maze with medieval elements."
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
            <kbd className={styles.key}>T</kbd>
            <span className={styles.shortcutDesc}>Change theme</span>
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