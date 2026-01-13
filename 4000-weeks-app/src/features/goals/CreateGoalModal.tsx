import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useCreateGoal } from './useGoals';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateGoalModal({ isOpen, onClose, onSuccess }: CreateGoalModalProps) {
  const currentYear = new Date().getFullYear();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(currentYear);

  const createGoal = useCreateGoal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createGoal.mutateAsync({
        title,
        description,
        year,
        status: 'active',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setYear(currentYear);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setYear(currentYear);
    onClose();
  };

  // Generate year options (current year and next 2 years)
  const yearOptions = [currentYear, currentYear + 1, currentYear + 2];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Annual Goal" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Helpful Context */}
        <div className="prose prose-sm max-w-none">
          <p className="text-small text-warm-600 leading-relaxed">
            Annual goals are specific, measurable objectives that guide your project choices.
            Each goal should connect to your broader 5+ year vision.
          </p>
        </div>

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
            placeholder="What does success look like? How will you know when you've achieved this?"
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

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={handleClose} className="btn btn-secondary flex-1">
            Cancel
          </button>
          <button
            type="submit"
            disabled={createGoal.isPending || !title.trim()}
            className="btn btn-primary flex-1"
          >
            {createGoal.isPending ? 'Creating...' : 'Create Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
