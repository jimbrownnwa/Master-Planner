import { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useUpdateTask, useDeleteTask } from './useTasks';
import { useActiveProjects } from '../projects/useProjects';
import { PROJECT_COLORS } from '../../lib/types';
import type { Task, ProjectColorName } from '../../lib/types';
import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSuccess?: () => void;
}

export function EditTaskModal({
  isOpen,
  onClose,
  task,
  onSuccess,
}: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed' | 'skipped'>('pending');
  const [scheduledDate, setScheduledDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: projects = [] } = useActiveProjects();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  // Populate form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setProjectId(task.projectId);
      setEstimatedMinutes(task.estimatedMinutes ? String(task.estimatedMinutes) : '');
      setStatus(task.status);
      setScheduledDate(task.scheduledDate ? format(task.scheduledDate, 'yyyy-MM-dd') : '');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !title.trim()) return;

    try {
      await updateTask.mutateAsync({
        id: task.id,
        updates: {
          title: title.trim(),
          estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : null,
          status,
          scheduledDate: scheduledDate ? parseISO(scheduledDate + 'T12:00:00') : null,
        },
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    try {
      await deleteTask.mutateAsync(task.id);
      setShowDeleteConfirm(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!task) return null;

  const selectedProject = projects.find((p) => p.id === projectId);
  const projectColor = selectedProject
    ? PROJECT_COLORS[selectedProject.color as ProjectColorName]?.DEFAULT
    : PROJECT_COLORS.sage.DEFAULT;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Task" size="md">
      {!showDeleteConfirm ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-small font-medium text-warm-700 mb-2">
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="e.g., Write project proposal"
              required
              maxLength={200}
              autoFocus
            />
          </div>

          {/* Project (display only - can't change) */}
          <div>
            <label className="block text-small font-medium text-warm-700 mb-2">
              Project
            </label>
            <div className="flex items-center gap-2 p-3 bg-warm-50 rounded-button">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: projectColor }}
              />
              <span className="text-small text-warm-800">
                {selectedProject?.title || 'Unknown Project'}
              </span>
            </div>
            <p className="text-tiny text-warm-500 mt-1">
              Project cannot be changed after creation
            </p>
          </div>

          {/* Estimated Minutes */}
          <div>
            <label htmlFor="minutes" className="block text-small font-medium text-warm-700 mb-2">
              Estimated Time (optional)
            </label>
            <div className="flex gap-2 items-center">
              <input
                id="minutes"
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="input flex-1"
                placeholder="30"
                min="1"
                max="480"
              />
              <span className="text-small text-warm-600">minutes</span>
            </div>
          </div>

          {/* Scheduled Date */}
          <div>
            <label htmlFor="date" className="block text-small font-medium text-warm-700 mb-2">
              Schedule for (optional)
            </label>
            <input
              id="date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="input"
            />
            {scheduledDate && (
              <button
                type="button"
                onClick={() => setScheduledDate('')}
                className="text-tiny text-warm-500 hover:text-warm-700 mt-1"
              >
                Clear date
              </button>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-small font-medium text-warm-700 mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'pending', label: 'To Do' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'skipped', label: 'Skipped' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 p-3 border rounded-button cursor-pointer transition-all ${
                    status === option.value
                      ? 'border-sienna-500 bg-sienna-50'
                      : 'border-warm-200 hover:border-warm-300 hover:bg-warm-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={status === option.value}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <span className="text-small text-warm-800">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {/* Delete button (left side) */}
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-ghost text-sienna-600 hover:bg-sienna-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>

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
              disabled={updateTask.isPending || !title.trim()}
              className="btn btn-primary"
            >
              {updateTask.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* Delete Confirmation */
        <div className="space-y-4">
          <div className="bg-sienna-50 border border-sienna-200 rounded-button p-4">
            <p className="text-small text-warm-800 mb-2">
              <strong>Are you sure you want to delete "{task.title}"?</strong>
            </p>
            <p className="text-small text-warm-600">
              This action cannot be undone.
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
              disabled={deleteTask.isPending}
              className="btn btn-primary bg-sienna-600 hover:bg-sienna-700 flex-1"
            >
              {deleteTask.isPending ? 'Deleting...' : 'Delete Task'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
