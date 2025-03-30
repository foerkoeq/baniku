'use client';
import React from 'react';
import IconPlay from '@/components/icon/icon-play-circle';

export interface TutorialVideo {
    id: string;
    title: string;
    thumbnail: string;
    videoUrl: string;
}

interface VideoTutorialProps {
    items: TutorialVideo[];
    onVideoSelect: (videoId: string) => void;
    className?: string;
}

const VideoTutorial: React.FC<VideoTutorialProps> = ({ 
    items, 
    onVideoSelect,
    className = '' 
}) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {items.map((video) => (
                <div 
                    key={video.id}
                    className="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors"
                >
                    <div className="aspect-video relative">
                        <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={() => onVideoSelect(video.id)}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <IconPlay className="w-16 h-16 text-white" />
                        </button>
                    </div>
                    <div className="p-4">
                        <h3 className="font-medium text-lg">{video.title}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VideoTutorial;