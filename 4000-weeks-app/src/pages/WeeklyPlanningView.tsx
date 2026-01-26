import { useState } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useActiveProjects, useParkedProjects, canActivateProject } from '../features/projects/useProjects';
import { ProjectCard } from '../features/projects/ProjectCard';
import { CreateProjectModal } from '../features/projects/CreateProjectModal';
import { EditProjectModal } from '../features/projects/EditProjectModal';
import { SwapProjectModal } from '../features/projects/SwapProjectModal';
import { CreateTaskModal } from '../features/tasks/CreateTaskModal';
import { EditTaskModal } from '../features/tasks/EditTaskModal';
import { DayCalendarView } from '../features/tasks/DayCalendarView';
import { useTasksByDate, useWeekTasks, useUpdateTask } from '../features/tasks/useTasks';
import { PROJECT_COLORS } from '../lib/types';
import type { Project, TaskWithProject } from '../lib/types';

export function WeeklyPlanningView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // Create a stable today date that doesn't change on every render
  const [today] = useState(() => new Date());

  // Modal state for projects
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToActivate, setProjectToActivate] = useState<Project | null>(null);

  // Modal state for tasks
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskWithProject | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: activeProjects = [] } = useActiveProjects();
  const { data: parkedProjects = [] } = useParkedProjects();
  const { data: weekTasks = [] } = useWeekTasks(currentWeekStart);
  const { data: todayTasks = [], error: todayTasksError, isLoading: todayTasksLoading } = useTasksByDate(today);
  const updateTask = useUpdateTask();

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const goToPreviousWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const goToNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
  };

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
      // Can activate directly - not implemented yet, would need useUpdateProjectStatus
      console.log('Activate directly:', project.title);
    } else {
      // Need to swap
      setProjectToActivate(project);
      setIsSwapModalOpen(true);
    }
  };

  const handleModalSuccess = () => {
    // Modals will trigger React Query cache invalidation automatically
    // This is just for any additional UI state updates if needed
  };

  const handleCreateTaskOnDate = (date: Date) => {
    setSelectedDate(date);
    setIsCreateTaskOpen(true);
  };

  const handleEditTask = (task: TaskWithProject) => {
    setTaskToEdit(task);
    setIsEditTaskOpen(true);
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    try {
      await updateTask.mutateAsync({
        id: taskId,
        updates: {
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date() : undefined,
        },
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Debug logging for Today's Focus
  console.log('=== TODAY\'S FOCUS DEBUG ===');
  console.log('Today date:', format(today, 'yyyy-MM-dd'));
  console.log('Today tasks raw:', todayTasks);
  console.log('Today tasks loading:', todayTasksLoading);
  console.log('Today tasks error:', todayTasksError);

  // Separate tasks with and without time slots
  const activeTodayTasks = todayTasks.filter(
    (t) => t.status !== 'skipped' && t.status !== 'completed'
  );
  const todayTasksWithTime = activeTodayTasks.filter((t) => t.scheduledStart);
  const todayTasksWithoutTime = activeTodayTasks.filter((t) => !t.scheduledStart);

  console.log('Active today tasks after filter:', activeTodayTasks);
  console.log('Tasks with time:', todayTasksWithTime.length);
  console.log('Tasks without time:', todayTasksWithoutTime.length);

  // Calculate today's committed hours
  const todayMinutes = activeTodayTasks
    .reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const todayHours = (todayMinutes / 60).toFixed(1);

  return (
    <div className="h-[calc(100vh-73px)] flex">
      {/* Left Panel - Active Projects */}
      <div className="w-80 panel overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-h4 mb-1">Active Projects</h2>
          <p className="text-tiny text-warm-500">Choose up to 3 + Life Ops</p>
        </div>

        <div className="space-y-3 animate-slide-in">
          {activeProjects.map((project, index) => (
            <div
              key={project.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProjectCard
                project={project}
                onEdit={() => handleEditProject(project)}
              />
            </div>
          ))}

          {activeProjects.filter((p) => !p.isLifeOps).length < 3 && (
            <button
              onClick={handleAddProject}
              className="w-full btn btn-secondary py-3 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          )}
        </div>

        {parkedProjects.length > 0 && (
          <div className="mt-8">
            <h3 className="text-small font-medium text-warm-700 mb-3">
              Parking Lot ({parkedProjects.length})
            </h3>
            <div className="space-y-2">
              {parkedProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleActivateParkedProject(project)}
                  className="w-full p-3 bg-warm-50 hover:bg-warm-100 rounded-button text-small transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS]?.DEFAULT ||
                          PROJECT_COLORS.sage.DEFAULT,
                      }}
                    />
                    <span className="text-warm-700">{project.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Center Panel - Week Calendar */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Week navigation */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-h2">
                {format(currentWeekStart, 'MMMM yyyy')}
              </h2>
              <p className="text-small text-warm-600">
                Week of {format(currentWeekStart, 'MMM d')} -{' '}
                {format(addDays(currentWeekStart, 6), 'MMM d')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={goToPreviousWeek} className="btn btn-ghost p-2">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={goToToday} className="btn btn-secondary px-4">
                Today
              </button>
              <button onClick={goToNextWeek} className="btn btn-ghost p-2">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Week grid */}
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((day, index) => {
              const dayTasks = weekTasks.filter(
                (task) => task.scheduledDate &&
                         isSameDay(task.scheduledDate, day) &&
                         task.status !== 'skipped' &&
                         task.status !== 'completed'
              );
              const isPast = day < today && !isSameDay(day, today);
              const isTodayDay = isSameDay(day, today);

              return (
                <div
                  key={day.toISOString()}
                  className={`animate-slide-up ${
                    isPast ? 'opacity-60' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`card p-4 min-h-[200px] ${
                      isTodayDay ? 'ring-2 ring-sienna-500 bg-sienna-50/30' : ''
                    }`}
                  >
                    {/* Day header */}
                    <div className="mb-3">
                      <div className="text-tiny font-medium text-warm-600 uppercase">
                        {format(day, 'EEE')}
                      </div>
                      <div
                        className={`text-h4 ${
                          isTodayDay ? 'text-sienna-600' : 'text-warm-800'
                        }`}
                      >
                        {format(day, 'd')}
                      </div>
                    </div>

                    {/* Tasks */}
                    {dayTasks.length > 0 ? (
                      <div className="space-y-2 mb-3">
                        {dayTasks.map((task) => (
                          <button
                            key={task.id}
                            onClick={() => handleEditTask(task)}
                            className="w-full text-left p-2 rounded text-tiny cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor:
                                PROJECT_COLORS[
                                  task.project.color as keyof typeof PROJECT_COLORS
                                ]?.light + '20' || '#F5F2EA',
                              borderLeft: `3px solid ${
                                PROJECT_COLORS[
                                  task.project.color as keyof typeof PROJECT_COLORS
                                ]?.DEFAULT || PROJECT_COLORS.sage.DEFAULT
                              }`,
                            }}
                          >
                            <div className="font-medium text-warm-800 truncate">
                              {task.title}
                            </div>
                            {task.estimatedMinutes && (
                              <div className="text-warm-600 mt-0.5">
                                {task.estimatedMinutes} min
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-tiny text-warm-400 italic mb-3">No tasks scheduled</div>
                    )}

                    {/* Add task button */}
                    <button
                      onClick={() => handleCreateTaskOnDate(day)}
                      className="w-full py-1.5 text-tiny text-warm-500 hover:text-warm-700 hover:bg-warm-50 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Today's Focus */}
      <div className="w-80 panel overflow-y-auto p-6 border-l">
        <div className="mb-6">
          <h2 className="text-h4 mb-1">Today's Focus</h2>
          <p className="text-tiny text-warm-500">{format(today, 'EEEE, MMM d')}</p>
        </div>

        {/* Hours summary card */}
        <div className="card p-4 mb-6 bg-gradient-to-br from-amber-50 to-sienna-50">
          <p className="text-tiny text-warm-600 mb-1">Hours scheduled</p>
          <p className="text-h2 text-gradient-amber">{todayHours} hours</p>
          <p className="text-tiny text-warm-600 mt-1">
            {activeTodayTasks.filter(t => t.status === 'in_progress').length > 0 && (
              <span className="text-amber-600 font-medium">
                {activeTodayTasks.filter(t => t.status === 'in_progress').length} in progress
              </span>
            )}
          </p>
        </div>

        {/* Day calendar view */}
        <DayCalendarView
          date={today}
          scheduledTasks={todayTasksWithTime}
          unscheduledTasks={todayTasksWithoutTime}
          onTaskClick={handleEditTask}
          onTaskStatusChange={handleTaskStatusChange}
        />
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
        activeProjectsCount={activeProjects.filter((p) => !p.isLifeOps).length}
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

      {/* Task Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => {
          setIsCreateTaskOpen(false);
          setSelectedDate(null);
        }}
        defaultDate={selectedDate || undefined}
        onSuccess={handleModalSuccess}
      />

      <EditTaskModal
        isOpen={isEditTaskOpen}
        onClose={() => {
          setIsEditTaskOpen(false);
          setTaskToEdit(null);
        }}
        task={taskToEdit}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
