# Get Lost!

A maze generation web application built with Next.js 15. Generate customizable mazes with portal systems that can be printed.

## Features

- Dynamic maze generation using Depth-First Search algorithm
- Multiple maze sizes (S/M/L/XL)
- Portal system for instant transportation between maze locations
- Clean SVG rendering for crisp printing
- Print-friendly black and white design
- Responsive design

## Tech Stack

- Next.js 15
- React
- TypeScript
- CSS Modules
- SVG for rendering

## Getting Started

### Prerequisites

- Node.js (recommended latest LTS)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd get-lost
```

2. Install dependencies
```bash
cd web
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
web/src/
├── app/
│   ├── layout.tsx        # Root layout with print styles
│   └── page.tsx          # Main maze interface (client component)
├── components/
│   ├── MazeGrid/         # SVG-based maze renderer
│   └── ControlPanel/     # Generate/Print controls
├── lib/
│   └── maze/             # Core maze logic
│       ├── generator.ts  # DFS algorithm implementation
│       ├── portals.ts    # Portal pair generation and handling
│       ├── solver.ts     # Maze solving algorithm
│       └── types.ts      # Type definitions
└── __tests__/            # Test files
```

## Development

```bash
npm run dev
# or
yarn dev
```

## Testing

```bash
npm run test
# or
yarn test
```

## Production

Build and start the production version:

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Portal System

The maze features a portal system that allows instant transportation between different locations in the maze. Portal pairs are placed at dead-ends in disconnected sections of the maze, requiring users to use them to navigate through the entire maze. Each portal connects to exactly one other portal, and multiple portal pairs can exist in a single maze. 