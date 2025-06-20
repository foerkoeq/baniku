// start of frontend/components/family-tree/hooks/useZoom.tsx
'use client';
import { useState, useCallback } from 'react';

export const useZoom = (initialScale = 1) => {
  const [scale, setScale] = useState(initialScale);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, 2));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, 0.1));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  return {
    scale,
    zoomIn,
    zoomOut,
    resetZoom
  };
};

export default useZoom;
// end of frontend/components/family-tree/hooks/useZoom.tsx