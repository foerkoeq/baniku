// start of frontend/hooks/useActivities.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { Activity } from '@/types/activity';

export const useActivities = (limit: number = 5) => {
  return useQuery<Activity[]>({
    queryKey: ['activities', limit],
    queryFn: async () => {
      const { data } = await axios.get('/api/activities', {
        params: { limit }
      });
      return data;
    },
    staleTime: 1000 * 60 * 2, // Cache 2 menit
    refetchInterval: 1000 * 60 * 2, // Refresh setiap 2 menit
  });
};
// end of frontend/hooks/useActivities.ts