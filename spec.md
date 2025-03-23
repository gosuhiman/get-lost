# Get Lost! Specification

## Core Architecture

```
src/
├── app/
│   ├── layout.tsx        # Root layout with print styles
│   └── page.tsx          # Main maze interface (client component)
├── components/
│   ├── MazeGrid/         # SVG-based maze renderer
│   │   ├── MazeGrid.tsx
│   │   └── styles.module.css
│   └── ControlPanel/     # Generate/Print controls
│       ├── ControlPanel.tsx
│       └── styles.module.css
├── lib/
│   └── maze/             # Core maze logic
│       ├── generator.ts  # DFS algorithm implementation
│       ├── portals.ts    # Portal pair generation and handling
│       └── types.ts      # Type definitions
└── styles/               # Global CSS
```


## Key Features Implementation

**1. Maze Generation (Client-side)**

- Depth-First Search algorithm implementation
- Dynamic size configuration (S/M/L/XL)
- Pure TypeScript implementation:

```typescript
interface Cell {
  walls: [boolean, boolean, boolean, boolean]; // N,E,S,W
  visited: boolean;
  portal?: {
    id: number;     // Unique identifier for the portal pair
    pairIndex: number; // Index of the paired portal cell
  };
}

function generateMaze(width: number, height: number): Cell[][] {
  // DFS implementation with backtracking
  // Returns 2D array of cells with wall data
}

function addPortals(maze: Cell[][], numPairs: number = 2): Cell[][] {
  // Randomly place portal pairs throughout the maze
  // Returns updated maze with portal data
}
```

**2. SVG Rendering**

- Vector-based maze display using `<svg>`
- Responsive scaling with viewBox
- Printable output via CSS media queries:
- Print-friendly black and white design:

```css
@media print {
  .no-print { display: none; }
  .maze-grid { zoom: 120%; }
}
```

**3. State Management**

```typescript
const [mazeData, setMazeData] = useState<Cell[][]>([]);
const [isGenerating, setIsGenerating] = useState(false);
const [printReady, setPrintReady] = useState(false);
const [portalPairs, setPortalPairs] = useState<number>(2); // Number of portal pairs
```

**4. Portal System**

- Portal pairs for instant transportation between maze locations
- Each portal connects to exactly one other portal (paired)
- Multiple portal pairs can exist in a single maze
- Implementation considerations:
  - Portals placed after maze generation to ensure path validity
  - Portal pairs share the same ID but have different indices
  - Print-friendly visual indicators for paired portals (numbered labels)
  - Portals cannot be placed on entrance or exit cells

```typescript
function placePortalPairs(maze: Cell[][], numPairs: number): void {
  // For each pair:
  // 1. Select two random accessible cells
  // 2. Assign matching portal IDs with different pair indices
  // 3. Ensure no overlapping portal placements
}
```

## Technical Decisions

| Component | Technology | Rationale |
| :-- | :-- | :-- |
| Rendering Engine | SVG | Scalable vectors for crisp printing |
| Algorithm | DFS | Simple implementation with good branching |
| State Management | React useState | Lightweight for single-page needs |
| Styling | CSS Modules | Component-scoped styles |
| Print Handling | CSS Media Query | Native browser print optimization |
| Portal Visualization | SVG with Text | Black and white print-compatible labeling system |

## Performance Considerations

1. Web Worker for maze generation (prevents UI blocking)
2. Debounced generate button (300ms cooldown)
3. SVG memoization with `React.memo`
4. Dynamic import for maze algorithm:
```typescript
const generateMaze = async () => {
  const { dfsGenerator } = await import('@/lib/maze/generator');
  const { addPortalPairs } = await import('@/lib/maze/portals');
  // ... generation logic with portal addition
}
```


## Implementation Steps

1. **Core Algorithm**
Implement DFS with:
    - Stack-based backtracking
    - Random neighbor selection
    - Wall removal logic
    
2. **Portal System**
Implement portal generation:
    - Random placement algorithm
    - Pair linking logic
    - Validation to ensure proper placement

3. **SVG Component**

```tsx
<svg viewBox={`0 0 ${width*10} ${height*10}`}>
  {mazeData.map((row, y) => row.map((cell, x) => (
    <g key={`${x}-${y}`}>
      {cell.walls[0] && <line x1={x*10} y1={y*10} x2={(x+1)*10} y2={y*10}/>}
      {/* Render other walls similarly */}
      {cell.portal && (
        <>
          <circle 
            cx={x*10 + 5} 
            cy={y*10 + 5} 
            r={3.5} 
            fill="white" 
            stroke="black" 
            strokeWidth="0.8"
          />
          <text 
            x={x*10 + 5} 
            y={y*10 + 5.5} 
            fontSize="4px" 
            textAnchor="middle" 
            dominantBaseline="middle"
            fill="black"
          >
            {cell.portal.id}
          </text>
        </>
      )}
    </g>
  ))}
</svg>
```

4. **Print Optimization**
    - Dedicated print layout in `app/layout.tsx`
    - @media print styles remove UI controls
    - SVG scaling based on paper size detection
    - Black and white compatible visual elements
    - High contrast design for portal indicators

## Testing Strategy

1. Jest unit tests for maze generator
    - Complete path existence verification
    - No isolated cells check
    - Portal pair connectivity validation
2. Cypress E2E tests for:
    - Generation button workflow
    - Print dialog triggering
    - Responsive sizing
    - Portal pair visual consistency
3. Print tests:
    - Black and white printer compatibility
    - Portal identification legibility

This architecture leverages Next.js 15's app router while keeping the bundle size minimal (≈50kb gzipped). The DFS algorithm provides O(n) complexity suitable for browser execution, with Web Workers preventing main thread blocking for large mazes.
