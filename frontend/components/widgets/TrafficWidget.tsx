// start of frontend/components/widgets/TrafficWidget.tsx
'use client';
import React from 'react';
import BaseWidget from './BaseWidget';
import Alert from '@/components/ui/alert';
import Counter from '@/components/ui/Counter';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Clock, TrendingUp, Activity } from 'lucide-react';
import { useTrafficStats } from '@/hooks/useTrafficStats';

interface TrafficStats {
  dailyVisitors: number;
  weeklyVisitors: number;
  monthlyVisitors: number;
  activeUsers: number;
  avgDuration: number;
  hourlyData: {
    hour: string;
    visitors: number;
  }[];
}

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  subtitle 
}: { 
  title: string;
  value: number;
  icon: React.ReactNode;
  subtitle?: string;
}) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <div className="text-gray-500 dark:text-gray-400">
        {icon}
      </div>
      <Counter
        start={0}
        end={value}
        duration={2}
        className="text-2xl font-bold text-gray-900 dark:text-white"
      />
    </div>
    <h6 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h6>
    {subtitle && (
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
    )}
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      ))}
    </div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
);

const TrafficWidget = () => {
  const { data: stats, isLoading, error } = useTrafficStats();

  if (error) {
    return (
      <BaseWidget title="Statistik Traffic">
        <Alert 
          type="default"
          color="danger"
          closeBtn={false}
        >
          Gagal memuat statistik traffic
        </Alert>
      </BaseWidget>
    );
  }

  return (
    <BaseWidget 
      title="Statistik Traffic" 
      isLoading={isLoading}
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : stats ? (
        <div className="space-y-6">
          {/* Statistik Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              title="Pengunjung Hari Ini"
              value={stats.dailyVisitors}
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Pengunjung Minggu Ini"
              value={stats.weeklyVisitors}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatsCard
              title="Pengguna Aktif"
              value={stats.activeUsers}
              icon={<Activity className="h-5 w-5" />}
            />
            <StatsCard
              title="Rata-rata Durasi"
              value={stats.avgDuration}
              icon={<Clock className="h-5 w-5" />}
              subtitle="menit per kunjungan"
            />
          </div>

          {/* Traffic Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.hourlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4361ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4361ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#4361ee"
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </BaseWidget>
  );
};

export default TrafficWidget;
// end of frontend/components/widgets/TrafficWidget.tsx