import { useState } from 'react';
import { Plus, MoreVertical, Archive, Edit2 } from 'lucide-react';
import type { Project, Task } from '../../lib/types';
import { PROJECT_COLORS } from '../../lib/types';
import { useTasks } from '../tasks/useTasks';
import { CreateTaskModal } from '../tasks/CreateTaskModal';
import { EditTaskModal } from '../tasks/EditTaskModal';

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onPark?: () => void;
}

export function ProjectCard({ project, onEdit, onPark }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { data: tasks = [] } = useTasks(project.id);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsEditTaskOpen(true);
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');
  const colorValues = PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS] || PROJECT_COLORS.sage;

  return (
    <div className="card-hover p-4 mb-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          {/* Color indicator */}
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: colorValues.DEFAULT }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-medium text-warm-800 truncate">
              {project.title}
            </h4>
            {project.isLifeOps && (
              <span className="badge bg-amber-100 text-amber-700 text-tiny mt-1">
                Always Active
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        {!project.isLifeOps && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-warm-400 hover:text-warm-600 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-6 bg-white border border-warm-200 rounded-button shadow-soft-lg py-1 z-20 min-w-[140px]">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit?.();
                    }}
                    className="w-full px-3 py-2 text-left text-small hover:bg-warm-50 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onPark?.();
                    }}
                    className="w-full px-3 py-2 text-left text-small hover:bg-warm-50 flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    Park Project
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Task count */}
      <div className="text-tiny text-warm-500 mb-3">
        {pendingTasks.length} {pendingTasks.length === 1 ? 'task' : 'tasks'}
      </div>

      {/* Tasks list */}
      {pendingTasks.length > 0 && (
        <div className="space-y-1 mb-3">
          {pendingTasks.slice(0, 3).map((task) => (
            <button
              key={task.id}
              onClick={() => handleEditTask(task)}
              className="w-full text-left text-small text-warm-700 truncate py-1 px-2 hover:bg-warm-50 rounded cursor-pointer transition-colors flex items-start gap-2"
            >
              <span className="text-warm-400">•</span>
              <span className="flex-1 truncate">{task.title}</span>
              {task.estimatedMinutes && (
                <span className="text-tiny text-warm-500">{task.estimatedMinutes}m</span>
              )}
            </button>
          ))}
          {pendingTasks.length > 3 && (
            <div className="text-tiny text-warm-500 px-2 pt-1">
              +{pendingTasks.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Add task button */}
      <button
        onClick={() => setIsCreateTaskOpen(true)}
        className="w-full btn btn-ghost text-small py-1.5 flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </button>

      {/* Task Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        defaultProjectId={project.id}
        onSuccess={() => {}}
      />

      <EditTaskModal
        isOpen={isEditTaskOpen}
        onClose={() => {
          setIsEditTaskOpen(false);
          setTaskToEdit(null);
        }}
        task={taskToEdit}
        onSuccess={() => {}}
      />
    </div>
  );
}
