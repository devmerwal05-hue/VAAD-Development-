import { useEffect } from 'react';

export function useLenis() {
  useEffect(() => {
    // Lenis disabled - causing performance issues
    // Can re-enable with better settings after testing
    return () => {};
  }, []);
}