// start of frontend/components/bani/ChildCard.tsx
import React from 'react';
import { Person } from '@/types/bani';
import ProfileImage from '@/components/ui/ProfileImage';

interface ChildCardProps {
  child: Person;
  onClick: (id: string) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onClick }) => {
  const randomRotate = React.useMemo(() => {
    const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];
    return rotations[Math.floor(Math.random() * rotations.length)];
  }, []);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`w-full max-w-[150px] mx-auto bg-white/90 shadow-md 
        rounded overflow-hidden transform transition-transform duration-300 
        hover:scale-105 hover:shadow-lg cursor-pointer ${randomRotate}`}
      onClick={() => onClick(child.id)}
    >
      <div className="p-3">
        <ProfileImage 
          src={child.photo} 
          alt={child.name}
          size={100}
          className="mx-auto mb-2"
        />
        <h4 className="font-medium text-center text-sm mb-1 truncate">
          {child.name}
        </h4>
        <p className="text-xs text-gray-600 text-center">
          {formatDate(child.birthDate)}
        </p>
      </div>
    </div>
  );
};

export default ChildCard;
// end of frontend/components/bani/ChildCard.tsx