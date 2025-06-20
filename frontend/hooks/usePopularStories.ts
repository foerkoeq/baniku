// start of frontend/hooks/usePopularStories.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface Story {
  id: string;
  title: string;
  baniId: string;
  baniName: string;
  viewCount: number;
  createdAt: Date;
  excerpt?: string;
}

export const usePopularStories = (limit: number = 3) => {
  return useQuery<Story[]>({
    queryKey: ['popularStories', limit],
    queryFn: async () => {
      const { data } = await axios.get('/api/stories/popular', {
        params: { limit }
      });
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    refetchInterval: 1000 * 60 * 5, // Refresh setiap 5 menit
  });
};
// end of frontend/hooks/usePopularStories.ts