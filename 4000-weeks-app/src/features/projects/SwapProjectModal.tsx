import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useSwapProjects } from './useProjects';
import type { Project } from '../../lib/types';
import { PROJECT_COLORS } from '../../lib/types';
import { ArrowRightLeft } from 'lucide-react';

interface SwapProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToActivate: Project | null;
  activeProjects: Project[];
  onSuccess?: () => void;
}

export function SwapProjectModal({
  isOpen,
  onClose,
  projectToActivate,
  activeProjects,
  onSuccess,
}: SwapProjectModalProps) {
  const [selectedProjectToPark, setSelectedProjectToPark] = useState<string>('');
  const swapProjects = useSwapProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectToActivate || !selectedProjectToPark) return;

    // Find the project to park to get its position
    const projectToPark = activeProjects.find((p) => p.id === selectedProjectToPark);
    if (!projectToPark) return;

    try {
      await swapProjects.mutateAsync({
        projectToActivate: projectToActivate.id,
        projectToPark: selectedProjectToPark,
        newPosition: projectToPark.position,
      });

      setSelectedProjectToPark('');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error swapping projects:', error);
    }
  };

  const handleClose = () => {
    setSelectedProjectToPark('');
    onClose();
  };

  // Filter out Life Ops from selectable projects
  const selectableProjects = activeProjects.filter((p) => !p.isLifeOps);

  if (!projectToActivate) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Choose Project to Park" size="md">
      <div className="space-y-5">
        {/* Explanation */}
        <div className="bg-amber-50 border border-amber-200 rounded-button p-4">
          <p className="text-small text-warm-800 mb-2">
            <strong>You've reached the 3-project limit</strong>
          </p>
          <p className="text-small text-warm-600">
            To activate "{projectToActivate.title}", you need to park one of your current active projects.
            Don't worry - you can always swap them back later!
          </p>
        </div>

        {/* Project to Activate */}
        <div className="card p-4 bg-sienna-50 border-sienna-200">
          <p className="text-tiny text-warm-600 mb-2">Activating</p>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{
                backgroundColor:
                  PROJECT_COLORS[projectToActivate.color as keyof typeof PROJECT_COLORS]?.DEFAULT ||
                  PROJECT_COLORS.sage.DEFAULT,
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-medium text-warm-800 truncate">
                {projectToActivate.title}
              </h4>
              {projectToActivate.description && (
                <p className="text-tiny text-warm-600 truncate">{projectToActivate.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-warm-100 rounded-full flex items-center justify-center">
            <ArrowRightLeft className="w-4 h-4 text-warm-600" />
          </div>
        </div>

        {/* Select Project to Park */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-small font-medium text-warm-700 mb-3">
              Choose which project to park:
            </label>

            {selectableProjects.map((project) => (
              <label
                key={project.id}
                className={`flex items-start gap-3 p-4 border rounded-button cursor-pointer transition-all ${
                  selectedProjectToPark === project.id
                    ? 'border-sienna-500 bg-sienna-50'
                    : 'border-warm-200 hover:border-warm-300 hover:bg-warm-50'
                }`}
              >
                <input
                  type="radio"
                  name="projectToPark"
                  value={project.id}
                  checked={selectedProjectToPark === project.id}
                  onChange={(e) => setSelectedProjectToPark(e.target.value)}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor:
                        PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS]?.DEFAULT ||
                        PROJECT_COLORS.sage.DEFAULT,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-medium text-warm-800 truncate">
                      {project.title}
                    </h4>
                    {project.description && (
                      <p className="text-tiny text-warm-600 line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    )}
                    <p className="text-tiny text-warm-500 mt-1">Slot {project.position}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={swapProjects.isPending || !selectedProjectToPark}
              className="btn btn-primary flex-1"
            >
              {swapProjects.isPending ? 'Swapping...' : 'Swap Projects'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
