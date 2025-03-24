import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ControlPanel from '@/components/ControlPanel/ControlPanel';
import { MazeSize } from '@/lib/maze/types';
import { 
  SizeSelector,
  PortalSelector, 
  ThemeSelector, 
  ActionButtons
} from '@/components/ControlPanel/components';

// Mock the component imports so we can test the component isolation
jest.mock('@/components/ControlPanel/components', () => ({
  SizeSelector: jest.fn(({ selectedSize, onSizeChange, isGenerating }) => (
    <div data-testid="size-selector">
      {['S', 'M', 'L', 'XL'].map((size) => (
        <button 
          key={size} 
          onClick={() => onSizeChange(size as MazeSize)} 
          disabled={isGenerating}
          data-testid={`size-${size}`}
          className={selectedSize === size ? 'sizeButtonActive' : ''}
        >
          {size}
        </button>
      ))}
    </div>
  )),
  PortalSelector: jest.fn(({ portalPairs, onPortalPairsChange, isGenerating }) => (
    <div data-testid="portal-selector">
      {[0, 1, 2, 3].map((pairs) => (
        <button 
          key={pairs} 
          onClick={() => onPortalPairsChange(pairs)} 
          disabled={isGenerating}
          data-testid={`portal-${pairs}`}
          className={portalPairs === pairs ? 'portalButtonActive' : ''}
        >
          {pairs}
        </button>
      ))}
    </div>
  )),
  ThemeSelector: jest.fn(({ selectedTheme, onThemeChange, isGenerating }) => (
    <div data-testid="theme-selector">
      <button 
        onClick={() => onThemeChange('dungeon')} 
        disabled={isGenerating}
        data-testid="theme-dungeon"
        className={selectedTheme === 'dungeon' ? 'themeButtonActive' : ''}
      >
        Dungeon
      </button>
      <button 
        onClick={() => onThemeChange('space')} 
        disabled={isGenerating}
        data-testid="theme-space"
        className={selectedTheme === 'space' ? 'themeButtonActive' : ''}
      >
        Space
      </button>
    </div>
  )),
  ActionButtons: jest.fn(({ onGenerate, onPrint, isGenerating, hasMaze }) => (
    <div data-testid="action-buttons">
      <button 
        onClick={onGenerate} 
        disabled={isGenerating}
        data-testid="generate-button"
      >
        {isGenerating ? 'Generating...' : 'Generate Maze'}
      </button>
      <button 
        onClick={onPrint} 
        disabled={!hasMaze || isGenerating}
        data-testid="print-button"
        className="printButton"
      >
        Print Maze
      </button>
    </div>
  )),
  KeyboardShortcuts: jest.fn(() => (
    <div data-testid="keyboard-shortcuts">
      Keyboard Shortcuts
    </div>
  )),
}));

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all subcomponents', () => {
    render(<ControlPanel {...defaultProps} />);
    
    expect(screen.getByTestId('size-selector')).toBeInTheDocument();
    expect(screen.getByTestId('portal-selector')).toBeInTheDocument();
    expect(screen.getByTestId('theme-selector')).toBeInTheDocument();
    expect(screen.getByTestId('action-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('keyboard-shortcuts')).toBeInTheDocument();
  });

  it('passes correct props to SizeSelector', () => {
    render(<ControlPanel {...defaultProps} />);
    
    // Get the mock directly from the imported component
    const mockSizeSelector = SizeSelector as jest.MockedFunction<typeof SizeSelector>;
    const props = mockSizeSelector.mock.calls[0][0];
    
    expect(props.selectedSize).toBe('M');
    expect(props.isGenerating).toBe(false);
    expect(typeof props.onSizeChange).toBe('function');
  });

  it('passes correct props to PortalSelector', () => {
    render(<ControlPanel {...defaultProps} />);
    
    const mockPortalSelector = PortalSelector as jest.MockedFunction<typeof PortalSelector>;
    const props = mockPortalSelector.mock.calls[0][0];
    
    expect(props.portalPairs).toBe(2);
    expect(props.isGenerating).toBe(false);
    expect(typeof props.onPortalPairsChange).toBe('function');
  });

  it('passes correct props to ThemeSelector', () => {
    render(<ControlPanel {...defaultProps} />);
    
    const mockThemeSelector = ThemeSelector as jest.MockedFunction<typeof ThemeSelector>;
    const props = mockThemeSelector.mock.calls[0][0];
    
    expect(props.selectedTheme).toBe('dungeon');
    expect(props.isGenerating).toBe(false);
    expect(typeof props.onThemeChange).toBe('function');
  });

  it('passes correct props to ActionButtons', () => {
    render(<ControlPanel {...defaultProps} />);
    
    const mockActionButtons = ActionButtons as jest.MockedFunction<typeof ActionButtons>;
    const props = mockActionButtons.mock.calls[0][0];
    
    expect(props.isGenerating).toBe(false);
    expect(props.hasMaze).toBe(true);
    expect(typeof props.onGenerate).toBe('function');
    expect(typeof props.onPrint).toBe('function');
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
    fireEvent.click(screen.getByTestId('size-L'));
    
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
    fireEvent.click(screen.getByTestId('portal-3'));
    
    // Check if onPortalPairsChange was called with 3
    expect(mockOnPortalPairsChange).toHaveBeenCalledWith(3);
  });

  it('calls onThemeChange when a theme button is clicked', () => {
    const mockOnThemeChange = jest.fn();
    render(
      <ControlPanel 
        {...defaultProps} 
        onThemeChange={mockOnThemeChange}
      />
    );
    
    // Click the 'space' theme button
    fireEvent.click(screen.getByTestId('theme-space'));
    
    // Check if onThemeChange was called with 'space'
    expect(mockOnThemeChange).toHaveBeenCalledWith('space');
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
    fireEvent.click(screen.getByTestId('generate-button'));
    
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
    fireEvent.click(screen.getByTestId('print-button'));
    
    // Check if onPrint was called
    expect(mockOnPrint).toHaveBeenCalled();
  });

  it('disables buttons when isGenerating is true', () => {
    render(<ControlPanel {...defaultProps} isGenerating={true} />);
    
    // Get all mocked components
    const mockSizeSelector = SizeSelector as jest.MockedFunction<typeof SizeSelector>;
    const mockPortalSelector = PortalSelector as jest.MockedFunction<typeof PortalSelector>;
    const mockThemeSelector = ThemeSelector as jest.MockedFunction<typeof ThemeSelector>;
    const mockActionButtons = ActionButtons as jest.MockedFunction<typeof ActionButtons>;
    
    // Check that components received isGenerating=true
    expect(mockSizeSelector.mock.calls[0][0].isGenerating).toBe(true);
    expect(mockPortalSelector.mock.calls[0][0].isGenerating).toBe(true);
    expect(mockThemeSelector.mock.calls[0][0].isGenerating).toBe(true);
    expect(mockActionButtons.mock.calls[0][0].isGenerating).toBe(true);
  });
}); 