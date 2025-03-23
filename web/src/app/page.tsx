'use client';

import { useState, useCallback, useEffect } from 'react';
import MazeGrid from '@/components/MazeGrid/MazeGrid';
import ControlPanel from '@/components/ControlPanel/ControlPanel';
import { generateMaze } from '@/lib/maze/generator';
import { addPortals } from '@/lib/maze/portals';
import { Cell, MazeSize, SIZE_CONFIGS } from '@/lib/maze/types';

export default function Home() {
  const [mazeData, setMazeData] = useState<Cell[][]>([]);
  const [selectedSize, setSelectedSize] = useState<MazeSize>('M');
  const [portalPairs, setPortalPairs] = useState<number>(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [printReady, setPrintReady] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Generate maze using the DFS algorithm and add portals
  const handleGenerateMaze = useCallback(() => {
    setIsGenerating(true);
    
    // Use setTimeout to prevent UI blocking and allow loading state to render
    setTimeout(() => {
      try {
        const { width, height } = SIZE_CONFIGS[selectedSize];
        const newMaze = generateMaze(width, height);
        
        // Add portal pairs if requested
        const mazeWithPortals = portalPairs > 0 
          ? addPortals(newMaze, portalPairs) 
          : newMaze;
          
        setMazeData(mazeWithPortals);
      } catch (err) {
        // Silent error handling in production
        console.error("Error generating maze:", err);
      } finally {
        setIsGenerating(false);
      }
    }, 10);
  }, [selectedSize, portalPairs]);

  // Handle size change
  const handleSizeChange = useCallback((size: MazeSize) => {
    setSelectedSize(size);
  }, []);

  // Handle portal pairs change
  const handlePortalPairsChange = useCallback((pairs: number) => {
    setPortalPairs(pairs);
  }, []);

  // Handle print functionality with improved print layout
  const handlePrint = useCallback(() => {
    // Set print ready state to adjust styling
    setPrintReady(true);
    
    // Add a minimal delay to ensure styles are applied before print
    setTimeout(() => {
      // Apply print-specific styles for better margin handling
      document.body.classList.add('printing');
      
      // Force browser to recalculate layout
      window.dispatchEvent(new Event('resize'));
      
      // Trigger print dialog with specific settings
      const printWindow = window;
      try {
        // For Chrome and modern browsers
        if (printWindow.matchMedia) {
          const mediaQueryList = printWindow.matchMedia('print');
          mediaQueryList.addListener(function(mql) {
            if (!mql.matches) {
              // Clean up after printing is done
              document.body.classList.remove('printing');
              setPrintReady(false);
            }
          });
        }
      } catch (e) {
        // Fallback if above doesn't work
        console.error("Print event listener failed", e);
      }
      
      // Print with minimal delay to ensure styles are applied
      setTimeout(() => {
        window.print();
        
        // Fallback cleanup
        setTimeout(() => {
          document.body.classList.remove('printing');
          setPrintReady(false);
        }, 500);
      }, 100);
    }, 300);
  }, []);

  // Generate a default maze on first load
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      handleGenerateMaze();
    }
    
    // Detect Safari for print-specific styles
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      document.documentElement.classList.add('safari');
    }
  }, [initialLoad, handleGenerateMaze]);

  return (
    <div className={`min-h-screen flex flex-col ${printReady ? 'p-0' : 'p-2 md:p-4'} gap-4`}>
      <header className="text-center no-print mb-2">
        <h1 className="text-3xl font-bold mt-2">Get Lost!</h1>
        <p className="text-lg mb-3">
          Generate, solve, and print mazes with portals of various sizes
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
            portalPairs={portalPairs}
            onSizeChange={handleSizeChange}
            onPortalPairsChange={handlePortalPairsChange}
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
