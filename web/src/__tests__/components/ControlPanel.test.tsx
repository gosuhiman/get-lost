import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ControlPanel from '@/components/ControlPanel/ControlPanel';
import { MazeSize } from '@/lib/maze/types';

describe('ControlPanel Component', () => {
  // Default mock props
  const defaultProps = {
    selectedSize: 'M' as MazeSize,
    portalPairs: 2,
    selectedTheme: 'dungeon' as const,
    onSizeChange: jest.fn(),
    onPortalPairsChange: jest.fn(),
    onThemeChange: jest.fn(),
    onGenerate: jest.fn(),
    onPrint: jest.fn(),
    isGenerating: false,
    hasMaze: true,
  };

  it('renders all size options', () => {
    render(<ControlPanel {...defaultProps} />);
    
    // Check for all size buttons using the new span structure
    const sizeOptions = ['S', 'M', 'L', 'XL'];
    sizeOptions.forEach(size => {
      expect(screen.getByText(size)).toBeInTheDocument();
    });
  });

  it('renders all portal pair options', () => {
    render(<ControlPanel {...defaultProps} />);
    
    // Check for all portal pair options (0-3)
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('highlights the selected size option', () => {
    render(<ControlPanel {...defaultProps} selectedSize="L" />);
    
    // Find the span with text 'L', then get its parent button
    const lButton = screen.getByText('L').closest('button');
    expect(lButton).toHaveClass('sizeButtonActive');
    
    // Check that other buttons don't have the active class
    const mButton = screen.getByText('M').closest('button');
    expect(mButton).not.toHaveClass('sizeButtonActive');
  });

  it('highlights the selected portal pairs option', () => {
    render(<ControlPanel {...defaultProps} portalPairs={3} />);
    
    // Check that the '3' button has the active class - now it's portalButtonActive
    const button3 = screen.getByText('3').closest('button');
    expect(button3).toHaveClass('portalButtonActive');
    
    // Check that other buttons don't have the active class
    const button2 = screen.getByText('2').closest('button');
    expect(button2).not.toHaveClass('portalButtonActive');
  });

  it('calls onSizeChange when a size button is clicked', () => {
    const mockOnSizeChange = jest.fn();
    render(
      <ControlPanel 
        {...defaultProps} 
        onSizeChange={mockOnSizeChange}
      />
    );
    
    // Click the 'L' size button
    fireEvent.click(screen.getByText('L'));
    
    // Check if onSizeChange was called with 'L'
    expect(mockOnSizeChange).toHaveBeenCalledWith('L');
  });

  it('calls onPortalPairsChange when a portal pair button is clicked', () => {
    const mockOnPortalPairsChange = jest.fn();
    render(
      <ControlPanel 
        {...defaultProps} 
        onPortalPairsChange={mockOnPortalPairsChange}
      />
    );
    
    // Click the '3' portal pairs button
    fireEvent.click(screen.getByText('3'));
    
    // Check if onPortalPairsChange was called with 3
    expect(mockOnPortalPairsChange).toHaveBeenCalledWith(3);
  });

  it('calls onGenerate when the Generate button is clicked', () => {
    const mockOnGenerate = jest.fn();
    const { container } = render(
      <ControlPanel 
        {...defaultProps} 
        onGenerate={mockOnGenerate}
      />
    );
    
    // Find the Generate button using container query and class
    const generateButton = container.querySelector('.actionsSection button:first-child');
    if (generateButton) {
      fireEvent.click(generateButton);
    }
    
    // Check if onGenerate was called
    expect(mockOnGenerate).toHaveBeenCalled();
  });

  it('calls onPrint when the Print button is clicked', () => {
    const mockOnPrint = jest.fn();
    const { container } = render(
      <ControlPanel 
        {...defaultProps} 
        onPrint={mockOnPrint}
      />
    );
    
    // Find the Print button using container query and class
    const printButton = container.querySelector('.printButton');
    if (printButton) {
      fireEvent.click(printButton);
    }
    
    // Check if onPrint was called
    expect(mockOnPrint).toHaveBeenCalled();
  });

  it('disables buttons when isGenerating is true', () => {
    render(<ControlPanel {...defaultProps} isGenerating={true} />);
    
    // Check that all size buttons are disabled
    const sizeButtons = ['S', 'M', 'L', 'XL'].map(size => 
      screen.getByText(size).closest('button')
    );
    
    sizeButtons.forEach(button => {
      if (button) {
        expect(button).toBeDisabled();
      }
    });
    
    // Check that all portal pair buttons are disabled
    const portalButtons = ['0', '1', '2', '3'].map(num => 
      screen.getByText(num).closest('button')
    );
    
    portalButtons.forEach(button => {
      if (button) {
        expect(button).toBeDisabled();
      }
    });
    
    // Check that generate button shows loading state by finding the span within the first action button
    const { container } = render(<ControlPanel {...defaultProps} isGenerating={true} />);
    const loadingText = container.querySelector('.actionsSection button:first-child span:last-child');
    expect(loadingText?.textContent).toBe('Generating...');
  });

  it('disables Print button when hasMaze is false', () => {
    const { container } = render(<ControlPanel {...defaultProps} hasMaze={false} />);
    
    // Get the Print button by class
    const printButton = container.querySelector('.printButton');
    if (printButton) {
      expect(printButton).toBeDisabled();
    }
  });
  
  it('renders keyboard shortcuts section', () => {
    render(<ControlPanel {...defaultProps} />);
    
    // Check for keyboard shortcuts section
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('1-4')).toBeInTheDocument();
  });
  
  it('renders theme options and calls onThemeChange when clicked', () => {
    const mockOnThemeChange = jest.fn();
    render(
      <ControlPanel 
        {...defaultProps} 
        onThemeChange={mockOnThemeChange}
        selectedTheme="dungeon"
      />
    );
    
    // Check for theme options
    expect(screen.getByText('Dungeon')).toBeInTheDocument();
    expect(screen.getByText('Space')).toBeInTheDocument();
    
    // Check active state
    const dungeonButton = screen.getByText('Dungeon').closest('button');
    expect(dungeonButton).toHaveClass('themeButtonActive');
    
    // Click space theme
    fireEvent.click(screen.getByText('Space'));
    
    // Check if onThemeChange was called with 'space'
    expect(mockOnThemeChange).toHaveBeenCalledWith('space');
  });
}); 