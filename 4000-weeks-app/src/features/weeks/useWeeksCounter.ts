import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { differenceInWeeks, parseISO } from 'date-fns';

const EXPECTED_LIFESPAN_WEEKS = 4000;

interface WeeksData {
  weeksLived: number;
  weeksRemaining: number;
  totalWeeks: number;
  percentage: number;
  birthDate: Date | null;
}

export function useWeeksCounter() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['weeksCounter', user?.id],
    queryFn: async (): Promise<WeeksData> => {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Fetch user profile with birth date
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('birth_date')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const profileData = profile as any;

      if (!profileData.birth_date) {
        return {
          weeksLived: 0,
          weeksRemaining: EXPECTED_LIFESPAN_WEEKS,
          totalWeeks: EXPECTED_LIFESPAN_WEEKS,
          percentage: 0,
          birthDate: null,
        };
      }

      const birthDate = parseISO(profileData.birth_date);
      const today = new Date();
      const weeksLived = differenceInWeeks(today, birthDate);
      const weeksRemaining = Math.max(0, EXPECTED_LIFESPAN_WEEKS - weeksLived);
      const percentage = (weeksLived / EXPECTED_LIFESPAN_WEEKS) * 100;

      return {
        weeksLived,
        weeksRemaining,
        totalWeeks: EXPECTED_LIFESPAN_WEEKS,
        percentage: Math.min(100, percentage),
        birthDate,
      };
    },
    enabled: !!user,
  });
}
