import React from 'react';
import { MazeTheme } from '@/app/page';
import styles from '../styles.module.css';

interface ThemeSelectorProps {
  selectedTheme: MazeTheme;
  onThemeChange: (theme: MazeTheme) => void;
  isGenerating: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange,
  isGenerating,
}) => {
  const themeOptions: { value: MazeTheme; label: string; icon: string }[] = [
    { value: 'dungeon', label: 'Dungeon', icon: '🏰' },
    { value: 'space', label: 'Space', icon: '🚀' }
  ];
  
  return (
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
  );
};

export default ThemeSelector; 