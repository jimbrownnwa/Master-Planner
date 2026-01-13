import { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useUpdateVision } from './useVision';

interface VisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialVision: string;
}

export function VisionModal({
  isOpen,
  onClose,
  onSuccess,
  initialVision,
}: VisionModalProps) {
  const [vision, setVision] = useState(initialVision);
  const updateVision = useUpdateVision();

  // Update local state when initialVision changes
  useEffect(() => {
    if (isOpen) {
      setVision(initialVision);
    }
  }, [isOpen, initialVision]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateVision.mutateAsync(vision);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating vision:', error);
    }
  };

  const handleClose = () => {
    setVision(initialVision);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Your 5+ Year Vision" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Vision Prompt */}
        <div className="prose prose-sm max-w-none">
          <p className="text-small text-warm-600 leading-relaxed">
            Where do you want your life to be in 5+ years? Think beyond career goals—consider
            relationships, health, creative pursuits, and the kind of person you want to become.
            This vision will guide your annual goals and project choices.
          </p>
        </div>

        {/* Vision Text Area */}
        <div>
          <label htmlFor="vision" className="block text-small font-medium text-warm-700 mb-2">
            Your Vision
          </label>
          <textarea
            id="vision"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="textarea min-h-[300px]"
            placeholder="In 5+ years, I see myself..."
            autoFocus
          />
          <p className="text-tiny text-warm-500 mt-2">
            This is for you. Be honest, be specific, be aspirational.
          </p>
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
            disabled={updateVision.isPending}
            className="btn btn-primary flex-1"
          >
            {updateVision.isPending ? 'Saving...' : 'Save Vision'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
