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
    onSizeChange: jest.fn(),
    onPortalPairsChange: jest.fn(),
    onGenerate: jest.fn(),
    onPrint: jest.fn(),
    isGenerating: false,
    hasMaze: true,
  };

  it('renders all size options', () => {
    render(<ControlPanel {...defaultProps} />);
    
    // Check for all size buttons - using more specific text patterns
    expect(screen.getByText(/^S \(/)).toBeInTheDocument();
    expect(screen.getByText(/^M \(/)).toBeInTheDocument();
    expect(screen.getByText(/^L \(/)).toBeInTheDocument();
    expect(screen.getByText(/^XL \(/)).toBeInTheDocument();
  });

  it('renders all portal pair options', () => {
    render(<ControlPanel {...defaultProps} />);
    
    // Check for all portal pair options (0-4)
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('highlights the selected size option', () => {
    render(<ControlPanel {...defaultProps} selectedSize="L" />);
    
    // Check that the 'L' button has the active class using a more specific selector
    const lButton = screen.getByText(/^L \(/i).closest('button');
    expect(lButton).toHaveClass('sizeButtonActive');
    
    // Check that other buttons don't have the active class
    const mButton = screen.getByText(/^M \(/i).closest('button');
    expect(mButton).not.toHaveClass('sizeButtonActive');
  });

  it('highlights the selected portal pairs option', () => {
    render(<ControlPanel {...defaultProps} portalPairs={3} />);
    
    // Check that the '3' button has the active class
    const button3 = screen.getByText('3').closest('button');
    expect(button3).toHaveClass('sizeButtonActive');
    
    // Check that other buttons don't have the active class
    const button2 = screen.getByText('2').closest('button');
    expect(button2).not.toHaveClass('sizeButtonActive');
  });

  it('calls onSizeChange when a size button is clicked', () => {
    const mockOnSizeChange = jest.fn();
    render(
      <ControlPanel 
        {...defaultProps} 
        onSizeChange={mockOnSizeChange}
      />
    );
    
    // Click the 'L' size button, using a more specific selector
    fireEvent.click(screen.getByText(/^L \(/i));
    
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
    
    // Click the '4' portal pairs button
    fireEvent.click(screen.getByText('4'));
    
    // Check if onPortalPairsChange was called with 4
    expect(mockOnPortalPairsChange).toHaveBeenCalledWith(4);
  });

  it('calls onGenerate when the Generate button is clicked', () => {
    const mockOnGenerate = jest.fn();
    render(
      <ControlPanel 
        {...defaultProps} 
        onGenerate={mockOnGenerate}
      />
    );
    
    // Click the Generate button
    fireEvent.click(screen.getByText('Generate Maze'));
    
    // Check if onGenerate was called
    expect(mockOnGenerate).toHaveBeenCalled();
  });

  it('calls onPrint when the Print button is clicked', () => {
    const mockOnPrint = jest.fn();
    render(
      <ControlPanel 
        {...defaultProps} 
        onPrint={mockOnPrint}
      />
    );
    
    // Click the Print button
    fireEvent.click(screen.getByText('Print Maze'));
    
    // Check if onPrint was called
    expect(mockOnPrint).toHaveBeenCalled();
  });

  it('disables buttons when isGenerating is true', () => {
    render(<ControlPanel {...defaultProps} isGenerating={true} />);
    
    // Check that all size buttons are disabled
    // Fix: use more specific selectors that match exact button text
    const sizeButtons = [
      screen.getByText(/^S \(/i),
      screen.getByText(/^M \(/i),
      screen.getByText(/^L \(/i),
      screen.getByText(/^XL \(/i)
    ].map(el => el.closest('button'));
    
    sizeButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
    
    // Check that all portal pair buttons are disabled
    const portalButtons = ['0', '1', '2', '3', '4'].map(num => 
      screen.getByText(num).closest('button')
    );
    
    portalButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
    
    // Check that generate button shows loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });

  it('disables Print button when hasMaze is false', () => {
    render(<ControlPanel {...defaultProps} hasMaze={false} />);
    
    // Get the Print button
    const printButton = screen.getByText('Print Maze').closest('button');
    
    // Check that it's disabled
    expect(printButton).toBeDisabled();
  });
}); 