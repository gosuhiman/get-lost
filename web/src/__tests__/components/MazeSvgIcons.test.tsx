import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { portalSvgIcons, renderPortalIcon, startPointSvg, endPointSvg } from '@/components/MazeGrid/MazeSvgIcons';
import { Cell } from '@/lib/maze/types';

describe('MazeSvgIcons', () => {
  // Test portal icons
  describe('portalSvgIcons', () => {
    it('renders all portal icon types correctly', () => {
      portalSvgIcons.forEach((iconRenderer, index) => {
        const { container } = render(iconRenderer(10, 5, 5, 'dungeon'));
        const svgGroup = container.querySelector('g.portalSvg');
        expect(svgGroup).toBeInTheDocument();
        
        // Make sure each icon has the expected SVG element inside
        if (index === 0) {
          // Spiral design - should have a path
          expect(svgGroup?.querySelector('path')).toBeInTheDocument();
        } else if (index === 1) {
          // Star design - should have a path
          expect(svgGroup?.querySelector('path')).toBeInTheDocument();
        } else if (index === 2) {
          // Hexagon design - should have a path
          expect(svgGroup?.querySelector('path')).toBeInTheDocument();
        } else if (index === 3) {
          // Diamond design - should have a rect
          expect(svgGroup?.querySelector('rect')).toBeInTheDocument();
        } else if (index === 4) {
          // Concentric circles - should have 2 circle elements
          expect(svgGroup?.querySelectorAll('circle').length).toBe(2);
        }
      });
    });
  });

  // Test renderPortalIcon function
  describe('renderPortalIcon', () => {
    it('returns null when cell has no portal', () => {
      const cell: Cell = {
        walls: [true, true, true, true],
        visited: false
      };
      
      const result = renderPortalIcon(cell, 0, 0, 10, 'dungeon');
      expect(result).toBeNull();
    });
    
    it('renders correct portal icon when cell has a portal', () => {
      const cell: Cell = {
        walls: [true, true, true, true],
        visited: false,
        portal: { id: 1, pairIndex: 0 }
      };
      
      const { container } = render(<>{renderPortalIcon(cell, 0, 0, 10, 'dungeon')}</>);
      const portalSvg = container.querySelector('g.portalSvg');
      expect(portalSvg).toBeInTheDocument();
    });
    
    it('handles different portal IDs correctly', () => {
      // Test with different portal IDs
      for (let id = 1; id <= 5; id++) {
        const cell: Cell = {
          walls: [true, true, true, true],
          visited: false,
          portal: { id: id, pairIndex: 0 }
        };
        
        const { container } = render(<>{renderPortalIcon(cell, 0, 0, 10, 'dungeon')}</>);
        const portalSvg = container.querySelector('g.portalSvg');
        expect(portalSvg).toBeInTheDocument();
      }
    });
  });

  // Test startPointSvg function
  describe('startPointSvg', () => {
    it('renders start point correctly', () => {
      const { container } = render(<>{startPointSvg(5, 5, 10, 'dungeon')}</>);
      
      const startGroup = container.querySelector('g.startPointGroup');
      expect(startGroup).toBeInTheDocument();
      
      const path = startGroup?.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('fill');
    });
    
    it('applies theme colors correctly', () => {
      const { container: dungeonContainer } = render(<>{startPointSvg(5, 5, 10, 'dungeon')}</>);
      const { container: spaceContainer } = render(<>{startPointSvg(5, 5, 10, 'space')}</>);
      
      const dungeonPath = dungeonContainer.querySelector('path');
      const spacePath = spaceContainer.querySelector('path');
      
      expect(dungeonPath?.getAttribute('fill')).not.toBe(spacePath?.getAttribute('fill'));
    });
  });

  // Test endPointSvg function
  describe('endPointSvg', () => {
    it('renders end point correctly', () => {
      const { container } = render(<>{endPointSvg(5, 5, 10, 'dungeon')}</>);
      
      const endGroup = container.querySelector('g.endPointGroup');
      expect(endGroup).toBeInTheDocument();
      
      const paths = endGroup?.querySelectorAll('path');
      expect(paths?.length).toBe(2);
    });
    
    it('applies theme colors correctly', () => {
      const { container: dungeonContainer } = render(<>{endPointSvg(5, 5, 10, 'dungeon')}</>);
      const { container: spaceContainer } = render(<>{endPointSvg(5, 5, 10, 'space')}</>);
      
      const dungeonPath = dungeonContainer.querySelector('path');
      const spacePath = spaceContainer.querySelector('path');
      
      expect(dungeonPath?.getAttribute('fill')).not.toBe(spacePath?.getAttribute('fill'));
    });
  });
}); 