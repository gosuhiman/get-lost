# Get Lost!

A maze generation web application built with Next.js 15. Generate customizable mazes that can be printed.

## Features

- Dynamic maze generation using Depth-First Search algorithm
- Multiple maze sizes (S/M/L/XL)
- Clean SVG rendering for crisp printing
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
│       └── types.ts      # Type definitions
└── styles/               # Global CSS
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