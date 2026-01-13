import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import type { AnnualGoal } from '../../lib/types';

// Fetch all goals for the user
export function useGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async (): Promise<AnnualGoal[]> => {
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('annual_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data as any[]).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description || '',
        year: row.year,
        status: row.status as 'active' | 'completed' | 'abandoned',
        createdAt: new Date(row.created_at),
        completedAt: row.completed_at ? new Date(row.completed_at) : null,
      }));
    },
    enabled: !!user,
  });
}

// Fetch only active goals
export function useActiveGoals() {
  const { data: goals, ...rest } = useGoals();
  return {
    ...rest,
    data: goals?.filter((g) => g.status === 'active') || [],
  };
}

// Create goal mutation
export function useCreateGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      goal: Omit<AnnualGoal, 'id' | 'userId' | 'createdAt' | 'completedAt'>
    ) => {
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('annual_goals')
        // @ts-expect-error - Supabase type inference issue
        .insert({
          user_id: user.id,
          title: goal.title,
          description: goal.description,
          year: goal.year,
          status: goal.status,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
    },
  });
}

// Update goal mutation
export function useUpdateGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<AnnualGoal, 'id' | 'userId' | 'createdAt'>>;
    }) => {
      if (!user) throw new Error('No user');

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.year !== undefined) updateData.year = updates.year;
      if (updates.status !== undefined) {
        updateData.status = updates.status;
        // Set completed_at timestamp when status changes to completed
        if (updates.status === 'completed' && !updates.completedAt) {
          updateData.completed_at = new Date().toISOString();
        } else if (updates.status !== 'completed') {
          updateData.completed_at = null;
        }
      }
      if (updates.completedAt !== undefined) {
        updateData.completed_at = updates.completedAt
          ? updates.completedAt.toISOString()
          : null;
      }

      const { error } = await supabase
        .from('annual_goals')
        // @ts-expect-error - Supabase type inference issue
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
    },
  });
}

// Delete goal mutation
export function useDeleteGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      if (!user) throw new Error('No user');

      const { error } = await supabase
        .from('annual_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      // Also invalidate projects since they may be linked to this goal
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
    },
  });
}
