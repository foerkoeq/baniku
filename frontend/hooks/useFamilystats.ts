// start of frontend/hooks/useFamilyStats.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { FamilyStats } from '@/types/family';

export const useFamilyStats = () => {
  return useQuery<FamilyStats>({
    queryKey: ['familyStats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/family/stats');
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
    refetchInterval: 1000 * 60 * 5, // Refresh setiap 5 menit
  });
};
// end of frontend/hooks/useFamilyStats.ts