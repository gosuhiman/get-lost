import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SizeSelector } from '@/components/ControlPanel/components';
import { MazeSize } from '@/lib/maze/types';

describe('SizeSelector Component', () => {
  // Default mock props
  const defaultProps = {
    selectedSize: 'M' as MazeSize,
    onSizeChange: jest.fn(),
    isGenerating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all size options', () => {
    render(<SizeSelector {...defaultProps} />);
    
    // Check for all size buttons using the new span structure
    const sizeOptions = ['S', 'M', 'L', 'XL'];
    sizeOptions.forEach(size => {
      expect(screen.getByText(size)).toBeInTheDocument();
    });
  });

  it('highlights the selected size option', () => {
    render(<SizeSelector {...defaultProps} selectedSize="L" />);
    
    // Find the span with text 'L', then get its parent button
    const lButton = screen.getByText('L').closest('button');
    expect(lButton).toHaveClass('sizeButtonActive');
    
    // Check that other buttons don't have the active class
    const mButton = screen.getByText('M').closest('button');
    expect(mButton).not.toHaveClass('sizeButtonActive');
  });

  it('calls onSizeChange when a size button is clicked', () => {
    const mockOnSizeChange = jest.fn();
    render(
      <SizeSelector 
        {...defaultProps} 
        onSizeChange={mockOnSizeChange}
      />
    );
    
    // Click the 'L' size button
    fireEvent.click(screen.getByText('L'));
    
    // Check if onSizeChange was called with 'L'
    expect(mockOnSizeChange).toHaveBeenCalledWith('L');
  });

  it('disables buttons when isGenerating is true', () => {
    render(<SizeSelector {...defaultProps} isGenerating={true} />);
    
    // Check that all size buttons are disabled
    const sizeButtons = ['S', 'M', 'L', 'XL'].map(size => 
      screen.getByText(size).closest('button')
    );
    
    sizeButtons.forEach(button => {
      if (button) {
        expect(button).toBeDisabled();
      }
    });
  });
}); 