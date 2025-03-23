# Get Lost! Specification

## Core Architecture

```src/
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
│       └── types.ts      # Type definitions
└── styles/               # Global CSS
```


## Key Features Implementation

**1. Maze Generation (Client-side)**

- Depth-First Search algorithm implementation[^1]
- Dynamic size configuration (S/M/L/XL)
- Pure TypeScript implementation:

```typescript
interface Cell {
  walls: [boolean, boolean, boolean, boolean]; // N,E,S,W
  visited: boolean;
}

function generateMaze(width: number, height: number): Cell[][] {
  // DFS implementation with backtracking
  // Returns 2D array of cells with wall data
}
```

**2. SVG Rendering**

- Vector-based maze display using `<svg>`
- Responsive scaling with viewBox
- Printable output via CSS media queries[^3]:

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
```


## Technical Decisions

| Component | Technology | Rationale |
| :-- | :-- | :-- |
| Rendering Engine | SVG | Scalable vectors for crisp printing[^3] |
| Algorithm | DFS | Simple implementation with good branching[^1] |
| State Management | React useState | Lightweight for single-page needs |
| Styling | CSS Modules | Component-scoped styles |
| Print Handling | CSS Media Query | Native browser print optimization |

## Performance Considerations

1. Web Worker for maze generation (prevents UI blocking)
2. Debounced generate button (300ms cooldown)
3. SVG memoization with `React.memo`
4. Dynamic import for maze algorithm:
```typescript
const generateMaze = async () => {
  const { dfsGenerator } = await import('@/lib/maze/generator');
  // ... generation logic
}
```


## Implementation Steps

1. **Core Algorithm**
Implement DFS with:
    - Stack-based backtracking
    - Random neighbor selection
    - Wall removal logic
2. **SVG Component**

```tsx
<svg viewBox={`0 0 ${width*10} ${height*10}`}>
  {mazeData.map((row, y) => row.map((cell, x) => (
    <g key={`${x}-${y}`}>
      {cell.walls[^0] && <line x1={x*10} y1={y*10} x2={(x+1)*10} y2={y*10}/>}
      {/* Render other walls similarly */}
    </g>
  ))}
</svg>
```

3. **Print Optimization**
    - Dedicated print layout in `app/layout.tsx`
    - @media print styles remove UI controls
    - SVG scaling based on paper size detection

## Testing Strategy

1. Jest unit tests for maze generator
    - Complete path existence verification
    - No isolated cells check
2. Cypress E2E tests for:
    - Generation button workflow
    - Print dialog triggering
    - Responsive sizing

This architecture leverages Next.js 15's app router while keeping the bundle size minimal (≈50kb gzipped). The DFS algorithm provides O(n) complexity suitable for browser execution, with Web Workers preventing main thread blocking for large mazes[^1][^3].

<div style="text-align: center">⁂</div>

[^1]: https://www.youtube.com/watch?v=EN733Aq4ynM

[^2]: https://phrase.com/blog/posts/next-js-app-router-localization-next-intl/

[^3]: https://www.youtube.com/watch?v=BkFDgLXTu9U

[^4]: https://nextjs.org

[^5]: https://www.wisp.blog/blog/the-ultimate-guide-to-organizing-your-nextjs-15-project-structure

[^6]: https://dev.to/robertobutti/how-to-build-a-dynamic-website-with-nextjs-15-app-router-react-19-storyblok-and-bun--2972

[^7]: https://blog.cloudflare.com/ai-labyrinth/

[^8]: https://www.linkedin.com/pulse/nextjs-15-modern-design-best-practices-scalable-web-ruben-mora-vargas-bmvye

[^9]: https://www.reddit.com/r/nextjs/comments/1ig4qw8/what_is_the_best_way_of_organizing_the_file/

[^10]: https://www.youtube.com/watch?v=Zq5fmkH0T78

[^11]: https://nextjs.org/blog/next-15

[^12]: https://stackoverflow.com/questions/38502/whats-a-good-algorithm-to-generate-a-maze

[^13]: https://nextjs.org/docs/architecture

[^14]: https://www.youtube.com/watch?v=DLeAPn5-TIA

[^15]: https://nextjs.org/docs/app/getting-started/project-structure

[^16]: https://help.maze.co/hc/en-us/articles/9768967895059--Website-Test-Run-usability-tests-on-your-live-websites

[^17]: https://labyrinth.tech

[^18]: https://www.youtube.com/watch?v=nHjqkLV_Tp0

[^19]: https://www.youtube.com/watch?v=L0g87N0piT0\&vl=en

[^20]: https://dev.to/dimeloper/whats-new-in-nextjs-15-new-hooks-turbopack-and-more-2lo8

