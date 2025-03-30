// start of frontend/app/(main)/events/page.tsx
'use client';
import React from 'react';
import EventCalendar from '@/components/events/EventCalendar';

const EventPage = () => {
    return (
        <div className="p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Event Keluarga</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Kelola dan lihat jadwal kegiatan keluarga
                </p>
            </div>
            
            <EventCalendar />
        </div>
    );
};

export default EventPage;
// end of frontend/app/(main)/events/page.tsx