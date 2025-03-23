'use client';

import { useState, useCallback, useEffect } from 'react';
import MazeGrid from '@/components/MazeGrid/MazeGrid';
import ControlPanel from '@/components/ControlPanel/ControlPanel';
import { generateMazeWithPortals } from '@/lib/maze';
import { Cell, MazeSize } from '@/lib/maze/types';

export default function Home() {
  const [mazeData, setMazeData] = useState<Cell[][]>([]);
  // Path data currently not being used in the UI
  const [, setPathData] = useState<[number, number][]>([]);
  const [selectedSize, setSelectedSize] = useState<MazeSize>('M');
  const [portalPairs, setPortalPairs] = useState<number>(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [printReady, setPrintReady] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Generate maze using our new method that creates sectioned maze with portals
  const handleGenerateMaze = useCallback(() => {
    setIsGenerating(true);
    
    // Use setTimeout to prevent UI blocking and allow loading state to render
    setTimeout(() => {
      try {
        console.log(`Generating maze with size ${selectedSize} and ${portalPairs} portal pairs`);
        
        // Use our new sectioned maze generator with portals
        const { maze, path } = generateMazeWithPortals(selectedSize, portalPairs);
        
        // Debug: Check if portals are being created
        let portalCount = 0;
        for (let y = 0; y < maze.length; y++) {
          for (let x = 0; x < maze[0].length; x++) {
            if (maze[y][x].portal) {
              portalCount++;
              const portal = maze[y][x].portal;
              console.log(`Portal found at ${x},${y} with ID ${portal?.id} and pairIndex ${portal?.pairIndex}`);
            }
          }
        }
        console.log(`Total portals created: ${portalCount}`);
        
        setMazeData(maze);
        setPathData(path);
        
        if (initialLoad) {
          setInitialLoad(false);
        }
      } catch (err) {
        // Silent error handling in production
        console.error("Error generating maze:", err);
      } finally {
        setIsGenerating(false);
      }
    }, 10);
  }, [selectedSize, portalPairs, initialLoad]);

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

  // Generate a maze on initial load
  useEffect(() => {
    if (initialLoad) {
      handleGenerateMaze();
    }
    
    // Detect Safari for print-specific styles
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      document.documentElement.classList.add('safari');
    }
  }, [initialLoad, handleGenerateMaze]);

  return (
    <main className={`flex min-h-screen flex-col items-center ${printReady ? 'p-0' : 'p-4 sm:p-12'}`}>
      <div className={`z-10 w-full flex flex-col items-center ${printReady ? 'print-focused' : ''}`}>
        <h1 className={`text-3xl font-bold mb-6 ${printReady ? 'no-print' : ''}`}>Get Lost - Maze Generator</h1>
        
        <ControlPanel
          selectedSize={selectedSize}
          portalPairs={portalPairs}
          onSizeChange={handleSizeChange}
          onPortalPairsChange={handlePortalPairsChange}
          onGenerate={handleGenerateMaze}
          isGenerating={isGenerating}
          onPrint={handlePrint}
          hasMaze={mazeData.length > 0}
        />
        
        <div className={`mt-4 ${printReady ? 'print-ready' : ''}`}>
          <MazeGrid 
            mazeData={mazeData}
            cellSize={10}
          />
        </div>
        
        <p className={`text-sm text-gray-500 mt-4 ${printReady ? 'no-print' : ''}`}>
          Randomly generated maze with {portalPairs} portal pair{portalPairs !== 1 ? 's' : ''}.
        </p>
      </div>
    </main>
  );
}
