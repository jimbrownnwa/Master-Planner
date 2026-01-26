import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { addMinutes } from 'date-fns';
import { useUpdateTask } from './useTasks';
import { TimeGrid } from './TimeGrid';
import { TaskBlock } from './TaskBlock';
import { calculateTopOffset } from '../../lib/dnd-utils';
import type { TaskWithProject } from '../../lib/types';

interface DayCalendarViewProps {
  date: Date;
  scheduledTasks: TaskWithProject[];
  unscheduledTasks: TaskWithProject[];
  onTaskClick: (task: TaskWithProject) => void;
  onTaskStatusChange: (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => void;
}

export function DayCalendarView({
  date,
  scheduledTasks,
  unscheduledTasks,
  onTaskClick,
  onTaskStatusChange,
}: DayCalendarViewProps) {
  const [activeTask, setActiveTask] = useState<TaskWithProject | null>(null);
  const updateTask = useUpdateTask();

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as TaskWithProject;
    setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const task = active.data.current?.task as TaskWithProject;
    const slotData = over.data.current;

    if (!task || !slotData) {
      setActiveTask(null);
      return;
    }

    const startTime = slotData.slotDate;
    const endTime = task.estimatedMinutes
      ? addMinutes(startTime, task.estimatedMinutes)
      : addMinutes(startTime, 30); // Default 30 min

    try {
      await updateTask.mutateAsync({
        id: task.id,
        updates: {
          scheduledDate: startTime,
          scheduledStart: startTime,
          scheduledEnd: endTime,
        },
      });
    } catch (error) {
      console.error('Error scheduling task:', error);
    }

    setActiveTask(null);
  };

  const handleStatusCycle = (task: TaskWithProject) => {
    if (task.status === 'pending') {
      onTaskStatusChange(task.id, 'in_progress');
    } else if (task.status === 'in_progress') {
      onTaskStatusChange(task.id, 'completed');
    } else if (task.status === 'completed') {
      onTaskStatusChange(task.id, 'pending');
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {/* Unscheduled tasks section */}
      {unscheduledTasks.length > 0 && (
        <div className="mb-4 border-b border-warm-200 pb-4">
          <h3 className="text-small font-medium text-warm-700 mb-2">
            Unscheduled ({unscheduledTasks.length})
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {unscheduledTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskBlock
                  task={task}
                  isScheduled={false}
                  onClick={() => onTaskClick(task)}
                  onStatusChange={() => handleStatusCycle(task)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar grid with scheduled tasks */}
      <div className="relative">
        <TimeGrid date={date} />

        {/* Scheduled task blocks */}
        {scheduledTasks.map((task) => {
          if (!task.scheduledStart) return null;

          const topOffset = calculateTopOffset(task.scheduledStart);

          return (
            <div
              key={task.id}
              style={{ position: 'absolute', top: `${topOffset}px`, left: 0, right: 0 }}
              className="pl-20"
            >
              <TaskBlock
                task={task}
                isScheduled={true}
                onClick={() => onTaskClick(task)}
                onStatusChange={() => handleStatusCycle(task)}
              />
            </div>
          );
        })}
      </div>

      {/* Drag overlay for smooth dragging experience */}
      <DragOverlay>
        {activeTask && (
          <div className="w-64">
            <TaskBlock task={activeTask} isScheduled={false} />
          </div>
        )}
      </DragOverlay>

      {/* Empty state */}
      {unscheduledTasks.length === 0 && scheduledTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-small text-warm-500 italic">No tasks scheduled for today</p>
          <p className="text-tiny text-warm-400 mt-2">
            Add tasks from the week calendar
          </p>
        </div>
      )}
    </DndContext>
  );
}
