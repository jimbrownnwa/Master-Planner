import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import type { Project } from '../../lib/types';

// Fetch all projects
export function useProjects() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async (): Promise<Project[]> => {
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) throw error;

      return (data as any[]).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        goalId: row.goal_id,
        title: row.title,
        description: row.description || '',
        status: row.status as 'active' | 'parked' | 'completed' | 'abandoned',
        isLifeOps: row.is_life_ops,
        position: row.position,
        color: row.color,
        createdAt: new Date(row.created_at),
        archivedAt: row.archived_at ? new Date(row.archived_at) : null,
        completionNotes: row.completion_notes,
      }));
    },
    enabled: !!user,
  });
}

// Fetch active projects only
export function useActiveProjects() {
  const { data: projects, ...rest } = useProjects();
  return {
    ...rest,
    data: projects?.filter((p) => p.status === 'active') || [],
  };
}

// Fetch parked projects
export function useParkedProjects() {
  const { data: projects, ...rest } = useProjects();
  return {
    ...rest,
    data: projects?.filter((p) => p.status === 'parked') || [],
  };
}

// Create project mutation
export function useCreateProject() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'archivedAt' | 'completionNotes'>
    ) => {
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          goal_id: project.goalId,
          title: project.title,
          description: project.description,
          status: project.status,
          is_life_ops: project.isLifeOps,
          position: project.position,
          color: project.color,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Update project mutation
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>;
    }) => {
      const dbUpdates: any = {};

      if (updates.goalId !== undefined) dbUpdates.goal_id = updates.goalId;
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.position !== undefined) dbUpdates.position = updates.position;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.archivedAt !== undefined)
        dbUpdates.archived_at = updates.archivedAt?.toISOString();
      if (updates.completionNotes !== undefined)
        dbUpdates.completion_notes = updates.completionNotes;

      const { data, error } = await supabase
        .from('projects')
        // @ts-expect-error - Supabase type inference issue
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Delete project mutation
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Swap projects (activate one, park another)
export function useSwapProjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectToActivate,
      projectToPark,
      newPosition,
    }: {
      projectToActivate: string;
      projectToPark: string;
      newPosition: number;
    }) => {
      // Update both projects in a transaction-like manner
      const { error: parkError } = await supabase
        .from('projects')
        // @ts-expect-error - Supabase type inference issue
        .update({ status: 'parked' })
        .eq('id', projectToPark);

      if (parkError) throw parkError;

      const { error: activateError } = await supabase
        .from('projects')
        // @ts-expect-error - Supabase type inference issue
        .update({ status: 'active', position: newPosition })
        .eq('id', projectToActivate);

      if (activateError) throw activateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Check if can activate a new project (must have < 3 active non-life-ops projects)
export function canActivateProject(projects: Project[]): boolean {
  const activeNonLifeOps = projects.filter((p) => p.status === 'active' && !p.isLifeOps);
  return activeNonLifeOps.length < 3;
}
