import React from 'react';
import styles from '../styles.module.css';

interface ActionButtonsProps {
  onGenerate: () => void;
  onPrint: () => void;
  isGenerating: boolean;
  hasMaze: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onGenerate,
  onPrint,
  isGenerating,
  hasMaze,
}) => {
  return (
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
  );
};

export default ActionButtons; 