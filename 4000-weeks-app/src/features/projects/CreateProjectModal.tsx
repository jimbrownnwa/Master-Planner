import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useCreateProject } from './useProjects';
import { PROJECT_COLORS, type ProjectColorName } from '../../lib/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  activeProjectsCount: number;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
  activeProjectsCount
}: CreateProjectModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<ProjectColorName>('sage');
  const [goalId, setGoalId] = useState<string>('');
  const [status, setStatus] = useState<'active' | 'parked'>('active');

  const createProject = useCreateProject();

  // Fetch user's goals
  const { data: goals = [] } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('annual_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any[]) || [];
    },
    enabled: !!user && isOpen,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get next position
      const position = status === 'active' ? activeProjectsCount + 1 : 0;

      await createProject.mutateAsync({
        title,
        description,
        status,
        isLifeOps: false,
        position,
        color,
        goalId: goalId || null,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setColor('sage');
      setGoalId('');
      setStatus('active');

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setColor('sage');
    setGoalId('');
    setStatus('active');
    onClose();
  };

  // Check if we can create an active project
  const canMakeActive = activeProjectsCount < 3;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-small font-medium text-warm-700 mb-2">
            Project Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="e.g., Launch Product MVP"
            required
            maxLength={100}
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-small font-medium text-warm-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea min-h-[100px]"
            placeholder="What does this project involve?"
            maxLength={500}
          />
        </div>

        {/* Link to Goal */}
        {goals.length > 0 && (
          <div>
            <label htmlFor="goal" className="block text-small font-medium text-warm-700 mb-2">
              Link to Annual Goal (Optional)
            </label>
            <select
              id="goal"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className="input"
            >
              <option value="">No goal selected</option>
              {goals.map((goal: any) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Color Picker */}
        <div>
          <label className="block text-small font-medium text-warm-700 mb-2">
            Project Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(PROJECT_COLORS) as ProjectColorName[]).map((colorName) => {
              const colorValue = PROJECT_COLORS[colorName];
              return (
                <button
                  key={colorName}
                  type="button"
                  onClick={() => setColor(colorName)}
                  className={`w-10 h-10 rounded-button border-2 transition-all ${
                    color === colorName
                      ? 'border-warm-700 scale-110'
                      : 'border-warm-200 hover:border-warm-400'
                  }`}
                  style={{ backgroundColor: colorValue.DEFAULT }}
                  title={colorName}
                />
              );
            })}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-small font-medium text-warm-700 mb-2">
            Project Status
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-warm-200 rounded-button cursor-pointer hover:bg-warm-50">
              <input
                type="radio"
                name="status"
                value="active"
                checked={status === 'active'}
                onChange={(e) => setStatus(e.target.value as 'active')}
                disabled={!canMakeActive}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <div className="text-small font-medium text-warm-800">
                  Make Active {!canMakeActive && '(Limit Reached)'}
                </div>
                <div className="text-tiny text-warm-600">
                  Start working on this project immediately
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-warm-200 rounded-button cursor-pointer hover:bg-warm-50">
              <input
                type="radio"
                name="status"
                value="parked"
                checked={status === 'parked'}
                onChange={(e) => setStatus(e.target.value as 'parked')}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <div className="text-small font-medium text-warm-800">Add to Parking Lot</div>
                <div className="text-tiny text-warm-600">
                  Save for later, activate when ready
                </div>
              </div>
            </label>
          </div>

          {!canMakeActive && status === 'active' && (
            <p className="text-tiny text-sienna-600 mt-2">
              You already have 3 active projects. Park or complete one first, or add this to the parking lot.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createProject.isPending || !title.trim()}
            className="btn btn-primary flex-1"
          >
            {createProject.isPending ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
