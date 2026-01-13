import { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useUpdateGoal, useDeleteGoal } from './useGoals';
import type { AnnualGoal } from '../../lib/types';
import { Trash2 } from 'lucide-react';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  goal: AnnualGoal | null;
}

export function EditGoalModal({ isOpen, onClose, onSuccess, goal }: EditGoalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState<'active' | 'completed' | 'abandoned'>('active');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  // Update form when goal changes
  useEffect(() => {
    if (goal && isOpen) {
      setTitle(goal.title);
      setDescription(goal.description);
      setYear(goal.year);
      setStatus(goal.status);
      setShowDeleteConfirm(false);
    }
  }, [goal, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        updates: {
          title,
          description,
          year,
          status,
        },
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDelete = async () => {
    if (!goal) return;

    try {
      await deleteGoal.mutateAsync(goal.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!goal) return null;

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear + 1, currentYear + 2];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Goal" size="md">
      {!showDeleteConfirm ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-small font-medium text-warm-700 mb-2">
              Goal Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="e.g., Launch my first product"
              required
              maxLength={200}
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
              className="textarea min-h-[120px]"
              placeholder="What does success look like?"
              maxLength={1000}
            />
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-small font-medium text-warm-700 mb-2">
              Target Year *
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="input"
              required
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                  {y === currentYear && ' (This year)'}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-small font-medium text-warm-700 mb-2">
              Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-warm-200 rounded-button cursor-pointer hover:bg-warm-50">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === 'active'}
                  onChange={(e) => setStatus(e.target.value as 'active')}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="text-small font-medium text-warm-800">Active</div>
                  <div className="text-tiny text-warm-600">Currently working toward this goal</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-warm-200 rounded-button cursor-pointer hover:bg-warm-50">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={status === 'completed'}
                  onChange={(e) => setStatus(e.target.value as 'completed')}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="text-small font-medium text-warm-800">Completed</div>
                  <div className="text-tiny text-warm-600">Goal achieved</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-warm-200 rounded-button cursor-pointer hover:bg-warm-50">
                <input
                  type="radio"
                  name="status"
                  value="abandoned"
                  checked={status === 'abandoned'}
                  onChange={(e) => setStatus(e.target.value as 'abandoned')}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="text-small font-medium text-warm-800">Abandoned</div>
                  <div className="text-tiny text-warm-600">No longer pursuing this goal</div>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-ghost text-sienna-600 hover:bg-sienna-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
            <div className="flex-1" />
            <button type="button" onClick={handleClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateGoal.isPending || !title.trim()}
              className="btn btn-primary"
            >
              {updateGoal.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-5">
          {/* Delete Confirmation */}
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-sienna-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-sienna-600" />
            </div>
            <h3 className="text-h4 mb-2">Delete this goal?</h3>
            <p className="text-small text-warm-600 mb-4">
              This will remove the goal and unlink any associated projects. This action cannot be undone.
            </p>
          </div>

          {/* Delete Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteGoal.isPending}
              className="btn bg-sienna-600 text-white hover:bg-sienna-700 flex-1"
            >
              {deleteGoal.isPending ? 'Deleting...' : 'Delete Goal'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
