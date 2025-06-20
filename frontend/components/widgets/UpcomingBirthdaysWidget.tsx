// start of frontend/components/widgets/UpcomingBirthdaysWidget.tsx
'use client';
import React, { useState } from 'react';
import BaseWidget from './BaseWidget';
import Alert from '@/components/ui/alert';
import { useUpcomingBirthdays } from '@/hooks/useUpcomingBirthdays';
import { formatDate } from '@/utils/format';
import { Gift, Calendar, ChevronDown } from 'lucide-react';
import Link from 'next/link';

type DateRange = '7days' | '14days' | '30days' | '90days';

interface BirthdayPerson {
  id: string;
  fullName: string;
  birthDate: Date;
  photoUrl?: string;
  baniName: string;
  daysUntilBirthday: number;
  upcomingAge: number;
}

const BirthdayCard = ({ person }: { person: BirthdayPerson }) => (
  <div className="flex items-center gap-4 p-3 border dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary transition-colors">
    {/* Avatar */}
    <div className="relative">
      {person.photoUrl ? (
        <img 
          src={person.photoUrl} 
          alt={person.fullName}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">
            {person.fullName.charAt(0)}
          </span>
        </div>
      )}
      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
        <Gift className="w-3 h-3" />
      </div>
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <Link 
        href={`/family-tree/${person.id}`}
        className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
      >
        {person.fullName}
      </Link>
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(person.birthDate, 'long')}</span>
        </div>
        <p className="line-clamp-1">{person.baniName}</p>
      </div>
    </div>

    {/* Countdown & Age */}
    <div className="text-right">
      <div className="text-sm font-medium text-primary">
        {person.daysUntilBirthday === 0 ? (
          'Hari ini!'
        ) : (
          `${person.daysUntilBirthday} hari`
        )}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Usia {person.upcomingAge}
      </div>
    </div>
  </div>
);

const DateRangeSelector = ({ 
  value, 
  onChange 
}: { 
  value: DateRange;
  onChange: (value: DateRange) => void;
}) => (
  <div className="w-full sm:w-48">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as DateRange)}
      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="7days">7 Hari Kedepan</option>
      <option value="14days">14 Hari Kedepan</option>
      <option value="30days">30 Hari Kedepan</option>
      <option value="90days">90 Hari Kedepan</option>
    </select>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-48"></div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 p-3 border dark:border-gray-700 rounded-lg">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    ))}
  </div>
);

const UpcomingBirthdaysWidget = () => {
  const [dateRange, setDateRange] = useState<DateRange>('7days');
  const { data: birthdays, isLoading, error } = useUpcomingBirthdays(dateRange);

  if (error) {
    return (
      <BaseWidget title="Ulang Tahun Mendatang">
        <Alert 
          type="default"
          color="danger"
          closeBtn={false}
        >
          Gagal memuat data ulang tahun
        </Alert>
      </BaseWidget>
    );
  }

  return (
    <BaseWidget 
      title="Ulang Tahun Mendatang" 
      isLoading={isLoading}
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4">
          {/* Filter */}
          <DateRangeSelector 
            value={dateRange}
            onChange={setDateRange}
          />

          {/* Birthday List */}
          <div className="space-y-3">
            {birthdays && birthdays.length > 0 ? (
              birthdays.map((person) => (
                <BirthdayCard key={person.id} person={person} />
              ))
            ) : (
              <Alert 
                type="default"
                color="info"
                closeBtn={false}
              >
                Tidak ada ulang tahun dalam {dateRange.replace('days', ' hari')} kedepan
              </Alert>
            )}
          </div>
        </div>
      )}
    </BaseWidget>
  );
};

export default UpcomingBirthdaysWidget;
// end of frontend/components/widgets/UpcomingBirthdaysWidget.tsx