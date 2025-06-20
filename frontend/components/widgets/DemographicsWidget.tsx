// start of frontend/components/widgets/DemographicsWidget.tsx
'use client';
import React, { useState } from 'react';
import BaseWidget from './BaseWidget';
import Alert from '@/components/ui/alert';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { useDemographics } from '@/hooks/useDemographics';

// Warna untuk charts
const COLORS = ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#ffd700'];

interface TabProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ isActive, onClick, children }) => (
  <button
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
      ${isActive 
        ? 'bg-primary text-white' 
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border dark:border-gray-700 rounded shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {`${payload[0].value} orang (${payload[0].payload.percentage}%)`}
        </p>
      </div>
    );
  }
  return null;
};

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-72"></div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
);

const DemographicsWidget = () => {
  const [activeTab, setActiveTab] = useState<'age' | 'gender' | 'marital' | 'location'>('age');
  const { data: demographics, isLoading, error } = useDemographics();

  if (error) {
    return (
      <BaseWidget title="Statistik Demografi">
        <Alert 
          type="default"
          color="danger"
          closeBtn={false}
        >
          Gagal memuat data demografi
        </Alert>
      </BaseWidget>
    );
  }

  const renderChart = () => {
    if (!demographics) return null;

    switch (activeTab) {
      case 'age':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demographics.ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#4361ee">
                {demographics.ageDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'gender':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demographics.genderDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
              >
                {demographics.genderDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'marital':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demographics.maritalStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
              >
                {demographics.maritalStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'location':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demographics.locationDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="province" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#4361ee">
                {demographics.locationDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <BaseWidget 
      title="Statistik Demografi" 
      isLoading={isLoading}
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : demographics ? (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2">
            <Tab 
              isActive={activeTab === 'age'} 
              onClick={() => setActiveTab('age')}
            >
              Usia
            </Tab>
            <Tab 
              isActive={activeTab === 'gender'} 
              onClick={() => setActiveTab('gender')}
            >
              Jenis Kelamin
            </Tab>
            <Tab 
              isActive={activeTab === 'marital'} 
              onClick={() => setActiveTab('marital')}
            >
              Status Pernikahan
            </Tab>
            <Tab 
              isActive={activeTab === 'location'} 
              onClick={() => setActiveTab('location')}
            >
              Lokasi
            </Tab>
          </div>

          {/* Chart Area */}
          <div className="pt-4">
            {renderChart()}
          </div>
        </div>
      ) : null}
    </BaseWidget>
  );
};

export default DemographicsWidget;
// end of frontend/components/widgets/DemographicsWidget.tsx