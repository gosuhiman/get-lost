'use client';

import { useState, useCallback, useEffect } from 'react';
import MazeGrid from '@/components/MazeGrid/MazeGrid';
import ControlPanel from '@/components/ControlPanel/ControlPanel';
import { generateMaze } from '@/lib/maze/generator';
import { Cell, MazeSize, SIZE_CONFIGS } from '@/lib/maze/types';

export default function Home() {
  const [mazeData, setMazeData] = useState<Cell[][]>([]);
  const [selectedSize, setSelectedSize] = useState<MazeSize>('M');
  const [isGenerating, setIsGenerating] = useState(false);
  const [printReady, setPrintReady] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Generate maze using the DFS algorithm
  const handleGenerateMaze = useCallback(() => {
    setIsGenerating(true);
    
    // Use setTimeout to prevent UI blocking and allow loading state to render
    setTimeout(() => {
      try {
        const { width, height } = SIZE_CONFIGS[selectedSize];
        const newMaze = generateMaze(width, height);
        setMazeData(newMaze);
      } catch (error) {
        // Silent error handling in production
      } finally {
        setIsGenerating(false);
      }
    }, 10);
  }, [selectedSize]);

  // Handle size change
  const handleSizeChange = useCallback((size: MazeSize) => {
    setSelectedSize(size);
  }, []);

  // Handle print functionality
  const handlePrint = useCallback(() => {
    setPrintReady(true);
    setTimeout(() => {
      window.print();
      setPrintReady(false);
    }, 300);
  }, []);

  // Generate a default maze on first load
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      handleGenerateMaze();
    }
  }, [initialLoad, handleGenerateMaze]);

  return (
    <div className="min-h-screen flex flex-col p-2 md:p-4 gap-4">
      <header className="text-center no-print mb-2">
        <h1 className="text-3xl font-bold mt-2">Get Lost!</h1>
        <p className="text-lg mb-3">
          Generate, solve, and print mazes of various sizes
        </p>
      </header>

      <main className="flex flex-col items-center gap-4 flex-grow">
        {/* Maze Grid */}
        <div className={`${printReady ? 'print-focused' : ''} w-full flex justify-center flex-grow`}>
          <MazeGrid mazeData={mazeData} />
        </div>

        {/* Control Panel */}
        <div className="no-print w-full max-w-2xl mt-2 mb-4">
          <ControlPanel
            selectedSize={selectedSize}
            onSizeChange={handleSizeChange}
            onGenerate={handleGenerateMaze}
            onPrint={handlePrint}
            isGenerating={isGenerating}
            hasMaze={mazeData.length > 0}
          />
        </div>
      </main>
    </div>
  );
}
