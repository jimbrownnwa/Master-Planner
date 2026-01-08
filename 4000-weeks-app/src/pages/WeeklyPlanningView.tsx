import { useState } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useActiveProjects, useParkedProjects } from '../features/projects/useProjects';
import { ProjectCard } from '../features/projects/ProjectCard';
import { useTasksByDate, useWeekTasks } from '../features/tasks/useTasks';
import { PROJECT_COLORS } from '../lib/types';

export function WeeklyPlanningView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: activeProjects = [] } = useActiveProjects();
  const { data: parkedProjects = [] } = useParkedProjects();
  const { data: weekTasks = [] } = useWeekTasks(currentWeekStart);
  const { data: todayTasks = [] } = useTasksByDate(new Date());

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const goToPreviousWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const goToNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
    setSelectedDate(today);
  };

  // Calculate today's committed hours
  const todayMinutes = todayTasks
    .filter((t) => t.status !== 'skipped')
    .reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const todayHours = (todayMinutes / 60).toFixed(1);

  // Group today's tasks by project
  const tasksByProject = todayTasks.reduce((acc, task) => {
    if (!acc[task.project.id]) {
      acc[task.project.id] = {
        project: task.project,
        tasks: [],
        totalMinutes: 0,
      };
    }
    acc[task.project.id].tasks.push(task);
    acc[task.project.id].totalMinutes += task.estimatedMinutes || 0;
    return acc;
  }, {} as Record<string, { project: any; tasks: any[]; totalMinutes: number }>);

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
              <ProjectCard project={project} />
            </div>
          ))}

          {activeProjects.filter((p) => !p.isLifeOps).length < 3 && (
            <button className="w-full btn btn-secondary py-3 flex items-center justify-center gap-2">
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
                <div key={project.id} className="p-3 bg-warm-50 rounded-button text-small">
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
                </div>
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
                (task) => task.scheduledDate && isSameDay(task.scheduledDate, day)
              );
              const isPast = day < new Date() && !isToday(day);
              const isTodayDay = isToday(day);

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
                      <div className="space-y-2">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-2 rounded text-tiny"
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
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-tiny text-warm-400 italic">No tasks scheduled</div>
                    )}
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
          <p className="text-tiny text-warm-500">{format(new Date(), 'EEEE, MMM d')}</p>
        </div>

        {/* Hours committed */}
        <div className="card p-4 mb-6 bg-gradient-to-br from-amber-50 to-sienna-50">
          <p className="text-tiny text-warm-600 mb-1">Choosing to spend today</p>
          <p className="text-h2 text-gradient-amber">{todayHours} hours</p>
          <p className="text-tiny text-warm-600 mt-1">on projects</p>
        </div>

        {/* Tasks by project */}
        {Object.values(tasksByProject).length > 0 ? (
          <div className="space-y-4">
            {Object.values(tasksByProject).map(({ project, tasks, totalMinutes }) => (
              <div key={project.id}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS]?.DEFAULT ||
                        PROJECT_COLORS.sage.DEFAULT,
                    }}
                  />
                  <span className="text-small font-medium text-warm-700">{project.title}</span>
                  <span className="text-tiny text-warm-500 ml-auto">
                    {(totalMinutes / 60).toFixed(1)}h
                  </span>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2 p-2 bg-warm-50 rounded text-small"
                    >
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => {
                          // Handle task completion
                        }}
                        className="checkbox mt-0.5"
                      />
                      <span className="flex-1 text-warm-700">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-small text-warm-500 italic">No tasks scheduled for today</p>
            <p className="text-tiny text-warm-400 mt-2">
              Add tasks to your projects and schedule them to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
