import { useState } from 'react';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWeekTasks } from '../features/tasks/useTasks';
import { useActiveProjects } from '../features/projects/useProjects';
import { PROJECT_COLORS } from '../lib/types';

export function ReflectionView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const { data: weekTasks = [] } = useWeekTasks(currentWeekStart);
  const { data: activeProjects = [] } = useActiveProjects();

  const goToPreviousWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const goToNextWeek = () => setCurrentWeekStart((prev) => {
    const next = startOfWeek(new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000), {
      weekStartsOn: 1,
    });
    // Don't go beyond current week
    if (next > startOfWeek(new Date(), { weekStartsOn: 1 })) {
      return prev;
    }
    return next;
  });

  // Calculate stats
  const completedTasks = weekTasks.filter((t) => t.status === 'completed');
  const totalCommittedMinutes = weekTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const completedMinutes = completedTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);

  // Group tasks by project
  const tasksByProject = weekTasks.reduce((acc, task) => {
    if (!acc[task.project.id]) {
      acc[task.project.id] = {
        project: task.project,
        total: 0,
        completed: 0,
        minutes: 0,
      };
    }
    acc[task.project.id].total += 1;
    acc[task.project.id].minutes += task.estimatedMinutes || 0;
    if (task.status === 'completed') {
      acc[task.project.id].completed += 1;
    }
    return acc;
  }, {} as Record<string, any>);

  const isCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }).getTime() === currentWeekStart.getTime();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-display font-serif text-warm-800 mb-2">Reflection</h1>
          <p className="text-warm-600">Review and learn from your weeks</p>
        </div>
        <BookOpen className="w-12 h-12 text-warm-300" />
      </div>

      {/* Week selector */}
      <div className="card p-6 mb-8 animate-slide-up">
        <div className="flex items-center justify-between">
          <button onClick={goToPreviousWeek} className="btn btn-ghost p-2">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-h3">
              Week of {format(currentWeekStart, 'MMM d')} -{' '}
              {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
            </h2>
            {isCurrentWeek && (
              <span className="inline-block mt-2 badge bg-sienna-100 text-sienna-700">
                Current Week
              </span>
            )}
          </div>

          <button
            onClick={goToNextWeek}
            className="btn btn-ghost p-2"
            disabled={isCurrentWeek}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up animate-delay-100">
        <div className="card p-6 text-center">
          <p className="text-tiny text-warm-600 mb-2">Hours Committed</p>
          <p className="text-h2 text-warm-800">
            {(totalCommittedMinutes / 60).toFixed(1)}
          </p>
        </div>

        <div className="card p-6 text-center">
          <p className="text-tiny text-warm-600 mb-2">Tasks Completed</p>
          <p className="text-h2 text-warm-800">
            {completedTasks.length} / {weekTasks.length}
          </p>
        </div>

        <div className="card p-6 text-center">
          <p className="text-tiny text-warm-600 mb-2">Completion Rate</p>
          <p className="text-h2 text-warm-800">
            {weekTasks.length > 0
              ? Math.round((completedTasks.length / weekTasks.length) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Time by project */}
      <div className="card p-6 mb-8 animate-slide-up animate-delay-200">
        <h3 className="text-h4 mb-4">Time by Project</h3>

        {Object.keys(tasksByProject).length > 0 ? (
          <div className="space-y-4">
            {Object.values(tasksByProject).map(({ project, total, completed, minutes }: any) => {
              const progress = total > 0 ? (completed / total) * 100 : 0;
              const hours = (minutes / 60).toFixed(1);

              return (
                <div key={project.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS]?.DEFAULT ||
                            PROJECT_COLORS.sage.DEFAULT,
                        }}
                      />
                      <span className="text-small font-medium text-warm-800">{project.title}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-small text-warm-700">{hours} hours</p>
                      <p className="text-tiny text-warm-500">
                        {completed} / {total} tasks
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-warm-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor:
                          PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS]?.DEFAULT ||
                          PROJECT_COLORS.sage.DEFAULT,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-small text-warm-500 italic text-center py-8">
            No tasks scheduled for this week
          </p>
        )}
      </div>

      {/* Reflection prompts */}
      <div className="card p-6 animate-slide-up animate-delay-300">
        <h3 className="text-h4 mb-4">Weekly Reflection</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-small font-medium text-warm-700 mb-2">
              You spent week {Math.floor(weekTasks.length / 7)} on...
            </label>
            <textarea
              className="textarea min-h-[80px]"
              placeholder="Describe what occupied your time this week..."
            />
          </div>

          <div>
            <label className="block text-small font-medium text-warm-700 mb-2">
              Was this aligned with your goals?
            </label>
            <textarea
              className="textarea min-h-[80px]"
              placeholder="Reflect on whether your time was well-spent..."
            />
          </div>

          <div>
            <label className="block text-small font-medium text-warm-700 mb-2">
              What moved the needle toward your goals?
            </label>
            <textarea
              className="textarea min-h-[80px]"
              placeholder="Note what made real progress..."
            />
          </div>

          <div>
            <label className="block text-small font-medium text-warm-700 mb-2">
              What did you consciously choose NOT to do?
            </label>
            <textarea
              className="textarea min-h-[80px]"
              placeholder="Acknowledge the trade-offs you made..."
            />
          </div>

          <button className="btn btn-primary w-full py-3">Save Reflection</button>
        </div>
      </div>

      {/* Past reflections (placeholder) */}
      <div className="mt-12 animate-slide-up animate-delay-400">
        <h3 className="text-h3 mb-6">Past Reflections</h3>
        <div className="text-center py-12 card">
          <p className="text-small text-warm-500 italic">
            Your past reflections will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
