// start of frontend/hooks/useUpcomingBirthdays.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface BirthdayPerson {
  id: string;
  fullName: string;
  birthDate: Date;
  photoUrl?: string;
  baniName: string;
  daysUntilBirthday: number;
  upcomingAge: number;
}

type DateRange = '7days' | '14days' | '30days' | '90days';

export const useUpcomingBirthdays = (dateRange: DateRange) => {
  return useQuery<BirthdayPerson[]>({
    queryKey: ['upcomingBirthdays', dateRange],
    queryFn: async () => {
      const { data } = await axios.get('/api/people/birthdays', {
        params: { range: dateRange }
      });
      return data;
    },
    staleTime: 1000 * 60 * 15, // Cache 15 menit
    refetchInterval: 1000 * 60 * 15, // Refresh setiap 15 menit
  });
};
// end of frontend/hooks/useUpcomingBirthdays.ts