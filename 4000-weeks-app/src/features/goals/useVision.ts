import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';

// Fetch user's vision from profile settings
export function useVision() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vision', user?.id],
    queryFn: async (): Promise<string> => {
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const profileData = data as any;
      return profileData?.settings?.vision || '';
    },
    enabled: !!user,
  });
}

// Update user's vision
export function useUpdateVision() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vision: string) => {
      if (!user) throw new Error('No user');

      // First, get current settings
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentSettings = (currentProfile as any)?.settings || {};

      // Update settings with new vision
      const updatedSettings = {
        ...currentSettings,
        vision,
      };

      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase type inference issue
        .update({ settings: updatedSettings })
        .eq('id', user.id);

      if (error) throw error;

      return vision;
    },
    onSuccess: () => {
      // Invalidate vision query to refetch
      queryClient.invalidateQueries({ queryKey: ['vision', user?.id] });
      // Also invalidate profile query if it's cached elsewhere
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });
}
