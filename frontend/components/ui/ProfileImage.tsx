// start of frontend/components/ui/ProfileImage.tsx
import React from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  size = 120,
  className = '',
}) => {
  // Gunakan foto default jika src tidak tersedia
  const imageSrc = src || '/assets/images/profile.png';

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={size}
        height={size}
        className="rounded-md object-cover"
        onError={(e) => {
          // Jika gambar error, gunakan gambar default
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = '/assets/images/profile.png';
        }}
      />
    </div>
  );
};

export default ProfileImage;
// end of frontend/components/ui/ProfileImage.tsx