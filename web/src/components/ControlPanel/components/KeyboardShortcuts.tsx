import React from 'react';
import styles from '../styles.module.css';

const KeyboardShortcuts: React.FC = () => {
  return (
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
  );
};

export default KeyboardShortcuts; 