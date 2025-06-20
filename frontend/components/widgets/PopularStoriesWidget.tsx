// start of frontend/components/widgets/PopularStoriesWidget.tsx
'use client';
import React from 'react';
import BaseWidget from './BaseWidget';
import Alert from '@/components/ui/alert';
import Link from 'next/link';
import { ArrowRight, Eye, Star, Clock } from 'lucide-react';
import { usePopularStories } from '@/hooks/usePopularStories'; // akan kita buat
import { formatDate } from '@/utils/format';

interface Story {
  id: string;
  title: string;
  baniId: string;
  baniName: string;
  viewCount: number;
  createdAt: Date;
  excerpt?: string;
}

const StoryCard = ({ story }: { story: Story }) => (
  <div className="p-3 border dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary transition-colors">
    <h6 className="font-semibold text-sm line-clamp-2">
      {story.title}
    </h6>
    
    {story.excerpt && (
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
        {story.excerpt}
      </p>
    )}

    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-1">
        <Eye className="w-3 h-3" />
        <span>{story.viewCount}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>{formatDate(story.createdAt, 'short')}</span>
      </div>
      <div className="flex-1 text-right">
        {story.baniName}
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const PopularStoriesWidget = () => {
  const { data: stories, isLoading, error } = usePopularStories();

  if (error) {
    return (
      <BaseWidget title="Cerita Populer">
        <Alert 
          type="default"
          color="danger"
          closeBtn={false}
        >
          Gagal memuat data cerita
        </Alert>
      </BaseWidget>
    );
  }

  return (
    <BaseWidget 
      title="Cerita Populer" 
      isLoading={isLoading}
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4">
          {stories && stories.length > 0 ? (
            <div className="space-y-3">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <Alert 
              type="default"
              color="info"
              closeBtn={false}
            >
              Belum ada cerita
            </Alert>
          )}

          <Link 
            href="/bani-story" 
            className="flex items-center justify-end text-sm text-primary hover:underline mt-4"
          >
            Lihat Semua Cerita
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}
    </BaseWidget>
  );
};

export default PopularStoriesWidget;
// end of frontend/components/widgets/PopularStoriesWidget.tsx