import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KeyboardShortcuts } from '@/components/ControlPanel/components';

describe('KeyboardShortcuts Component', () => {
  it('renders keyboard shortcuts title', () => {
    render(<KeyboardShortcuts />);
    
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
  });

  it('renders all keyboard shortcuts', () => {
    render(<KeyboardShortcuts />);
    
    // Check for key elements
    expect(screen.getByText('G')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('1-4')).toBeInTheDocument();
    
    // Check for descriptions
    expect(screen.getByText('Generate maze')).toBeInTheDocument();
    expect(screen.getByText('Print maze')).toBeInTheDocument();
    expect(screen.getByText('Change theme')).toBeInTheDocument();
    expect(screen.getByText('Set maze size')).toBeInTheDocument();
  });
}); 