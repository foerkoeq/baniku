// start of frontend/components/widgets/FamilyStatsWidget.tsx
'use client';
import React from 'react';
import BaseWidget from './BaseWidget';
import Counter from '@/components/ui/Counter';
import { UsersIcon } from 'lucide-react';
import { useFamilyStats } from '@/hooks/useFamilystats'; 
import { FamilyStats } from '@/types/family';

interface BaniStatProps {
  name: string;
  totalPeople: number;
  totalFamilies: number;
}

const BaniStat: React.FC<BaniStatProps> = ({ name, totalPeople, totalFamilies }) => (
  <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg mb-2">
    <div>
      <h6 className="text-sm font-semibold">{name}</h6>
      <div className="flex items-center gap-4 mt-1">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">{totalPeople}</span> orang
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">{totalFamilies}</span> keluarga
        </p>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      ))}
    </div>
  </div>
);

const FamilyStatsWidget = () => {
  const { data: stats, isLoading, error } = useFamilyStats();

  if (error) {
    return (
      <BaseWidget title="Jumlah Keluarga">
        <div className="text-center text-red-500 dark:text-red-400">
          Gagal memuat data keluarga
        </div>
      </BaseWidget>
    );
  }

  return (
    <BaseWidget 
      title="Jumlah Keluarga" 
      isLoading={isLoading}
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div>
          {/* Main Family Stats */}
          <div className="bg-primary/10 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4">
              <Counter
                start={0}
                end={stats?.totalPeople || 0}
                duration={2}
                title="Total Anggota"
                icon={<UsersIcon />}
                variant="square"
                color="primary"
              />
              <Counter
                start={0}
                end={stats?.totalFamilies || 0}
                duration={2}
                title="Total Keluarga"
                icon={<UsersIcon />}
                variant="square"
                color="success"
              />
            </div>
          </div>

          {/* Sub Families Stats */}
          <div className="max-h-[300px] overflow-y-auto pr-2">
            {stats?.subFamilies.map((bani) => (
              <BaniStat
                key={bani.id}
                name={bani.name}
                totalPeople={bani.totalPeople}
                totalFamilies={bani.totalFamilies}
              />
            ))}
          </div>
        </div>
      )}
    </BaseWidget>
  );
};

export default FamilyStatsWidget;
// end of frontend/components/widgets/FamilyStatsWidget.tsx