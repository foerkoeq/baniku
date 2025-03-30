// start of frontend/components/bani/ChildrenGrid.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Child {
  id: string;
  name: string;
  birthDate: string;
  photo: string;
}

interface ChildrenGridProps {
  children: Child[];
  columns?: 2 | 3 | 4;
  showAsBook?: boolean;
}

const ChildrenGrid: React.FC<ChildrenGridProps> = ({ 
  children,
  columns = 4,
  showAsBook = false 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Column class mapping
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4`}>
      {children.map((child) => (
        <Link 
          key={child.id}
          href={`/bani-story/${child.id}`}
          className={`group ${showAsBook ? 'pointer-events-none' : ''}`}
          onClick={showAsBook ? (e) => e.preventDefault() : undefined}
        >
          <div className={`
            bg-white dark:bg-gray-800 rounded-lg overflow-hidden 
            ${showAsBook 
              ? 'shadow-sm border border-amber-100' 
              : 'shadow-md hover:-translate-y-1 hover:shadow-lg'} 
            transition-transform duration-300 
          `}>
            {/* Foto */}
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={child.photo}
                alt={child.name}
                width={showAsBook ? 120 : 200}
                height={showAsBook ? 120 : 200}
                className={`
                  object-cover w-full h-full
                  ${showAsBook ? '' : 'transition-transform duration-300 group-hover:scale-110'}
                `}
              />
            </div>
            
            {/* Info */}
            <div className={`p-3 ${showAsBook ? 'p-2' : 'p-4'}`}>
              <h4 className={`
                font-semibold truncate
                ${showAsBook ? 'text-sm' : 'text-lg mb-1'}
              `}>
                {child.name}
              </h4>
              <p className={`
                text-gray-600 dark:text-gray-400
                ${showAsBook ? 'text-xs' : 'text-sm'}
              `}>
                {formatDate(child.birthDate)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChildrenGrid;
// end of frontend/components/bani/ChildrenGrid.tsx