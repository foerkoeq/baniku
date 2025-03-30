// start of frontend/components/widgets/UserStatsWidget.tsx
'use client';
import React from 'react';
import BaseWidget from './BaseWidget';
import Alert from '@/components/ui/alert';
import { useUserStats } from '@/hooks/useUserStats'; // akan kita buat
import Counter from '@/components/ui/Counter';
import { Shield, Users, User } from 'lucide-react';

interface UserStats {
  totalUsers: number;
  superAdmins: number;
  admins: number;
  members: number;
  activeUsers: number;
  inactiveUsers: number;
  lastMonthRegistrations: number;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className={`p-4 rounded-lg ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <h6 className="text-sm font-semibold mb-4">{title}</h6>
        <Counter
          start={0}
          end={value}
          duration={2}
          className="text-2xl font-bold"
        />
      </div>
      <div className="p-3 bg-white/10 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    ))}
  </div>
);

const UserStatsWidget = () => {
  const { data: stats, isLoading, error } = useUserStats();

  if (error) {
    return (
      <BaseWidget title="Statistik Pengguna">
        <Alert 
          type="default"
          color="danger"
          closeBtn={false}
        >
          Gagal memuat statistik pengguna
        </Alert>
      </BaseWidget>
    );
  }

  return (
    <BaseWidget 
      title="Statistik Pengguna" 
      isLoading={isLoading}
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Pengguna"
            value={stats.totalUsers}
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-primary text-white"
          />
          <StatCard
            title="Super Admin"
            value={stats.superAdmins}
            icon={<Shield className="h-6 w-6 text-white" />}
            color="bg-warning text-white"
          />
          <StatCard
            title="Admin Bani"
            value={stats.admins}
            icon={<Shield className="h-6 w-6 text-white" />}
            color="bg-success text-white"
          />
          <StatCard
            title="Member"
            value={stats.members}
            icon={<User className="h-6 w-6 text-white" />}
            color="bg-info text-white"
          />
          <StatCard
            title="Pengguna Aktif"
            value={stats.activeUsers}
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-secondary text-white"
          />
          <StatCard
            title="Registrasi Bulan Ini"
            value={stats.lastMonthRegistrations}
            icon={<User className="h-6 w-6 text-white" />}
            color="bg-danger text-white"
          />
        </div>
      ) : null}
    </BaseWidget>
  );
};

export default UserStatsWidget;
// end of frontend/components/widgets/UserStatsWidget.tsx