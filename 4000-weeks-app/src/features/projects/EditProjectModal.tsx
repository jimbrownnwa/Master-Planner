import { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useUpdateProject, useDeleteProject } from './useProjects';
import { PROJECT_COLORS, type Project, type ProjectColorName } from '../../lib/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { Trash2 } from 'lucide-react';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess?: () => void;
}

export function EditProjectModal({
  isOpen,
  onClose,
  project,
  onSuccess,
}: EditProjectModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<ProjectColorName>('sage');
  const [goalId, setGoalId] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

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

  // Populate form when project changes
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description || '');
      setColor(project.color as ProjectColorName);
      setGoalId(project.goalId || '');
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      await updateProject.mutateAsync({
        id: project.id,
        updates: {
          title,
          description,
          color,
          goalId: goalId || null,
        },
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = async () => {
    if (!project) return;

    try {
      await deleteProject.mutateAsync(project.id);
      setShowDeleteConfirm(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Project" size="md">
      {!showDeleteConfirm ? (
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

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {/* Delete button (left side) */}
            {!project.isLifeOps && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-ghost text-sienna-600 hover:bg-sienna-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            )}

            <div className="flex-1" />

            {/* Cancel and Save (right side) */}
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProject.isPending || !title.trim()}
              className="btn btn-primary"
            >
              {updateProject.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* Delete Confirmation */
        <div className="space-y-4">
          <div className="bg-sienna-50 border border-sienna-200 rounded-button p-4">
            <p className="text-small text-warm-800 mb-2">
              <strong>Are you sure you want to delete "{project.title}"?</strong>
            </p>
            <p className="text-small text-warm-600">
              This will also delete all tasks associated with this project. This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteProject.isPending}
              className="btn btn-primary bg-sienna-600 hover:bg-sienna-700 flex-1"
            >
              {deleteProject.isPending ? 'Deleting...' : 'Delete Project'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
