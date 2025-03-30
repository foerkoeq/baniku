// start of frontend/app/(main)/page.tsx
'use client';
import React from 'react';
import { useRole } from '@/hooks/useRole';
import DraggableGrid from '@/components/widgets/DraggableGrid';

// Import semua widget
import UserStatsWidget from '@/components/widgets/UserStatsWidget';
import TrafficWidget from '@/components/widgets/TrafficWidget';
import QuickActionsWidget from '@/components/widgets/QuickActionWidget';
import FamilyStatsWidget from '@/components/widgets/FamilyStatsWidget';
import ActivityFeedWidget from '@/components/widgets/ActivityFeedWidget';
import UpcomingEventsWidget from '@/components/widgets/UpcomingEventsWidget';
import PopularStoriesWidget from '@/components/widgets/PopularStoriesWidget';
import DemographicsWidget from '@/components/widgets/DemographicsWidget';
import UpcomingBirthdaysWidget from '@/components/widgets/UpcomingBirthdaysWidget';

const Dashboard = () => {
    const { role } = useRole();
    const isSuperAdmin = role === 'SUPER_ADMIN';

    // Widget untuk Super Admin
    const superAdminWidgets = [
        <UserStatsWidget key="user-stats" />,
        <TrafficWidget key="traffic" />,
        <QuickActionsWidget key="quick-actions" />,
        <FamilyStatsWidget key="family-stats" />,
        <ActivityFeedWidget key="activity-feed" />,
        <UpcomingEventsWidget key="upcoming-events" />,
        <PopularStoriesWidget key="popular-stories" />,
        <DemographicsWidget key="demographics" />,
        <UpcomingBirthdaysWidget key="upcoming-birthdays" />
    ];

    // Widget untuk Admin & Member
    const regularWidgets = [
        <QuickActionsWidget key="quick-actions" />,
        <FamilyStatsWidget key="family-stats" />,
        <ActivityFeedWidget key="activity-feed" />,
        <UpcomingEventsWidget key="upcoming-events" />,
        <PopularStoriesWidget key="popular-stories" />,
        <DemographicsWidget key="demographics" />,
        <UpcomingBirthdaysWidget key="upcoming-birthdays" />
    ];

    const handleOrderChange = (newOrder: number[]) => {
        // TODO: Simpan urutan widget ke local storage atau backend
        console.log('New widget order:', newOrder);
    };

    return (
        <div className="p-4 lg:p-6">
            {/* Selamat datang */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Selamat Datang
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Berikut adalah ringkasan data dan aktivitas keluarga besar.
                </p>
            </div>

            {/* Grid Widget */}
            <DraggableGrid 
                onOrderChange={handleOrderChange}
            >
                {isSuperAdmin ? superAdminWidgets : regularWidgets}
            </DraggableGrid>
        </div>
    );
};

export default Dashboard;
// end of frontend/app/(main)/page.tsx