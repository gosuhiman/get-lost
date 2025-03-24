import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PortalSelector } from '@/components/ControlPanel/components';

describe('PortalSelector Component', () => {
  // Default mock props
  const defaultProps = {
    portalPairs: 2,
    onPortalPairsChange: jest.fn(),
    isGenerating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all portal pair options', () => {
    render(<PortalSelector {...defaultProps} />);
    
    // Check for all portal pair options (0-3)
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('highlights the selected portal pairs option', () => {
    render(<PortalSelector {...defaultProps} portalPairs={3} />);
    
    // Check that the '3' button has the active class
    const button3 = screen.getByText('3').closest('button');
    expect(button3).toHaveClass('portalButtonActive');
    
    // Check that other buttons don't have the active class
    const button2 = screen.getByText('2').closest('button');
    expect(button2).not.toHaveClass('portalButtonActive');
  });

  it('calls onPortalPairsChange when a portal pair button is clicked', () => {
    const mockOnPortalPairsChange = jest.fn();
    render(
      <PortalSelector 
        {...defaultProps} 
        onPortalPairsChange={mockOnPortalPairsChange}
      />
    );
    
    // Click the '3' portal pairs button
    fireEvent.click(screen.getByText('3'));
    
    // Check if onPortalPairsChange was called with 3
    expect(mockOnPortalPairsChange).toHaveBeenCalledWith(3);
  });

  it('disables buttons when isGenerating is true', () => {
    render(<PortalSelector {...defaultProps} isGenerating={true} />);
    
    // Check that all portal pair buttons are disabled
    const portalButtons = ['0', '1', '2', '3'].map(num => 
      screen.getByText(num).closest('button')
    );
    
    portalButtons.forEach(button => {
      if (button) {
        expect(button).toBeDisabled();
      }
    });
  });

  it('displays the correct help text for no portals', () => {
    render(<PortalSelector {...defaultProps} portalPairs={0} />);
    expect(screen.getByText('No portals - traditional maze.')).toBeInTheDocument();
  });

  it('displays the correct help text for single portal pair', () => {
    render(<PortalSelector {...defaultProps} portalPairs={1} />);
    expect(screen.getByText('1 portal pair will connect different maze sections.')).toBeInTheDocument();
  });

  it('displays the correct help text for multiple portal pairs', () => {
    render(<PortalSelector {...defaultProps} portalPairs={3} />);
    expect(screen.getByText('3 portal pairs will connect different maze sections.')).toBeInTheDocument();
  });
}); 