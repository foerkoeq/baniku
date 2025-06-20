// start of frontend/hooks/useTrafficStats.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

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

export const useTrafficStats = () => {
  return useQuery<TrafficStats>({
    queryKey: ['trafficStats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/analytics/traffic');
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    refetchInterval: 1000 * 60 * 5, // Refresh setiap 5 menit
  });
};
// end of frontend/hooks/useTrafficStats.ts