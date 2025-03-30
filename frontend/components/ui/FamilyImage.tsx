// start of frontend/components/ui/FamilyImage.tsx
import React from 'react';
import Image from 'next/image';

interface FamilyImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const FamilyImage: React.FC<FamilyImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
}) => {
  // Gunakan foto default jika src tidak tersedia
  const imageSrc = src || '/assets/images/family.png';

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className="rounded-md object-cover"
        onError={(e) => {
          // Jika gambar error, gunakan gambar default
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = '/assets/images/family.png';
        }}
      />
    </div>
  );
};

export default FamilyImage;
// end of frontend/components/ui/FamilyImage.tsx