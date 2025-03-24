import { getThemeColors } from '@/lib/maze/themeUtils';

describe('Theme Utilities', () => {
  describe('getThemeColors', () => {
    it('returns dungeon theme colors by default', () => {
      const colors = getThemeColors();
      
      // Check some key colors from the dungeon theme
      expect(colors.background).toBe('#44403c');
      expect(colors.wall).toBe('#292524');
      expect(colors.start.fill).toBe('#a3e635');
      expect(colors.end.fill).toBe('#f87171');
    });
    
    it('returns space theme colors when specified', () => {
      const colors = getThemeColors('space');
      
      // Check some key colors from the space theme
      expect(colors.background).toBe('#0f172a');
      expect(colors.wall).toBe('#94a3b8');
      expect(colors.start.fill).toBe('#4ade80');
      expect(colors.end.fill).toBe('#fb7185');
    });
    
    it('returns dungeon theme when an invalid theme is provided', () => {
      // @ts-expect-error - Testing with invalid theme
      const colors = getThemeColors('invalid');
      
      // Should fall back to dungeon theme
      expect(colors.background).toBe('#44403c');
    });
    
    it('includes all necessary portal colors', () => {
      const colors = getThemeColors();
      
      // Check that we have all 5 portal color sets
      expect(colors.portal1).toBeDefined();
      expect(colors.portal2).toBeDefined();
      expect(colors.portal3).toBeDefined();
      expect(colors.portal4).toBeDefined();
      expect(colors.portal5).toBeDefined();
      
      // Each portal should have fill and stroke colors
      expect(colors.portal1.fill).toBeDefined();
      expect(colors.portal1.stroke).toBeDefined();
    });
    
    it('has different colors between themes', () => {
      const dungeonColors = getThemeColors('dungeon');
      const spaceColors = getThemeColors('space');
      
      // Colors should be different
      expect(dungeonColors.background).not.toBe(spaceColors.background);
      expect(dungeonColors.wall).not.toBe(spaceColors.wall);
      expect(dungeonColors.portal1.fill).not.toBe(spaceColors.portal1.fill);
    });
  });
}); 