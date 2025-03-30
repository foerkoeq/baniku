// start of frontend/hooks/useDemographics.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface DemographicsData {
  ageDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  genderDistribution: {
    name: string;
    value: number;
    percentage: number;
  }[];
  maritalStatus: {
    name: string;
    value: number;
    percentage: number;
  }[];
  locationDistribution: {
    province: string;
    count: number;
    percentage: number;
  }[];
}

export const useDemographics = () => {
  return useQuery<DemographicsData>({
    queryKey: ['demographics'],
    queryFn: async () => {
      const { data } = await axios.get('/api/analytics/demographics');
      return data;
    },
    staleTime: 1000 * 60 * 30, // Cache 30 menit
    refetchInterval: 1000 * 60 * 30, // Refresh setiap 30 menit
  });
};
// end of frontend/hooks/useDemographics.ts