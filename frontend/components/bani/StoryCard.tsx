// start of frontend/components/bani/StoryCard.tsx
import React from 'react';
import Image from 'next/image';

interface StoryCardProps {
  title: string;
  husbandPhoto: string;
  wifePhoto: string;
  story: string;
  childrenCount: number;
}

const StoryCard: React.FC<StoryCardProps> = ({
  title,
  husbandPhoto,
  wifePhoto,
  story,
  childrenCount
}) => {
  return (
    <div className="font-serif">
      {/* Header dengan judul */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold font-serif italic">{title}</h2>
      </div>

      {/* Konten */}
      <div>
        {/* Foto Suami Istri */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12 mb-12">
          <div className="text-center">
            <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-lg overflow-hidden 
              shadow-[0_0_10px_rgba(0,0,0,0.1)] 
              transform rotate-[-3deg]">
              <Image
                src={husbandPhoto}
                alt="Foto Suami"
                width={192}
                height={192}
                className="object-cover w-full h-full 
                  transition-transform duration-300 hover:scale-110"
              />
            </div>
            <span className="mt-4 block text-sm text-gray-600 
              dark:text-gray-400 italic">Suami</span>
          </div>
          <div className="text-center">
            <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-lg overflow-hidden 
              shadow-[0_0_10px_rgba(0,0,0,0.1)]
              transform rotate-[3deg]">
              <Image
                src={wifePhoto}
                alt="Foto Istri"
                width={192}
                height={192}
                className="object-cover w-full h-full
                  transition-transform duration-300 hover:scale-110"
              />
            </div>
            <span className="mt-4 block text-sm text-gray-600 
              dark:text-gray-400 italic">Istri</span>
          </div>
        </div>

        {/* Cerita */}
        <div className="prose prose-sm md:prose-lg dark:prose-invert max-w-none
          first-letter:text-3xl sm:first-letter:text-4xl first-letter:font-bold 
          first-letter:float-left first-letter:mr-3">
          <p className="text-justify leading-relaxed">{story}</p>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
// end of frontend/components/bani/StoryCard.tsx