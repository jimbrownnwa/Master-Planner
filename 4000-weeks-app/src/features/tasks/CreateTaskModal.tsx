import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useCreateTask } from './useTasks';
import { useActiveProjects } from '../projects/useProjects';
import { PROJECT_COLORS } from '../../lib/types';
import type { ProjectColorName } from '../../lib/types';
import { format, parseISO } from 'date-fns';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
  defaultDate?: Date;
  onSuccess?: () => void;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  defaultProjectId,
  defaultDate,
  onSuccess,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || '');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed' | 'skipped'>('pending');
  const [scheduledDate, setScheduledDate] = useState(
    defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );

  const { data: projects = [] } = useActiveProjects();
  const createTask = useCreateTask();

  // Update projectId when defaultProjectId changes
  useState(() => {
    if (defaultProjectId) setProjectId(defaultProjectId);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !projectId) return;

    try {
      await createTask.mutateAsync({
        projectId,
        title: title.trim(),
        estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : null,
        status,
        scheduledDate: scheduledDate ? parseISO(scheduledDate + 'T12:00:00') : null,
      });

      // Reset form
      setTitle('');
      setProjectId(defaultProjectId || '');
      setEstimatedMinutes('');
      setStatus('pending');
      setScheduledDate(defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleClose = () => {
    setTitle('');
    setProjectId(defaultProjectId || '');
    setEstimatedMinutes('');
    setStatus('pending');
    setScheduledDate(defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
    onClose();
  };

  const selectedProject = projects.find((p) => p.id === projectId);
  const projectColor = selectedProject
    ? PROJECT_COLORS[selectedProject.color as ProjectColorName]?.DEFAULT
    : PROJECT_COLORS.sage.DEFAULT;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task" size="md">
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

        {/* Project */}
        <div>
          <label htmlFor="project" className="block text-small font-medium text-warm-700 mb-2">
            Project *
          </label>
          <div className="relative">
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="input pr-10"
              required
            >
              <option value="">Select a project...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
            {projectId && (
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full pointer-events-none"
                style={{ backgroundColor: projectColor }}
              />
            )}
          </div>
          <p className="text-tiny text-warm-500 mt-1">
            Tasks must belong to a project
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
            Schedule for
          </label>
          <input
            id="date"
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="input"
          />
          <p className="text-tiny text-warm-500 mt-1">
            Defaults to today. Clear to leave unscheduled.
          </p>
          {scheduledDate && (
            <button
              type="button"
              onClick={() => setScheduledDate('')}
              className="text-tiny text-sienna-600 hover:text-sienna-700 mt-1"
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
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createTask.isPending || !title.trim() || !projectId}
            className="btn btn-primary flex-1"
          >
            {createTask.isPending ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
