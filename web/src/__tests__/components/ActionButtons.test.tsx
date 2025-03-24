import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ActionButtons } from '@/components/ControlPanel/components';

describe('ActionButtons Component', () => {
  // Default mock props
  const defaultProps = {
    onGenerate: jest.fn(),
    onPrint: jest.fn(),
    isGenerating: false,
    hasMaze: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders generate and print buttons', () => {
    render(<ActionButtons {...defaultProps} />);
    
    expect(screen.getByText('Generate Maze')).toBeInTheDocument();
    expect(screen.getByText('Print Maze')).toBeInTheDocument();
  });

  it('calls onGenerate when the Generate button is clicked', () => {
    const mockOnGenerate = jest.fn();
    render(
      <ActionButtons 
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
      <ActionButtons 
        {...defaultProps} 
        onPrint={mockOnPrint}
      />
    );
    
    // Click the Print button
    fireEvent.click(screen.getByText('Print Maze'));
    
    // Check if onPrint was called
    expect(mockOnPrint).toHaveBeenCalled();
  });

  it('disables both buttons when isGenerating is true', () => {
    render(<ActionButtons {...defaultProps} isGenerating={true} />);
    
    // Check that the generate button is disabled
    expect(screen.getByText('Generating...')).toBeInTheDocument();
    const generateButton = screen.getByText('Generating...').closest('button');
    expect(generateButton).toBeDisabled();
    
    // Check that the print button is disabled
    const printButton = screen.getByText('Print Maze').closest('button');
    expect(printButton).toBeDisabled();
  });

  it('disables only Print button when hasMaze is false', () => {
    render(<ActionButtons {...defaultProps} hasMaze={false} />);
    
    // Check that the generate button is not disabled
    const generateButton = screen.getByText('Generate Maze').closest('button');
    expect(generateButton).not.toBeDisabled();
    
    // Check that the print button is disabled
    const printButton = screen.getByText('Print Maze').closest('button');
    expect(printButton).toBeDisabled();
  });
}); 