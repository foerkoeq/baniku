// start of frontend/components/family-tree/hooks/usePan.tsx
'use client';
import { useState, useCallback, useRef } from 'react';

export const usePan = (initialPosition = { x: 0, y: 0 }) => {
  const [position, setPosition] = useState(initialPosition);
  // Gunakan ref untuk melacak posisi saat ini tanpa menyebabkan re-render
  const positionRef = useRef(initialPosition);

  // Update posisi hanya jika berubah cukup signifikan (throttling)
  const handlePan = useCallback((x: number, y: number) => {
    // Hanya update state jika perubahan posisi signifikan
    // Ini mencegah update berlebihan yang bisa menyebabkan infinite loop
    const threshold = 0.5; // Ambang batas minimal perubahan untuk update
    const currentX = positionRef.current.x;
    const currentY = positionRef.current.y;
    
    if (Math.abs(x - currentX) > threshold || Math.abs(y - currentY) > threshold) {
      positionRef.current = { x, y };
      setPosition({ x, y });
    }
  }, []);

  const resetPosition = useCallback(() => {
    positionRef.current = initialPosition;
    setPosition(initialPosition);
  }, [initialPosition]);

  return {
    position,
    handlePan,
    resetPosition
  };
};

export default usePan;
// end of frontend/components/family-tree/hooks/usePan.tsx