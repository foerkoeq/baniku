// start of frontend/components/family-tree/hooks/useCenteredTree.tsx
'use client';
import { useRef, useState, useLayoutEffect } from 'react';

const useCenteredTree = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  
  // Hitung translate hanya saat container mount atau resize
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const updateTranslate = () => {
      if (!containerRef.current) return;
      
      setTranslate({
        x: containerRef.current.offsetWidth / 2,
        y: containerRef.current.offsetHeight / 4, // Mulai dari 1/4 atas
      });
    };
    
    // Update pada mount
    updateTranslate();
    
    // Update pada resize
    const resizeObserver = new ResizeObserver(() => {
      // Menggunakan requestAnimationFrame untuk throttle update dan menghindari re-renders berlebihan
      window.requestAnimationFrame(updateTranslate);
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return { containerRef, translate };
};

export default useCenteredTree;
// end of frontend/components/family-tree/hooks/useCenteredTree.tsx