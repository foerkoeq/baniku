// start of frontend/hooks/useUserStats.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface UserStats {
  totalUsers: number;
  superAdmins: number;
  admins: number;
  members: number;
  activeUsers: number;
  inactiveUsers: number;
  lastMonthRegistrations: number;
}

export const useUserStats = () => {
  return useQuery<UserStats>({
    queryKey: ['userStats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users/stats');
      return data;
    },
    staleTime: 1000 * 60 * 15, // Cache 15 menit
    refetchInterval: 1000 * 60 * 15, // Refresh setiap 15 menit
  });
};
// end of frontend/hooks/useUserStats.ts