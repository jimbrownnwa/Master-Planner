import { useState } from 'react';
import { Plus, MoreVertical, Archive, Edit2 } from 'lucide-react';
import type { Project } from '../../lib/types';
import { PROJECT_COLORS } from '../../lib/types';
import { useTasks, useCreateTask } from '../tasks/useTasks';

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onPark?: () => void;
}

export function ProjectCard({ project, onEdit, onPark }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const { data: tasks = [] } = useTasks(project.id);
  const createTask = useCreateTask();

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await createTask.mutateAsync({
      projectId: project.id,
      title: newTaskTitle,
      estimatedMinutes: null,
      status: 'pending',
      scheduledDate: null,
    });

    setNewTaskTitle('');
    setShowAddTask(false);
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

      {/* Tasks list (simplified for now) */}
      {pendingTasks.length > 0 && (
        <div className="space-y-1 mb-3">
          {pendingTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className="text-small text-warm-700 truncate py-1 px-2 hover:bg-warm-50 rounded cursor-pointer transition-colors"
            >
              • {task.title}
            </div>
          ))}
          {pendingTasks.length > 3 && (
            <div className="text-tiny text-warm-500 px-2 pt-1">
              +{pendingTasks.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Add task */}
      {showAddTask ? (
        <form onSubmit={handleAddTask} className="mt-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task name..."
            className="input text-small py-1.5"
            autoFocus
            onBlur={() => {
              if (!newTaskTitle.trim()) setShowAddTask(false);
            }}
          />
        </form>
      ) : (
        <button
          onClick={() => setShowAddTask(true)}
          className="w-full btn btn-ghost text-small py-1.5 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      )}
    </div>
  );
}
