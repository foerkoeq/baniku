// start of frontend/components/widgets/ActivityFeedWidget.tsx
'use client';
import React from 'react';
import BaseWidget from './BaseWidget';
import Alert from '@/components/ui/alert';
import { formatDate } from '@/utils/format';
import { useActivities } from '@/hooks/useActivities';
import { Activity, ActivityType } from '@/types/activity'; 
import { 
  UserPlus, 
  UserCog, 
  Users, 
  Calendar, 
  Image as ImageIcon,
  Edit 
} from 'lucide-react';

const ActivityIcon = {
  NEW_MEMBER: <UserPlus className="h-4 w-4" />,
  UPDATE_MEMBER: <UserCog className="h-4 w-4" />,
  NEW_FAMILY: <Users className="h-4 w-4" />,
  NEW_EVENT: <Calendar className="h-4 w-4" />,
  UPDATE_EVENT: <Calendar className="h-4 w-4" />,
  NEW_PHOTO: <ImageIcon className="h-4 w-4" />,
  UPDATE_STORY: <Edit className="h-4 w-4" />
};

const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <div className="group relative flex items-center py-2">
      {/* Icon & Line */}
      <div className="relative z-10 shrink-0 before:absolute before:left-4 before:top-10 before:h-[calc(100%-24px)] before:w-[2px] before:bg-white-dark/30 ltr:mr-2 rtl:ml-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
          {ActivityIcon[activity.type]}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-800 dark:text-white">
          {activity.title}
        </p>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <span className="text-xs">{formatDate(activity.createdAt, 'full')}</span>
          {activity.baniName && (
            <>
              <span className="text-xs">•</span>
              <span className="text-xs">{activity.baniName}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1">
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
        </div>
      </div>
    ))}
  </div>
);

const getActivityColor = (type: ActivityType): string => {
  const colors = {
    NEW_MEMBER: 'bg-success-light text-success dark:bg-success dark:text-success-light',
    UPDATE_MEMBER: 'bg-info-light text-info dark:bg-info dark:text-info-light',
    NEW_FAMILY: 'bg-primary-light text-primary dark:bg-primary dark:text-primary-light',
    NEW_EVENT: 'bg-warning-light text-warning dark:bg-warning dark:text-warning-light',
    UPDATE_EVENT: 'bg-warning-light text-warning dark:bg-warning dark:text-warning-light',
    NEW_PHOTO: 'bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light',
    UPDATE_STORY: 'bg-info-light text-info dark:bg-info dark:text-info-light'
  };
  return colors[type];
};

const ActivityFeedWidget = () => {
  const { data: activities, isLoading, error } = useActivities();

  if (error) {
    return (
      <BaseWidget title="Aktivitas Terbaru">
        <Alert 
          type="default"
          color="danger"
          closeBtn={false}
        >
          Gagal memuat data aktivitas
        </Alert>
      </BaseWidget>
    );
  }

  return (
    <BaseWidget 
      title="Aktivitas Terbaru" 
      isLoading={isLoading}
    >
      <div className="relative">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-1">
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <Alert 
                type="default"
                color="info"
                closeBtn={false}
              >
                Belum ada aktivitas
              </Alert>
            )}
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

export default ActivityFeedWidget;
// end of frontend/components/widgets/ActivityFeedWidget.tsx