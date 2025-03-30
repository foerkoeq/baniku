// start of frontend/components/ui/OrnamentalDivider.tsx
'use client';
import React from 'react';

interface OrnamentalDividerProps {
  symbol?: string;
  className?: string;
  lineColor?: string;
  symbolSize?: 'sm' | 'md' | 'lg';
  lineWidth?: 'thin' | 'normal' | 'thick';
}

const OrnamentalDivider: React.FC<OrnamentalDividerProps> = ({
  symbol = '❦',
  className = '',
  lineColor = 'currentColor',
  symbolSize = 'md',
  lineWidth = 'normal',
}) => {
  // Mendapatkan class untuk ukuran simbol
  const getSymbolSizeClass = () => {
    switch (symbolSize) {
      case 'sm':
        return 'text-base';
      case 'lg':
        return 'text-2xl';
      case 'md':
      default:
        return 'text-xl';
    }
  };

  // Mendapatkan class untuk ketebalan garis
  const getLineWidthClass = () => {
    switch (lineWidth) {
      case 'thin':
        return 'h-px';
      case 'thick':
        return 'h-0.5';
      case 'normal':
      default:
        return 'h-[1px]';
    }
  };

  return (
    <div className={`flex items-center justify-center my-4 ${className}`}>
      <div 
        className={`w-1/3 ${getLineWidthClass()} bg-current opacity-30`}
        style={{ backgroundColor: lineColor }}
      ></div>
      <div className={`mx-4 ${getSymbolSizeClass()}`}>{symbol}</div>
      <div 
        className={`w-1/3 ${getLineWidthClass()} bg-current opacity-30`}
        style={{ backgroundColor: lineColor }}
      ></div>
    </div>
  );
};

export default OrnamentalDivider;
// end of frontend/components/ui/OrnamentalDivider.tsx