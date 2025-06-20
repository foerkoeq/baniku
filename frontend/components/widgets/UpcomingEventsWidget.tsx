// start of frontend/components/widgets/UpcomingEventsWidget.tsx
'use client';
import React from 'react';
import BaseWidget from './BaseWidget';
import Alert from '@/components/ui/alert';
import { useUpcomingEvents } from '@/hooks/useUpcomingEvents';
import { formatDate } from '@/utils/format';
import { CalendarIcon, MapPinIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { EventData, EventType } from '@/components/events/types';

// Icon mapper untuk tipe event
const EventTypeIcon = {
  REUNION_AKBAR: '🎉',
  BANI_GATHERING: '👥',
  WEDDING: '💑',
  BIRTHDAY: '🎂',
  OTHER: '📅',
};

const EventCard = ({ event }: { event: EventData }) => {
  const eventDate = new Date(event.startDate);
  
  return (
    <div className="flex items-start gap-4 p-3 border dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary transition-colors">
      {/* Tanggal */}
      <div className="flex-shrink-0 text-center">
        <div className="text-2xl font-bold text-primary">
          {eventDate.getDate()}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {eventDate.toLocaleString('id-ID', { month: 'short' })}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {eventDate.getFullYear()}
        </div>
      </div>

      {/* Detail Event */}
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <span>{EventTypeIcon[event.type]}</span>
          <h6 className="font-semibold text-sm">{event.title}</h6>
        </div>
        
        {event.location && (
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <MapPinIcon className="w-3 h-3 mr-1" />
            <span>{event.location}</span>
          </div>
        )}

        {/* Jika event memiliki committee/host */}
        {event.committee?.hostBaniId && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Diselenggarakan oleh: {event.committee.hostBaniId}
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    ))}
  </div>
);

const UpcomingEventsWidget = () => {
  const { data: events, isLoading, error } = useUpcomingEvents();

  if (error) {
    return (
      <BaseWidget title="Event Mendatang">
        <Alert 
          type="default"
          color="danger"
          closeBtn={false}
          >
          Gagal memuat data event
        </Alert>
      </BaseWidget>
    );
  }

  return (
    <BaseWidget 
      title="Event Mendatang" 
      isLoading={isLoading}
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4">
          {/* Event List */}
          {events && events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Alert
              type="default"
              color="info"
              closeBtn={false}>
                Tidak ada event mendatang
            </Alert>
          )}

          {/* Link to Event Page */}
          <Link 
            href="/events" 
            className="flex items-center justify-end text-sm text-primary hover:underline mt-4"
          >
            Lihat Semua Event
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}
    </BaseWidget>
  );
};

export default UpcomingEventsWidget;
// end of frontend/components/widgets/UpcomingEventsWidget.tsx