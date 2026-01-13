import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { useActiveProjects, useParkedProjects, canActivateProject } from '../features/projects/useProjects';
import { CreateProjectModal } from '../features/projects/CreateProjectModal';
import { EditProjectModal } from '../features/projects/EditProjectModal';
import { SwapProjectModal } from '../features/projects/SwapProjectModal';
import { VisionModal } from '../features/goals/VisionModal';
import { CreateGoalModal } from '../features/goals/CreateGoalModal';
import { EditGoalModal } from '../features/goals/EditGoalModal';
import { useVision } from '../features/goals/useVision';
import { useActiveGoals } from '../features/goals/useGoals';
import { PROJECT_COLORS } from '../lib/types';
import type { Project, AnnualGoal } from '../lib/types';

export function GoalsProjectsView() {
  const { data: activeProjects = [] } = useActiveProjects();
  const { data: parkedProjects = [] } = useParkedProjects();

  // Fetch user's vision
  const { data: vision = '' } = useVision();

  // Fetch active annual goals
  const { data: goals = [] } = useActiveGoals();

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToActivate, setProjectToActivate] = useState<Project | null>(null);
  const [goalToEdit, setGoalToEdit] = useState<AnnualGoal | null>(null);

  const activeNonLifeOps = activeProjects.filter((p) => !p.isLifeOps);
  const emptySlots = 3 - activeNonLifeOps.length;

  // Modal handlers
  const handleAddProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setIsEditModalOpen(true);
  };

  const handleActivateParkedProject = (project: Project) => {
    if (canActivateProject(activeProjects)) {
      // Can activate directly - not implemented yet
      console.log('Activate directly:', project.title);
    } else {
      // Need to swap
      setProjectToActivate(project);
      setIsSwapModalOpen(true);
    }
  };

  const handleAddGoal = () => {
    setIsCreateGoalModalOpen(true);
  };

  const handleEditGoal = (goal: AnnualGoal) => {
    setGoalToEdit(goal);
    setIsEditGoalModalOpen(true);
  };

  const handleModalSuccess = () => {
    // React Query will handle cache invalidation
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Vision Statement */}
      <div className="mb-12 animate-fade-in">
        <div className="card p-6">
          <h2 className="text-h3 mb-4 flex items-center gap-2">
            <span>Your 5+ Year Vision</span>
            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="btn btn-ghost text-tiny px-2 py-1"
            >
              Edit
            </button>
          </h2>

          {vision ? (
            <div className="prose prose-sm max-w-none">
              <p className="text-body text-warm-700 leading-relaxed whitespace-pre-wrap">
                {vision}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-warm-500 mb-4">
                Where do you want your life to be in 5+ years?
              </p>
              <button
                onClick={() => setIsVisionModalOpen(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your Vision
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Annual Goals */}
      <div className="mb-12 animate-slide-up animate-delay-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-h2">2026 Goals</h2>
            <p className="text-small text-warm-600">What do you want to accomplish this year?</p>
          </div>
          <button onClick={handleAddGoal} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </button>
        </div>

        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, index: number) => {
              const linkedProjects = activeProjects.filter((p) => p.goalId === goal.id);

              return (
                <button
                  key={goal.id}
                  onClick={() => handleEditGoal(goal)}
                  className="card p-6 animate-slide-up text-left hover:shadow-md transition-shadow cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-sienna-100 rounded-button flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-sienna-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-h4 mb-2">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-small text-warm-600 mb-3">{goal.description}</p>
                      )}

                      {linkedProjects.length > 0 && (
                        <div>
                          <p className="text-tiny text-warm-500 mb-2">Active projects:</p>
                          <div className="flex flex-wrap gap-2">
                            {linkedProjects.map((project) => (
                              <div
                                key={project.id}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-warm-50 rounded-button"
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      PROJECT_COLORS[
                                        project.color as keyof typeof PROJECT_COLORS
                                      ]?.DEFAULT || PROJECT_COLORS.sage.DEFAULT,
                                  }}
                                />
                                <span className="text-tiny text-warm-700">{project.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Target className="w-12 h-12 text-warm-300 mx-auto mb-4" />
            <p className="text-warm-500 mb-4">No annual goals yet</p>
            <p className="text-small text-warm-400 mb-6">
              Set clear objectives for the year to guide your project choices
            </p>
            <button onClick={handleAddGoal} className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* Active Projects - Visual Slots */}
      <div className="mb-12 animate-slide-up animate-delay-200">
        <h2 className="text-h2 mb-6">Active Projects (3 + Life Ops)</h2>

        <div className="grid grid-cols-4 gap-4">
          {/* Active project slots */}
          {activeNonLifeOps.map((project, index) => (
            <button
              key={project.id}
              onClick={() => handleEditProject(project)}
              className="card p-6 text-left hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS]?.DEFAULT ||
                      PROJECT_COLORS.sage.DEFAULT,
                  }}
                />
                <span className="text-tiny text-warm-500">Slot {index + 1}</span>
              </div>
              <h3 className="text-h4 mb-2">{project.title}</h3>
              {project.description && (
                <p className="text-small text-warm-600 line-clamp-2">{project.description}</p>
              )}
            </button>
          ))}

          {/* Empty slots */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <div key={`empty-${index}`} className="card p-6 border-dashed">
              <div className="text-center py-4">
                <p className="text-tiny text-warm-400 mb-3">Slot {activeNonLifeOps.length + index + 1}</p>
                <button onClick={handleAddProject} className="btn btn-ghost text-small">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Project
                </button>
              </div>
            </div>
          ))}

          {/* Life Ops (always active) */}
          {activeProjects.filter((p) => p.isLifeOps).map((project) => (
            <button
              key={project.id}
              onClick={() => handleEditProject(project)}
              className="card p-6 bg-amber-50/50 border-amber-200 text-left hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="mb-3">
                <span className="badge bg-amber-100 text-amber-700 text-tiny">Always Active</span>
              </div>
              <h3 className="text-h4 mb-2">{project.title}</h3>
              {project.description && (
                <p className="text-small text-warm-600 line-clamp-2">{project.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Parking Lot */}
      {parkedProjects.length > 0 && (
        <div className="animate-slide-up animate-delay-300">
          <h2 className="text-h2 mb-6">
            Parking Lot <span className="text-warm-500">({parkedProjects.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parkedProjects.map((project) => (
              <div key={project.id} className="card p-6 bg-warm-50">
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="flex items-center gap-2 flex-1 text-left hover:opacity-80 transition-opacity"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS]?.DEFAULT ||
                          PROJECT_COLORS.sage.DEFAULT,
                      }}
                    />
                    <h3 className="text-h4">{project.title}</h3>
                  </button>
                  <button
                    onClick={() => handleActivateParkedProject(project)}
                    className="btn btn-secondary text-tiny px-3 py-1"
                  >
                    Activate
                  </button>
                </div>
                {project.description && (
                  <p className="text-small text-warm-600">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <VisionModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
        onSuccess={handleModalSuccess}
        initialVision={vision}
      />

      <CreateGoalModal
        isOpen={isCreateGoalModalOpen}
        onClose={() => setIsCreateGoalModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <EditGoalModal
        isOpen={isEditGoalModalOpen}
        onClose={() => {
          setIsEditGoalModalOpen(false);
          setGoalToEdit(null);
        }}
        goal={goalToEdit}
        onSuccess={handleModalSuccess}
      />

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
        activeProjectsCount={activeNonLifeOps.length}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setProjectToEdit(null);
        }}
        project={projectToEdit}
        onSuccess={handleModalSuccess}
      />

      <SwapProjectModal
        isOpen={isSwapModalOpen}
        onClose={() => {
          setIsSwapModalOpen(false);
          setProjectToActivate(null);
        }}
        projectToActivate={projectToActivate}
        activeProjects={activeProjects}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
