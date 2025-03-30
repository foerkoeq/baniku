// start of frontend/components/book/BookPage.tsx
'use client';
import React from 'react';

interface BookPageProps {
  children: React.ReactNode;
  number?: number;
  className?: string;
  showFooter?: boolean;
  hardCover?: boolean;
}

const BookPage = React.forwardRef<HTMLDivElement, BookPageProps>(({
  children,
  number,
  className = '',
  showFooter = true,
  hardCover = false
}, ref) => {
  return (
    <div 
      className={`page ${className}`} 
      data-density={hardCover ? "hard" : "soft"}
      ref={ref}
    >
      <div 
        className="page-content"
        style={{
          height: '100%',
          width: '100%',
          padding: '20px',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(to right, #f8f3e8, #fffbf0)',
          borderRadius: '0 2px 2px 0',
          boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)'
        }}
      >
        {children}
        
        {showFooter && number && (
          <div 
            className="page-footer"
            style={{
              marginTop: 'auto',
              paddingTop: '10px',
              borderTop: '1px solid #e0d9c5',
              textAlign: 'center',
              fontSize: '12px',
              color: '#937b62'
            }}
          >
            {number + 1}
          </div>
        )}
      </div>
    </div>
  );
});

BookPage.displayName = 'BookPage';

export default BookPage;
// end of frontend/components/book/BookPage.tsx