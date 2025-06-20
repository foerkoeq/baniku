// start of frontend/components/family-tree/MiniMap.tsx
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MiniMapProps } from './types';

const MiniMap: React.FC<MiniMapProps> = ({
  treeContainerRef,
  scale,
  translate,
  position
}) => {
  const miniMapRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const [miniMapDimensions, setMiniMapDimensions] = useState({ width: 0, height: 0 });
  const miniMapScale = 0.1; // Scale factor untuk minimap

  // Memoize update viewport untuk mengurangi rendering
  const updateViewport = useCallback(() => {
    if (!miniMapRef.current || !viewportRef.current || !treeContainerRef.current) return;

    const viewport = viewportRef.current;
    const treeContainer = treeContainerRef.current;
    const treeRect = treeContainer.getBoundingClientRect();
    
    // Update dimensions jika berubah
    if (miniMapDimensions.width !== treeRect.width || miniMapDimensions.height !== treeRect.height) {
      setMiniMapDimensions({
        width: treeRect.width,
        height: treeRect.height
      });
    }
    
    viewport.style.width = `${treeRect.width * miniMapScale}px`;
    viewport.style.height = `${treeRect.height * miniMapScale}px`;

    // Gunakan translate jika ada, jika tidak gunakan position
    const transformX = translate ? translate.x : position?.x ?? 0;
    const transformY = translate ? translate.y : position?.y ?? 0;
    
    viewport.style.transform = `translate(${-transformX * miniMapScale}px, ${-transformY * miniMapScale}px)`;
  }, [translate, position, treeContainerRef, miniMapDimensions, miniMapScale]);

  // Update saat komponen mount dan saat dependencies berubah
  useEffect(() => {
    // Update langsung saat pertama mount
    updateViewport();
    
    // Update saat resize
    const resizeObserver = new ResizeObserver(() => {
      // Menggunakan requestAnimationFrame untuk throttle update
      window.requestAnimationFrame(updateViewport);
    });
    
    if (treeContainerRef.current) {
      resizeObserver.observe(treeContainerRef.current);
    }
    
    return () => {
      if (treeContainerRef.current) {
        resizeObserver.unobserve(treeContainerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [updateViewport, treeContainerRef]);

  // Update saat scale, translate, atau position berubah
  useEffect(() => {
    updateViewport();
  }, [scale, translate, position, updateViewport]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault(); // Prevent text selection
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !miniMapRef.current || !treeContainerRef.current) return;

    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    startPos.current = { x: e.clientX, y: e.clientY };

    // TODO: Implementasi pan handler dari parent component jika diperlukan
    // Karena kita tidak memiliki handler yang bisa dipanggil di sini, kita biarkan handlePan diimplementasikan secara manual
  }, [treeContainerRef]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div 
      ref={miniMapRef}
      className="absolute bottom-4 right-4 w-48 h-32 border-2 border-gray-200 dark:border-gray-700 
        bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        ref={viewportRef}
        className="absolute border-2 border-blue-500 rounded-lg pointer-events-none bg-blue-50 dark:bg-blue-900/20"
        style={{
          // Initial dimensions agar tidak undefined
          width: `${miniMapDimensions.width * miniMapScale}px`,
          height: `${miniMapDimensions.height * miniMapScale}px`
        }}
      />
      {/* Optional: Tambahkan overlay untuk visual tree */}
      <div className="absolute inset-0 opacity-10">
        {/* Bisa ditambahkan representasi visual dari tree disini */}
      </div>
    </div>
  );
};

export default MiniMap;
// end of frontend/components/family-tree/MiniMap.tsx