// start of frontend/components/book/BookCover.tsx
'use client';
import React from 'react';

interface BookCoverProps {
  children: React.ReactNode;
  bgColor?: string;
  className?: string;
  position?: 'top' | 'bottom';
}

const BookCover = React.forwardRef<HTMLDivElement, BookCoverProps>(({
  children,
  bgColor = 'from-amber-800 to-amber-700',
  className = '',
  position = 'top'
}, ref) => {
  return (
    <div 
      className={`page page-cover page-cover-${position} ${className}`} 
      data-density="hard"
      ref={ref}
    >
      <div 
        className={`page-content h-full flex flex-col justify-between p-6 
        text-[#f5edd0] bg-gradient-to-b ${bgColor}`}
        style={{
          height: '100%',
          width: '100%',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden',
          borderRadius: position === 'top' ? '4px 0 0 4px' : '0 4px 4px 0',
          boxShadow: position === 'top' 
            ? 'inset -7px 0 30px -7px rgba(0, 0, 0, 0.4)' 
            : 'inset 7px 0 30px -7px rgba(0, 0, 0, 0.4)',
          textShadow: '0 1px 1px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="book-cover-texture" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/assets/images/leather-texture.png)',
            backgroundSize: 'cover',
            opacity: 0.2,
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }}
        />
        {children}
      </div>
    </div>
  );
});

BookCover.displayName = 'BookCover';

export default BookCover;
// end of frontend/components/book/BookCover.tsx