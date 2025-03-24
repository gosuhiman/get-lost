import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeSelector } from '@/components/ControlPanel/components';
import { MazeTheme } from '@/app/page';

describe('ThemeSelector Component', () => {
  // Default mock props
  const defaultProps = {
    selectedTheme: 'dungeon' as MazeTheme,
    onThemeChange: jest.fn(),
    isGenerating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all theme options', () => {
    render(<ThemeSelector {...defaultProps} />);
    
    // Check for theme options
    expect(screen.getByText('Dungeon')).toBeInTheDocument();
    expect(screen.getByText('Space')).toBeInTheDocument();
  });

  it('highlights the selected theme option', () => {
    render(<ThemeSelector {...defaultProps} selectedTheme="space" />);
    
    // Check that the Space button has the active class
    const spaceButton = screen.getByText('Space').closest('button');
    expect(spaceButton).toHaveClass('themeButtonActive');
    
    // Check that other buttons don't have the active class
    const dungeonButton = screen.getByText('Dungeon').closest('button');
    expect(dungeonButton).not.toHaveClass('themeButtonActive');
  });

  it('calls onThemeChange when a theme button is clicked', () => {
    const mockOnThemeChange = jest.fn();
    render(
      <ThemeSelector 
        {...defaultProps} 
        onThemeChange={mockOnThemeChange}
      />
    );
    
    // Click the Space theme button
    fireEvent.click(screen.getByText('Space'));
    
    // Check if onThemeChange was called with 'space'
    expect(mockOnThemeChange).toHaveBeenCalledWith('space');
  });

  it('disables buttons when isGenerating is true', () => {
    render(<ThemeSelector {...defaultProps} isGenerating={true} />);
    
    // Check that all theme buttons are disabled
    const themeButtons = ['Dungeon', 'Space'].map(theme => 
      screen.getByText(theme).closest('button')
    );
    
    themeButtons.forEach(button => {
      if (button) {
        expect(button).toBeDisabled();
      }
    });
  });

  it('displays the correct help text for space theme', () => {
    render(<ThemeSelector {...defaultProps} selectedTheme="space" />);
    expect(screen.getByText('Space-themed maze with cosmic elements.')).toBeInTheDocument();
  });

  it('displays the correct help text for dungeon theme', () => {
    render(<ThemeSelector {...defaultProps} selectedTheme="dungeon" />);
    expect(screen.getByText('Dungeon-themed maze with medieval elements.')).toBeInTheDocument();
  });
}); 