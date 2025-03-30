// start of frontend/app/(main)/settings/page.tsx
'use client';
import React, { useState } from 'react';
import ProfileTab from '@/components/settings/ProfileTab';
import SecurityTab from '@/components/settings/SecurityTab';
import NotificationTab from '@/components/settings/NotificationTab';

const tabs = [
    {
        id: 'profile',
        label: 'Profil',
        component: ProfileTab
    },
    {
        id: 'security',
        label: 'Keamanan',
        component: SecurityTab
    },
    {
        id: 'notification',
        label: 'Notifikasi',
        component: NotificationTab
    }
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ProfileTab;

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Pengaturan</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Kelola preferensi dan pengaturan akun Anda
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-5 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium 
                                ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                <ActiveComponent />
            </div>
        </div>
    );
}
// end of frontend/app/(main)/settings/page.tsx