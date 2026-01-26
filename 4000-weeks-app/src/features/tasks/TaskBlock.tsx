import { useDraggable } from '@dnd-kit/core';
import { Circle, PlayCircle, CheckCircle2 } from 'lucide-react';
import { PROJECT_COLORS } from '../../lib/types';
import type { TaskWithProject } from '../../lib/types';
import { getSlotHeight, formatTimeSlot } from '../../lib/dnd-utils';

interface TaskBlockProps {
  task: TaskWithProject;
  isScheduled: boolean; // true if has time, false if unscheduled
  onClick?: () => void;
  onStatusChange?: () => void;
}

export function TaskBlock({ task, isScheduled, onClick, onStatusChange }: TaskBlockProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const projectColor = PROJECT_COLORS[task.project.color as keyof typeof PROJECT_COLORS]?.DEFAULT || PROJECT_COLORS.sage.DEFAULT;
  const projectColorLight = PROJECT_COLORS[task.project.color as keyof typeof PROJECT_COLORS]?.light || PROJECT_COLORS.sage.light;

  const height = isScheduled && task.estimatedMinutes
    ? getSlotHeight(task.estimatedMinutes)
    : 'auto';

  // Status icon component
  const StatusIcon = () => {
    if (task.status === 'pending') {
      return <Circle className="w-4 h-4 text-warm-400 hover:text-amber-500 transition-colors" />;
    } else if (task.status === 'in_progress') {
      return <PlayCircle className="w-4 h-4 text-amber-500 hover:text-green-500 transition-colors fill-amber-100" />;
    } else if (task.status === 'completed') {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }
    return <Circle className="w-4 h-4 text-warm-400" />;
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group rounded-button p-2.5 border-l-3 cursor-move transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${isScheduled ? 'absolute left-0 right-0 mx-2' : 'mb-2'} ${
        task.status === 'completed' ? 'opacity-60' : ''
      }`}
      style={{
        backgroundColor: projectColorLight + '30',
        borderLeftColor: projectColor,
        height: isScheduled ? `${height}px` : 'auto',
        minHeight: isScheduled ? '48px' : 'auto',
      }}
    >
      <div className="flex items-start gap-2 h-full">
        {/* Status icon button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange?.();
          }}
          className="flex-shrink-0 mt-0.5"
          type="button"
        >
          <StatusIcon />
        </button>

        {/* Task content */}
        <div
          className="flex-1 min-w-0 overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick?.();
            }
          }}
        >
          <div
            className={`text-small font-medium truncate ${
              task.status === 'completed' ? 'line-through text-warm-500' : 'text-warm-800'
            }`}
            title={task.title}
          >
            {task.title}
          </div>

          {/* Time display for scheduled tasks */}
          {isScheduled && task.scheduledStart && (
            <div className="text-tiny text-warm-600 mt-0.5">
              {formatTimeSlot(task.scheduledStart)}
              {task.scheduledEnd && ` - ${formatTimeSlot(task.scheduledEnd)}`}
            </div>
          )}

          {/* Duration display for unscheduled tasks */}
          {!isScheduled && task.estimatedMinutes && (
            <div className="text-tiny text-warm-600 mt-0.5">
              {task.estimatedMinutes} min
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
