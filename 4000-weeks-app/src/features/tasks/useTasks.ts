import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import type { Task, TaskWithProject } from '../../lib/types';
import { format, startOfWeek, endOfWeek } from 'date-fns';

// Fetch tasks for a specific project
export function useTasks(projectId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async (): Promise<Task[]> => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((row) => ({
        id: row.id,
        projectId: row.project_id,
        title: row.title,
        estimatedMinutes: row.estimated_minutes,
        status: row.status as 'pending' | 'in_progress' | 'completed' | 'skipped',
        scheduledDate: row.scheduled_date ? new Date(row.scheduled_date) : null,
        completedAt: row.completed_at ? new Date(row.completed_at) : null,
        createdAt: new Date(row.created_at),
      }));
    },
    enabled: !!user && !!projectId,
  });
}

// Fetch tasks by date (for calendar view)
export function useTasksByDate(date: Date | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tasks', 'byDate', date?.toISOString()],
    queryFn: async (): Promise<TaskWithProject[]> => {
      if (!date || !user) return [];

      const dateStr = format(date, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*)
        `)
        .eq('scheduled_date', dateStr)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map((row) => ({
        id: row.id,
        projectId: row.project_id,
        title: row.title,
        estimatedMinutes: row.estimated_minutes,
        status: row.status as 'pending' | 'in_progress' | 'completed' | 'skipped',
        scheduledDate: row.scheduled_date ? new Date(row.scheduled_date) : null,
        completedAt: row.completed_at ? new Date(row.completed_at) : null,
        createdAt: new Date(row.created_at),
        project: {
          id: row.project.id,
          userId: row.project.user_id,
          goalId: row.project.goal_id,
          title: row.project.title,
          description: row.project.description || '',
          status: row.project.status,
          isLifeOps: row.project.is_life_ops,
          position: row.project.position,
          color: row.project.color,
          createdAt: new Date(row.project.created_at),
          archivedAt: row.project.archived_at ? new Date(row.project.archived_at) : null,
          completionNotes: row.project.completion_notes,
        },
      }));
    },
    enabled: !!user && !!date,
  });
}

// Fetch tasks for current week
export function useWeekTasks(weekStart: Date) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tasks', 'week', weekStart.toISOString()],
    queryFn: async (): Promise<TaskWithProject[]> => {
      if (!user) return [];

      const start = format(startOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const end = format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*)
        `)
        .gte('scheduled_date', start)
        .lte('scheduled_date', end)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      return data.map((row) => ({
        id: row.id,
        projectId: row.project_id,
        title: row.title,
        estimatedMinutes: row.estimated_minutes,
        status: row.status as 'pending' | 'in_progress' | 'completed' | 'skipped',
        scheduledDate: row.scheduled_date ? new Date(row.scheduled_date) : null,
        completedAt: row.completed_at ? new Date(row.completed_at) : null,
        createdAt: new Date(row.created_at),
        project: {
          id: row.project.id,
          userId: row.project.user_id,
          goalId: row.project.goal_id,
          title: row.project.title,
          description: row.project.description || '',
          status: row.project.status,
          isLifeOps: row.project.is_life_ops,
          position: row.project.position,
          color: row.project.color,
          createdAt: new Date(row.project.created_at),
          archivedAt: row.project.archived_at ? new Date(row.project.archived_at) : null,
          completionNotes: row.project.completion_notes,
        },
      }));
    },
    enabled: !!user,
  });
}

// Create task mutation
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>
    ) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          project_id: task.projectId,
          title: task.title,
          estimated_minutes: task.estimatedMinutes,
          status: task.status,
          scheduled_date: task.scheduledDate ? format(task.scheduledDate, 'yyyy-MM-dd') : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Update task mutation
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>;
    }) => {
      const dbUpdates: any = {};

      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.estimatedMinutes !== undefined)
        dbUpdates.estimated_minutes = updates.estimatedMinutes;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.scheduledDate !== undefined)
        dbUpdates.scheduled_date = updates.scheduledDate
          ? format(updates.scheduledDate, 'yyyy-MM-dd')
          : null;
      if (updates.completedAt !== undefined)
        dbUpdates.completed_at = updates.completedAt?.toISOString();

      const { data, error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Complete task mutation (convenience wrapper)
export function useCompleteTask() {
  const updateTask = useUpdateTask();

  return useMutation({
    mutationFn: async (id: string) => {
      return updateTask.mutateAsync({
        id,
        updates: {
          status: 'completed',
          completedAt: new Date(),
        },
      });
    },
  });
}

// Delete task mutation
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
