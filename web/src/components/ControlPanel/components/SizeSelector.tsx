import React from 'react';
import { MazeSize, SIZE_CONFIGS } from '@/lib/maze/types';
import styles from '../styles.module.css';

interface SizeSelectorProps {
  selectedSize: MazeSize;
  onSizeChange: (size: MazeSize) => void;
  isGenerating: boolean;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  selectedSize,
  onSizeChange,
  isGenerating,
}) => {
  const sizeOptions: MazeSize[] = ['S', 'M', 'L', 'XL'];
  
  return (
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
  );
};

export default SizeSelector; 