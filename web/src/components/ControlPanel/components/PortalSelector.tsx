import React from 'react';
import styles from '../styles.module.css';

interface PortalSelectorProps {
  portalPairs: number;
  onPortalPairsChange: (pairs: number) => void;
  isGenerating: boolean;
}

const PortalSelector: React.FC<PortalSelectorProps> = ({
  portalPairs,
  onPortalPairsChange,
  isGenerating,
}) => {
  const portalOptions = [0, 1, 2, 3];
  
  return (
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
  );
};

export default PortalSelector; 