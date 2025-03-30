// start of frontend/hooks/useRole.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN_BANI' | 'ADMIN_KELUARGA' | 'MEMBER';

export const useRole = () => {
  const { data: role } = useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data } = await axios.get('/api/me/role');
      return data.role;
    },
    staleTime: Infinity, // Role jarang berubah, jadi cache permanen
  });

  return { role: role || 'MEMBER' }; // Default ke MEMBER untuk safety
};
// end of frontend/hooks/useRole.ts