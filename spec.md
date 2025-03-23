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
- Pure TypeScript implementation with cell-based data structure

**2. SVG Rendering**

- Vector-based maze display using SVG
- Responsive scaling with viewBox
- Printable output via CSS media queries
- Print-friendly black and white design

**3. State Management**

- React useState for managing maze data
- State tracking for generation process
- Print-ready state management
- Portal pair configuration

**4. Portal System**

- Portal pairs for instant transportation between maze locations
- Each portal connects to exactly one other portal (paired)
- Multiple portal pairs can exist in a single maze
- Implementation considerations:
  - Portals placed after maze generation to ensure path validity
  - Portal pairs share the same ID but have different indices
  - Print-friendly visual indicators for paired portals (numbered labels)
  - Portals cannot be placed on entrance or exit cells
  - Portals must be placed at dead-ends (cells with walls on 3 sides)
  - Portal pairs must be in separate, disconnected sections of the maze
  - Users must use portals to travel between these sections
  - Each portal effectively acts as a teleporting dead-end

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
3. SVG memoization with React.memo
4. Dynamic import for maze algorithm

## Implementation Steps

1. **Core Algorithm**
Implement DFS with:
    - Stack-based backtracking
    - Random neighbor selection
    - Wall removal logic
    
2. **Portal System**
Implement portal generation:
    - Place portals at dead-ends (cells with 3 walls)
    - Ensure portal pairs are in disconnected maze sections
    - Implement validation to prevent portals being reachable from each other
    - Force users to use portals to navigate between maze sections

3. **SVG Component**
    - Render walls based on cell data
    - Display portals with clear visual indicators
    - Maintain print-friendly design

4. **Print Optimization**
    - Dedicated print layout in app/layout.tsx
    - @media print styles remove UI controls
    - SVG scaling based on paper size detection
    - Black and white compatible visual elements
    - High contrast design for portal indicators

## Testing Strategy

1. Jest unit tests for maze generator
    - Complete path existence verification
    - No isolated cells check
    - Portal pair connectivity validation
    - Dead-end placement verification for portals
    - Isolated section verification for portal pairs
2. Cypress E2E tests for:
    - Generation button workflow
    - Print dialog triggering
    - Responsive sizing
    - Portal pair visual consistency
3. Print tests:
    - Black and white printer compatibility
    - Portal identification legibility

This architecture leverages Next.js 15's app router while keeping the bundle size minimal (≈50kb gzipped). The DFS algorithm provides O(n) complexity suitable for browser execution, with Web Workers preventing main thread blocking for large mazes.

## CI/CD Pipeline

The application uses GitHub Actions for continuous integration and deployment to GitHub Pages within the same repository.

### Workflow Overview
- Triggered on push to main branch and pull requests
- Builds, tests, and deploys the application
- Configures Next.js for static export to GitHub Pages

### GitHub Repository Configuration
1. Repository settings must have GitHub Pages enabled:
   - Source: GitHub Actions
   - Permissions: Read/write for workflow

This CI/CD pipeline ensures that changes pushed to the main branch are automatically tested, built, and deployed to GitHub Pages, making the maze generator accessible at `https://[username].github.io/get-lost/`.
