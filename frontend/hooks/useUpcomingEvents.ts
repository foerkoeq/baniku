// start of frontend/hooks/useUpcomingEvents.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { EventData } from '@/components/events/types';

export const useUpcomingEvents = () => {
  return useQuery<EventData[]>({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      const { data } = await axios.get('/api/events/upcoming');
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    refetchInterval: 1000 * 60 * 5, // Refresh setiap 5 menit
  });
};
// end of frontend/hooks/useUpcomingEvents.ts