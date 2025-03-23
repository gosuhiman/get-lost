import '@testing-library/jest-dom';

// Silence React 18 console warning about useEffect being called during render
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('useEffect must not return anything besides a function')
  ) {
    return;
  }
  originalConsoleError(...args);
}; 