// start of frontend/components/events/EventAlerts.tsx
'use client';
import React from 'react';
import Alert from '@/components/ui/alert';
import IconCalendar from '@/components/icon/icon-calendar';
import { EventData } from './types';

interface EventAlertsProps {
  events: EventData[];
  onEventClick: (date: Date) => void;
}

const EventAlerts: React.FC<EventAlertsProps> = ({ events, onEventClick }) => {
  // Filter event Reuni Akbar dan event terdekat
  const mandatoryEvents = events.filter(event => event.type === 'REUNION_AKBAR');
  const upcomingEvents = events
    .filter(event => event.type !== 'REUNION_AKBAR' && new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3); // Ambil 3 event terdekat

  return (
    <div className="space-y-4 mb-6">
      {/* Mandatory Events */}
      {mandatoryEvents.map(event => (
        <Alert
          key={event.id}
          type="solid"
          color="primary"
          icon={<IconCalendar className="w-5 h-5" />}
          className="cursor-pointer"
          onClick={() => onEventClick(new Date(event.startDate))}
          closeBtn={false}
        >
          <div>
            <p className="font-semibold">{event.title}</p>
            <p className="text-sm">
              {new Date(event.startDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </Alert>
      ))}

      {/* Upcoming Events */}
      {upcomingEvents.map(event => (
        <Alert
          key={event.id}
          type="outline"
          color="info"
          icon={<IconCalendar className="w-5 h-5" />}
          className="cursor-pointer"
          onClick={() => onEventClick(new Date(event.startDate))}
        >
          <div>
            <p className="font-semibold">{event.title}</p>
            <p className="text-sm">
              {new Date(event.startDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default EventAlerts;
// end of frontend/components/events/EventAlerts.tsx